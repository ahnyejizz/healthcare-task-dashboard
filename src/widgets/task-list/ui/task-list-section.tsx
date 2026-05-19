"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { protectedPageMeta } from "@/shared/config/page-meta";
import { ApiError } from "@/shared/api/http";
import { getTaskPage } from "@/shared/api/tasks";
import { routes } from "@/shared/config/routes";
import { ButtonLink } from "@/shared/ui/button";
import { LoadingOverlay } from "@/shared/ui/loading-overlay";
import { Panel } from "@/shared/ui/panel";
import { TaskListScaffold } from "@/widgets/task-list/ui/task-list-scaffold";

type TaskListSectionProps = {
  initialPage: number;
};

export function TaskListSection({ initialPage }: TaskListSectionProps) {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    initialPageParam: initialPage,
    queryKey: ["tasks", initialPage],
    queryFn: ({ pageParam }) => getTaskPage(pageParam),
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.hasNext ? lastPageParam + 1 : undefined,
    retry: false,
  });

  const tasks = useMemo(
    () => data?.pages.flatMap((pageData) => pageData.data) ?? [],
    [data],
  );

  if (isLoading && tasks.length === 0) {
    return <LoadingOverlay message="할 일 목록을 불러오는 중입니다." />;
  }

  if (error || !data) {
    const errorMessage =
      error instanceof ApiError
        ? error.message
        : "할 일 목록을 불러오지 못했습니다.";
    const needsLogin = error instanceof ApiError && error.status === 401;

    return (
      <Panel
        title={protectedPageMeta.taskList.title}
        description={protectedPageMeta.taskList.description}
      >
        <div className="rounded-[24px] border border-border bg-white p-5">
          <p className="text-sm leading-6 text-text-muted">{errorMessage}</p>
          {needsLogin ? (
            <div className="mt-4">
              <ButtonLink href={routes.signIn}>로그인하러 가기</ButtonLink>
            </div>
          ) : null}
        </div>
      </Panel>
    );
  }

  return (
    <TaskListScaffold
      tasks={tasks}
      hasNextPage={Boolean(hasNextPage)}
      isFetchingNextPage={isFetchingNextPage}
      onEndReached={() => {
        void fetchNextPage();
      }}
    />
  );
}
