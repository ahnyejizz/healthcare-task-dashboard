"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { TaskItem } from "@/shared/api/contracts";
import { TaskCard } from "@/entities/task/ui/task-card";
import { pageMeta } from "@/shared/config/page-meta";
import {
  CardViewIcon,
  FilterIcon,
  ListViewIcon,
  SortDirectionIcon,
  SortIcon,
} from "@/shared/ui/icons";
import { Panel } from "@/shared/ui/panel";
import { SelectOptionList } from "@/shared/ui/select-option-list";
import { StatusBadge } from "@/shared/ui/status-badge";
import { ViewToggleButton } from "@/shared/ui/view-toggle-button";

type TaskListScaffoldProps = {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onEndReached: () => void;
  tasks: TaskItem[];
};

const NEXT_PAGE_FETCH_THRESHOLD = 320;
type TaskFilter = "ALL" | "DONE" | "TODO";
type TaskListViewMode = "card" | "list";
type TaskSort = "TASK_ID" | "TASK_NAME";
type TaskSortOrder = "asc" | "desc";
const DEFAULT_TASK_SORT: TaskSort = "TASK_ID";
const DEFAULT_TASK_SORT_ORDER: TaskSortOrder = "asc";
const taskFilterOptions = [
  { value: "ALL", label: "전체" },
  { value: "TODO", label: "TODO" },
  { value: "DONE", label: "DONE" },
] as const;
const taskSortOptions = [
  { value: "TASK_ID", label: "태스크ID" },
  { value: "TASK_NAME", label: "태스크명" }
] as const;

function renderTaskFilterLabel(option: {
  label: string;
  value: TaskFilter;
}) {
  if (option.value === "ALL") {
    return <StatusBadge tone="all">전체</StatusBadge>;
  }

  if (option.value === "TODO") {
    return <StatusBadge tone="todo">TODO</StatusBadge>;
  }

  if (option.value === "DONE") {
    return <StatusBadge tone="done">DONE</StatusBadge>;
  }

  return option.label;
}

