"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { TaskItem } from "@/shared/api/contracts";
import { TaskCard } from "@/entities/task/ui/task-card";
import { pageMeta } from "@/shared/config/page-meta";
import { Panel } from "@/shared/ui/panel";
import {
  type TaskFilter,
  type TaskListViewMode,
  type TaskSort,
  type TaskSortOrder,
} from "@/widgets/task-list/model/task-list-controls";
import { FilterDropdown } from "@/widgets/task-list/ui/controls/filter-dropdown";
import { SortDropdown } from "@/widgets/task-list/ui/controls/sort-dropdown";
import { ViewToggle } from "@/widgets/task-list/ui/controls/view-toggle";

type TaskListViewProps = {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onEndReached: () => void;
  tasks: TaskItem[];
};

const NEXT_PAGE_FETCH_THRESHOLD = 320;

// 정렬 기준과 방향에 따라 목록 정렬
function sortTasks(tasks: TaskItem[], taskSort: TaskSort, taskSortOrder: TaskSortOrder) {
  const nextTasks = [...tasks];
  const sortDirection = taskSortOrder === "asc" ? 1 : -1;

  if (taskSort === "TASK_ID") {
    nextTasks.sort((left, right) => left.id.localeCompare(right.id, "ko-KR") * sortDirection);
    return nextTasks;
  }

  if (taskSort === "TASK_NAME") {
    nextTasks.sort((left, right) => left.title.localeCompare(right.title, "ko-KR") * sortDirection);
    return nextTasks;
  }

  return nextTasks;
}

// 뷰 모드에 맞춰 카드 행 단위로 그룹화
function groupTasksByRow(tasks: TaskItem[], columnCount: number) {
  const groupedRows: TaskItem[][] = [];

  for (let index = 0; index < tasks.length; index += columnCount) {
    groupedRows.push(tasks.slice(index, index + columnCount));
  }

  return groupedRows;
}

/**
 * @page  - [할 일 목록]
 * @title - 목록 뷰 컴포넌트
 * @desc  - 가상 스크롤/무한 스크롤 방식의 리스트 렌더링 + 필터/정렬/뷰 전환
 */
