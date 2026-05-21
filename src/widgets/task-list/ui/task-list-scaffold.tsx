"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { TaskItem } from "@/shared/api/contracts";
import { TaskCard } from "@/entities/task/ui/task-card";
import { pageMeta } from "@/shared/config/page-meta";
import { CardViewIcon, FilterIcon, ListViewIcon } from "@/shared/ui/icons";
import { Panel } from "@/shared/ui/panel";
import { SelectOptionList } from "@/shared/ui/select-option-list";
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
const taskFilterOptions = [
  { value: "ALL", label: "전체" },
  { value: "TODO", label: "TODO" },
  { value: "DONE", label: "DONE" },
] as const;

function renderTaskFilterLabel(option: {
  label: string;
  value: TaskFilter;
}) {
  if (option.value === "ALL") {
    return (
      <span className="inline-flex rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold tracking-[0.12em] text-text-muted">
        전체
      </span>
    );
  }

  if (option.value === "TODO") {
    return (
      <span className="inline-flex rounded-full border border-status-todo-strong/20 bg-white px-3 py-1 text-xs font-semibold tracking-[0.12em] text-status-todo-strong">
        TODO
      </span>
    );
  }

  if (option.value === "DONE") {
    return (
      <span className="inline-flex rounded-full border border-status-done-strong/20 bg-white px-3 py-1 text-xs font-semibold tracking-[0.12em] text-status-done-strong">
        DONE
      </span>
    );
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const columnCount = viewMode === "card" ? 2 : 1;
  const filteredTasks = useMemo(() => {
    if (taskFilter === "ALL") {
      return tasks;
    }

    return tasks.filter((task) => task.status === taskFilter);
  }, [taskFilter, tasks]);

  const rows = useMemo(() => {
    const groupedRows: TaskItem[][] = [];

    for (let index = 0; index < filteredTasks.length; index += columnCount) {
      groupedRows.push(filteredTasks.slice(index, index + columnCount));
    }

    return groupedRows;
  }, [columnCount, filteredTasks]);

  useEffect(() => {
    if (!isFilterOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        filterRef.current &&
        event.target instanceof Node &&
        !filterRef.current.contains(event.target)
      ) {
        setIsFilterOpen(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isFilterOpen]);

  useEffect(() => {
    if (taskFilter === "ALL" || !hasNextPage || isFetchingNextPage) {
      return;
    }

    onEndReached();
  }, [hasNextPage, isFetchingNextPage, onEndReached, taskFilter, tasks.length]);
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>{pageMeta.taskList.description}</span>
          <div className="inline-flex items-center gap-2">
            <div ref={filterRef} className="relative">
              <ViewToggleButton
                activeClassName="border-primary/40 bg-white text-primary"
                isActive={taskFilter !== "ALL"}
                inactiveClassName="bg-white text-text-muted hover:text-text"
                label="할 일 상태 필터"
                onClick={() => {
                  setIsFilterOpen((current) => !current);
                }}
              >
                <FilterIcon />
              </ViewToggleButton>
              {isFilterOpen ? (
                <div className="absolute top-full right-0 z-20 mt-2 w-36">
                  <SelectOptionList
                    options={taskFilterOptions}
                    renderLabel={renderTaskFilterLabel}
                    selectedValue={taskFilter}
                    onSelect={(value) => {
                      setTaskFilter(value);
                      setIsFilterOpen(false);
                    }}
                  />
                </div>
              ) : null}
            </div>
            <ViewToggleButton
              isActive={viewMode === "card"}
              label="카드형 보기"
              onClick={() => {
                setViewMode("card");
              }}
            >
              <CardViewIcon />
            </ViewToggleButton>
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