export function TaskListScaffold({
  hasNextPage,
  isFetchingNextPage,
  onEndReached,
  tasks,
}: TaskListScaffoldProps) {
  const [viewMode, setViewMode] = useState<TaskListViewMode>("card");
  const [taskFilter, setTaskFilter] = useState<TaskFilter>("ALL");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [taskSort, setTaskSort] = useState<TaskSort>("TASK_ID");
  const [taskSortOrder, setTaskSortOrder] =
    useState<TaskSortOrder>(DEFAULT_TASK_SORT_ORDER);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const columnCount = viewMode === "card" ? 2 : 1;
  const isCustomSortActive =
    taskSort !== DEFAULT_TASK_SORT || taskSortOrder !== DEFAULT_TASK_SORT_ORDER;
  const filteredTasks = useMemo(() => {
    if (taskFilter === "ALL") {
      return tasks;
    }

    return tasks.filter((task) => task.status === taskFilter);
  }, [taskFilter, tasks]);

  const sortedTasks = useMemo(() => {
    const nextTasks = [...filteredTasks];
    const sortDirection = taskSortOrder === "asc" ? 1 : -1;

    if (taskSort === "TASK_ID") {
      nextTasks.sort(
        (left, right) =>
          left.id.localeCompare(right.id, "ko-KR") * sortDirection,
      );
      return nextTasks;
    }

    if (taskSort === "TASK_NAME") {
      nextTasks.sort(
        (left, right) =>
          left.title.localeCompare(right.title, "ko-KR") * sortDirection,
      );
      return nextTasks;
    }

    return nextTasks;
  }, [filteredTasks, taskSort, taskSortOrder]);

  const rows = useMemo(() => {
    const groupedRows: TaskItem[][] = [];

    for (let index = 0; index < sortedTasks.length; index += columnCount) {
      groupedRows.push(sortedTasks.slice(index, index + columnCount));
    }

    return groupedRows;
  }, [columnCount, sortedTasks]);

  useEffect(() => {
    if (!isFilterOpen && !isSortOpen) {
      return;
    }

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

  useEffect(() => {
    if (
      (!isCustomSortActive && taskFilter === "ALL") ||
      !hasNextPage ||
      isFetchingNextPage
    ) {
      return;
    }

    onEndReached();
  }, [
    hasNextPage,
    isCustomSortActive,
    isFetchingNextPage,
    onEndReached,
    taskFilter,
    tasks.length,
  ]);

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
  
  const totalHeight =
    rowVirtualizer.getTotalSize() + (isFetchingNextPage ? 56 : 0);

  return (
    <Panel
      title={pageMeta.taskList.title}
      description={
        <div ref={controlsRef} className="flex items-center gap-2">
          <span>{pageMeta.taskList.description}</span>

          <div className="relative ml-5">
            {/* 필터링 버튼 */}
            <ViewToggleButton
              activeClassName="border-primary/40 bg-white text-primary"
              isActive={taskFilter !== "ALL"}
              inactiveClassName="bg-white text-text-muted hover:text-text"
              label="필터링"
              onClick={() => {
                setIsFilterOpen((current) => !current);
                setIsSortOpen(false);
              }}
            >
              <FilterIcon />
            </ViewToggleButton>

            {/* 필터링 드롭다운리스트 */}
            {isFilterOpen ? (
              <SelectOptionList
                options={taskFilterOptions}
                renderLabel={renderTaskFilterLabel}
                selectedValue={taskFilter}
                onSelect={(value) => {
                  setTaskFilter(value);
                  setIsFilterOpen(false);
                }}
              />
            ) : null}
          </div>

          <div className="relative">
            {/* 정렬 버튼 */}
            <ViewToggleButton
              activeClassName="border-primary/40 bg-white text-primary"
              isActive={isSortOpen || taskSort !== "TASK_ID"}
              inactiveClassName="bg-white text-text-muted hover:text-text"
              label="정렬"
              onClick={() => {
                setIsSortOpen((current) => !current);
                setIsFilterOpen(false);
              }}
            >
              <SortIcon />
            </ViewToggleButton>

            {/* 정렬 드롭다운리스트 */}
            {isSortOpen ? (
              <SelectOptionList
                options={taskSortOptions}
                selectedValue={taskSort}
                onSelect={(value) => {
                  setTaskSort(value);
                  setIsSortOpen(false);
                }}
              />
            ) : null}
          </div>

          {/* 정렬 기준 (오름차순/내림차순) 버튼 */}
          <ViewToggleButton
            activeClassName="border-primary/40 bg-white text-primary"
            isActive={taskSortOrder === "desc"}
            inactiveClassName="bg-white text-text-muted hover:text-text"
            label={
              taskSortOrder === "desc" ? "내림차순 정렬" : "오름차순 정렬"
            }
            onClick={() => {
              setTaskSortOrder((current) =>
                current === "asc" ? "desc" : "asc",
              );
            }}
          >
            <SortDirectionIcon direction={taskSortOrder} />
          </ViewToggleButton>
        </div>
      }
      rightComponents={
        <div className="inline-flex items-center gap-2">
          {/* 카드형 view 모드 토글 버튼 */}
          <ViewToggleButton
            isActive={viewMode === "card"}
            label="카드형 보기"
            onClick={() => {
              setViewMode("card");
            }}
          >
            <CardViewIcon />
          </ViewToggleButton>

          {/* 리스트형 view 모드 토글 버튼 */}
          <ViewToggleButton
            isActive={viewMode === "list"}
            label="리스트형 보기"
            onClick={() => {
              setViewMode("list");
            }}
          >
            <ListViewIcon />
          </ViewToggleButton>
        </div>
      }
      className="flex h-full min-h-0 flex-col overflow-hidden lg:max-h-full"
      contentClassName="min-h-0 flex-1"
    >
      <div
        ref={scrollRef}
        className="content-scrollbar h-full min-h-0 max-h-full flex-1 overflow-y-auto px-2 pt-3"
        onScroll={(event) => {
          if (!hasNextPage || isFetchingNextPage) {
            return;
          }

          const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;
          const remainingScroll = scrollHeight - scrollTop - clientHeight;

          // 스크롤이 실제 하단 근처에 왔을 때만 다음 페이지 API를 호출
          if (remainingScroll <= NEXT_PAGE_FETCH_THRESHOLD) {
            onEndReached();
          }
        }}
      >
        <div
          className="relative"
          style={{
            height: `${totalHeight}px`,
          }}
        >
          {virtualRows.map((virtualRow) => {
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
                    viewMode === "card"
                      ? "grid gap-4 md:grid-cols-2"
                      : "flex flex-col gap-3",
                  ].join(" ")}
                >
                  {rowTasks.map((task) => (
                    <TaskCard key={task.id} task={task} variant={viewMode} />
                  ))}
                </div>
              </div>
            );
          })}

          {!rows.length && !isFetchingNextPage && !hasNextPage ? (
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <p className="text-sm font-medium text-text-muted">
                선택한 필터에 해당하는 할 일이 없습니다.
              </p>
            </div>
          ) : null}

          {isFetchingNextPage ? (
            <div
              className="absolute left-0 w-full"
              style={{
                top: `${rowVirtualizer.getTotalSize()}px`,
              }}
            >
              <div className="flex items-center justify-center py-4 text-sm text-text-muted">
                {taskFilter === "ALL"
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
