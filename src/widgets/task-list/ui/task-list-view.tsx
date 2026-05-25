"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

// entities
import { TaskCard } from "@/entities/task/ui/task-card";

// shared
import type { TaskItem } from "@/shared/api/api-types";
import { pageMeta } from "@/shared/config/page-meta";
import { cn } from "@/shared/lib/cn";
import { EmptyState } from "@/shared/ui/empty-state";
import { LoadingSpinner } from "@/shared/ui/loading/loading-spinner";
import { Panel } from "@/shared/ui/panel";

// widgets
import {
  type SearchField,
  type TaskFilter,
  type TaskListViewMode,
  type TaskSortOrder,
} from "@/widgets/task-list/model/task-list-controls";
import { FilterDropdown } from "@/widgets/task-list/ui/controls/filter-dropdown";
import { SearchBar } from "@/widgets/task-list/ui/controls/search-input";
import { SortToggle } from "@/widgets/task-list/ui/controls/sort-toggle";
import { ViewToggle } from "@/widgets/task-list/ui/controls/view-toggle";

type TaskListViewProps = {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onEndReached: () => void;
  tasks: TaskItem[];
};

const NEXT_PAGE_FETCH_THRESHOLD = 320;

// 선택한 필드 기준으로 태스크 검색
function searchTasks(tasks: TaskItem[], query: string, field: SearchField) {
  const trimmed = query.trim();
  if (!trimmed) return tasks;
  const q = trimmed.toLowerCase();

  if (field === "TASK_ID") return tasks.filter((task) => task.id.toLowerCase().includes(q));
  if (field === "TASK_NAME") return tasks.filter((task) => task.title.toLowerCase().includes(q));
  if (field === "MEMO") return tasks.filter((task) => task.memo.toLowerCase().includes(q));

  return tasks.filter(
    (task) =>
      task.id.toLowerCase().includes(q) ||
      task.title.toLowerCase().includes(q) ||
      task.memo.toLowerCase().includes(q),
  );
}