export function TaskListView({
  hasNextPage,
  isFetchingNextPage,
  onEndReached,
  tasks,
}: TaskListViewProps) {
  /* ================================================================================== */
  /* state */
  /* ================================================================================== */

  const [viewMode, setViewMode] = useState<TaskListViewMode>("card");
  const [taskFilter, setTaskFilter] = useState<TaskFilter>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [taskSort, setTaskSort] = useState<TaskSort>("TASK_ID");
  const [taskSortOrder, setTaskSortOrder] = useState<TaskSortOrder>("asc");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  // 뷰 모드에 따른 한 행 카드 개수
  const columnCount = viewMode === "card" ? 2 : 1;

  // 기본 정렬 외 커스텀 정렬 여부
  const isCustomSortActive = taskSort !== "TASK_ID" || taskSortOrder !== "asc";

  // 필터 조건에 맞는 목록 추출
  const filteredTasks = useMemo(() => {
    if (taskFilter === "all") {
      return tasks;
    }

    return tasks.filter((task) => task.status.toLowerCase() === taskFilter);
  }, [taskFilter, tasks]);

  // 선택한 정렬 기준으로 목록 정렬
  const sortedTasks = useMemo(
    () => sortTasks(filteredTasks, taskSort, taskSortOrder),
    [filteredTasks, taskSort, taskSortOrder],
  );

  // 가상 스크롤 렌더링을 위한 행 단위 목록 구성
  const rows = useMemo(() => groupTasksByRow(sortedTasks, columnCount), [columnCount, sortedTasks]);

  /* ================================================================================== */
  /* function */
  /* ================================================================================== */

  // 스크롤 하단 근처에서 다음 페이지 요청
  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;
    const remainingScroll = scrollHeight - scrollTop - clientHeight;

    // 스크롤이 실제 하단 근처에 왔을 때만 다음 페이지 API를 호출
    if (remainingScroll <= NEXT_PAGE_FETCH_THRESHOLD) {
      onEndReached();
    }
  }

  /* ================================================================================== */
  /* useEffect() */
  /* ================================================================================== */

  // 드롭다운 바깥 클릭 시 필터/정렬 드롭다운 닫기
  useEffect(() => {
    if (!isFilterOpen && !isSortOpen) {
      return;
    }

    // 드롭다운이 열린 동안에만 쓰이는 외부 클릭 핸들러
    function handlePointerDown(event: PointerEvent) {
      if (
        controlsRef.current &&
        event.target instanceof Node &&
        !controlsRef.current.contains(event.target)
      ) {
        setIsFilterOpen(false);
        setIsSortOpen(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isFilterOpen, isSortOpen]);

  // 필터 또는 정렬 시 현재까지 로드된 일부 데이터만으로 결과가 왜곡되지 않도록 남은 페이지를 끝까지 추가 조회
  useEffect(() => {
    if ((!isCustomSortActive && taskFilter === "all") || !hasNextPage || isFetchingNextPage) {
      return;
    }

    onEndReached();
  }, [hasNextPage, isCustomSortActive, isFetchingNextPage, onEndReached, taskFilter, tasks.length]);

  /* ================================================================================== */
  /* virtual scroll */
  /* ================================================================================== */

  // TanStack Virtual 훅은 React Compiler의 incompatible-library 경고 대상이라
  // 가상 스크롤 구현이 필요한 이 지점에서만 예외 처리합니다.
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => (viewMode === "card" ? 200 : 138),
    getScrollElement: () => scrollRef.current,
    overscan: 5,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  const totalHeight = rowVirtualizer.getTotalSize() + (isFetchingNextPage ? 56 : 0);

  // 가상 스크롤 행 렌더링
  function renderVirtualRow(virtualRow: (typeof virtualRows)[number]) {
    const rowTasks = rows[virtualRow.index];

    return (
      <div
        key={virtualRow.key}
        className="absolute left-0 top-0 w-full overflow-visible"
        style={{
          transform: `translateY(${virtualRow.start}px)`,
        }}
      >
        <div
          className={[
            "overflow-visible pb-4",
            viewMode === "card" ? "grid gap-4 md:grid-cols-2" : "flex flex-col gap-3",
          ].join(" ")}
        >
          {rowTasks.map((task) => (
            <TaskCard key={task.id} task={task} variant={viewMode} />
          ))}
        </div>
      </div>
    );
  }

  /* ================================================================================== */
  /* render helper */
  /* ================================================================================== */

  // 좌측 컨트롤 묶음
  const controlDescription = (
    <div ref={controlsRef} className="flex items-center gap-2">
      <span>{pageMeta.taskList.description}</span>

      {/* 필터링 */}
      <FilterDropdown
        isOpen={isFilterOpen}
        taskFilter={taskFilter}
        onButtonClick={() => {
          setIsFilterOpen((current) => !current);
          setIsSortOpen(false);
        }}
        onSelect={(value) => {
          setTaskFilter(value);
          setIsFilterOpen(false);
        }}
      />

      {/* 정렬 */}
      <SortDropdown
        isSortOpen={isSortOpen}
        taskSort={taskSort}
        taskSortOrder={taskSortOrder}
        onSortButtonClick={() => {
          setIsSortOpen((current) => !current);
          setIsFilterOpen(false);
        }}
        onSortOrderToggle={() => {
          setTaskSortOrder((current) => (current === "asc" ? "desc" : "asc"));
        }}
        onSortSelect={(value) => {
          setTaskSort(value);
          setIsSortOpen(false);
        }}
      />
    </div>
  );

  // 우측 뷰 모드 토글 묶음
  const viewModeToggle = (
    <ViewToggle
      viewMode={viewMode}
      onCardViewClick={() => {
        setViewMode("card");
      }}
      onListViewClick={() => {
        setViewMode("list");
      }}
    />
  );

  /* ================================================================================== */
  /* render */
  /* ================================================================================== */

  return (
    <Panel
      title={pageMeta.taskList.title}
      description={controlDescription}
      rightComponents={viewModeToggle}
      className="flex h-full min-h-0 flex-col overflow-hidden lg:max-h-full"
      contentClassName="min-h-0 flex-1"
    >
      {/* 스크롤 영역 */}
      <div
        ref={scrollRef}
        className="content-scrollbar h-full min-h-0 max-h-full flex-1 overflow-y-auto px-2 pt-3"
        onScroll={handleScroll}
      >
        <div
          className="relative"
          style={{
            height: `${totalHeight}px`,
          }}
        >
          {/* 가상 스크롤 목록 */}
          {virtualRows.map(renderVirtualRow)}

          {/* 빈 상태 */}
          {!rows.length && !isFetchingNextPage && !hasNextPage ? (
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <p className="text-sm font-medium text-text-muted">
                선택한 필터에 해당하는 할 일이 없습니다.
              </p>
            </div>
          ) : null}

          {/* 추가 페이지 로딩 상태 */}
          {isFetchingNextPage ? (
            <div
              className="absolute left-0 w-full"
              style={{
                top: `${rowVirtualizer.getTotalSize()}px`,
              }}
            >
              <div className="flex items-center justify-center py-4 text-sm text-text-muted">
                {taskFilter === "all"
                  ? "다음 목록을 불러오는 중입니다."
                  : "필터링을 위해 전체 목록을 불러오는 중입니다."}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Panel>
  );
}
