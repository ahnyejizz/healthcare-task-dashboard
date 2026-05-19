"use client";

import { useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { TaskItem } from "@/shared/api/contracts";
import { TaskCard } from "@/entities/task/ui/task-card";
import { pageMeta } from "@/shared/config/page-meta";
import { Panel } from "@/shared/ui/panel";

type TaskListScaffoldProps = {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onEndReached: () => void;
  tasks: TaskItem[];
};

const NEXT_PAGE_FETCH_THRESHOLD = 320;

export function TaskListScaffold({
  hasNextPage,
  isFetchingNextPage,
  onEndReached,
  tasks,
}: TaskListScaffoldProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const rows = useMemo(() => {
    const groupedRows: TaskItem[][] = [];

    for (let index = 0; index < tasks.length; index += 2) {
      groupedRows.push(tasks.slice(index, index + 2));
    }

    return groupedRows;
  }, [tasks]);
  // TanStack Virtual 훅은 React Compiler의 incompatible-library 경고 대상이라
  // 가상 스크롤 구현이 필요한 이 지점에서만 예외 처리합니다.
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 200,
    getScrollElement: () => scrollRef.current,
    overscan: 5,
  });
  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalHeight =
    rowVirtualizer.getTotalSize() + (isFetchingNextPage ? 56 : 0);

  return (
    <Panel
      title={pageMeta.taskList.title}
      description={pageMeta.taskList.description}
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
                className="absolute left-0 top-0 w-full"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="grid gap-4 pb-4 md:grid-cols-2">
                  {rowTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            );
          })}

          {isFetchingNextPage ? (
            <div
              className="absolute left-0 w-full"
              style={{
                top: `${rowVirtualizer.getTotalSize()}px`,
              }}
            >
              <div className="flex items-center justify-center py-4 text-sm text-text-muted">
                다음 목록을 불러오는 중입니다.
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Panel>
  );
}