// 태스크 ID 기준으로 목록 정렬
function sortTasks(tasks: TaskItem[], taskSortOrder: TaskSortOrder) {
  const sortDirection = taskSortOrder === "asc" ? 1 : -1;
  return [...tasks].sort((a, b) => a.id.localeCompare(b.id, "ko-KR") * sortDirection);
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
  const [taskFilter, setTaskFilter] = useState<TaskFilter>("todo");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [taskSortOrder, setTaskSortOrder] = useState<TaskSortOrder>("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState<SearchField>("all");
  const scrollRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  // 뷰 모드에 따른 한 행 카드 개수
  const columnCount = viewMode === "card" ? 2 : 1;

  // 필터 조건에 맞는 목록 추출
  const filteredTasks = useMemo(() => {
    if (taskFilter === "all") {
      return tasks;
    }

    return tasks.filter((task) => task.status.toLowerCase() === taskFilter);
  }, [taskFilter, tasks]);

  // 선택한 필드 기준으로 필터링된 목록에서 재검색
  const searchedTasks = useMemo(
    () => searchTasks(filteredTasks, searchQuery, searchField),
    [filteredTasks, searchField, searchQuery],
  );

  // 태스크 ID 기준으로 목록 정렬
  const sortedTasks = useMemo(
    () => sortTasks(searchedTasks, taskSortOrder),
    [searchedTasks, taskSortOrder],
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

  // 드롭다운 바깥 클릭 시 필터 드롭다운 닫기
  useEffect(() => {
    if (!isFilterOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        controlsRef.current &&
        event.target instanceof Node &&
        !controlsRef.current.contains(event.target)
      ) {
        setIsFilterOpen(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isFilterOpen]);

  // 필터/정렬/검색을 적용한 경우, 현재까지 로드된 일부 데이터로 결과가 왜곡되지 않도록 남은 페이지를 추가 조회
  useEffect(() => {
    const isInitialTaskListState =
      taskSortOrder === "asc" && taskFilter === "todo" && !searchQuery.trim();

    if (isInitialTaskListState || !hasNextPage || isFetchingNextPage) {
      return;
    }

    onEndReached();
  }, [
    hasNextPage,
    taskSortOrder,
    isFetchingNextPage,
    onEndReached,
    searchQuery,
    taskFilter,
    tasks.length,
  ]);

  // 첫 진입 시 현재까지 로드된 TODO 목록만으로 스크롤 영역을 채우지 못하는 경우에는 다음 페이지를 추가 조회
  useEffect(() => {
    const isInitialTaskListState =
      taskSortOrder === "asc" && taskFilter === "todo" && !searchQuery.trim();

    if (!isInitialTaskListState || !hasNextPage || isFetchingNextPage || !scrollRef.current) {
      return;
    }

    const { clientHeight, scrollHeight } = scrollRef.current;

    if (scrollHeight <= clientHeight) {
      onEndReached();
    }
  }, [
    hasNextPage,
    isFetchingNextPage,
    onEndReached,
    rows.length,
    searchQuery,
    taskFilter,
    taskSortOrder,
  ]);

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
          className={cn(
            "overflow-visible pb-4",
            viewMode === "card" ? "grid gap-4 md:grid-cols-2" : "flex flex-col gap-3",
          )}
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

  // 컨트롤 묶음 (필터링 + 정렬 + 검색 + 뷰 모드 토글)
  const controls = (
    <div
      ref={controlsRef}
      className="ml-auto flex w-full max-w-full flex-wrap items-center justify-end gap-2"
    >
      {/* 필터링 */}
      <FilterDropdown
        isOpen={isFilterOpen}
        taskFilter={taskFilter}
        onButtonClick={() => {
          setIsFilterOpen((current) => !current);
        }}
        onSelect={(value) => {
          setTaskFilter(value);
          setIsFilterOpen(false);
        }}
      />

      {/* 정렬 */}
      <SortToggle
        taskSortOrder={taskSortOrder}
        onToggle={() => setTaskSortOrder((current) => (current === "asc" ? "desc" : "asc"))}
      />

      {/* 검색 */}
      <SearchBar
        searchField={searchField}
        value={searchQuery}
        onChange={setSearchQuery}
        onFieldChange={setSearchField}
      />

      {/* 뷰 모드 토글 */}
      <ViewToggle
        viewMode={viewMode}
        onCardViewClick={() => {
          setViewMode("card");
        }}
        onListViewClick={() => {
          setViewMode("list");
        }}
      />
    </div>
  );

  /* ================================================================================== */
  /* render */
  /* ================================================================================== */

  return (
    <Panel
      title={pageMeta.taskList.title}
      description={pageMeta.taskList.description}
      rightComponents={controls}
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
          className="relative min-h-full"
          style={{
            height: rows.length ? `${totalHeight}px` : "100%",
          }}
        >
          {/* 가상 스크롤 목록 */}
          {virtualRows.map(renderVirtualRow)}

          {/* 엠티셋 */}
          {!rows.length && !isFetchingNextPage && !hasNextPage ? (
            <div className="absolute inset-0 px-6 py-4">
              <EmptyState
                className="h-full"
                title={
                  searchQuery.trim() ? "검색 결과가 없습니다." : "조건에 맞는 할 일이 없습니다."
                }
                description={
                  searchQuery.trim()
                    ? `"${searchQuery.trim()}"에 해당하는 할 일이 없습니다. 검색어 또는 검색 기준을 다시 확인해주세요.`
                    : "선택한 필터 조건에 맞는 할 일이 없습니다. 필터를 변경해 다른 상태의 할 일을 확인해보세요."
                }
              />
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
              <div className="flex flex-col items-center justify-center gap-3 py-4 text-sm text-text-muted">
                <LoadingSpinner
                  label="다음 목록을 불러오는 중입니다."
                />
                <p>다음 목록을 불러오는 중입니다.</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Panel>
  );
}
