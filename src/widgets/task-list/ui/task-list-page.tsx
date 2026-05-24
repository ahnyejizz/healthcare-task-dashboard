"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

// shared
import { pageMeta } from "@/shared/config/page-meta";
import { ApiError } from "@/shared/api/http";
import { queryKeys } from "@/shared/api/query-keys";
import { getTaskPage } from "@/shared/api/tasks";
import { routes } from "@/shared/config/routes";
import { ButtonLink } from "@/shared/ui/button/button";
import { LoadingOverlay } from "@/shared/ui/loading/loading-overlay";
import { Panel } from "@/shared/ui/panel";

// widgets
import { TaskListView } from "@/widgets/task-list/ui/task-list-view";

/**
 * @page  - [할 일 목록]
 * @title - 할 일 목록 메인 페이지
 * @desc  - 데이터 처리 및 가공 후 TaskListView 컴포넌트에 데이터 전달
 */
export function TaskListPage({ initialPage }: { initialPage: number }) {
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      initialPageParam: initialPage,
      queryKey: queryKeys.taskList(initialPage),
      queryFn: ({ pageParam }) => getTaskPage(pageParam),
      getNextPageParam: (lastPage, _allPages, lastPageParam) =>
        lastPage.hasNext ? lastPageParam + 1 : undefined,
      retry: false,
    });

  const tasks = useMemo(() => data?.pages.flatMap((pageData) => pageData.data) ?? [], [data]);
  const needsLogin = error instanceof ApiError && error.status === 401;

  const errorMessage =
    error instanceof ApiError ? error.message : "할 일 목록을 불러오지 못했습니다.";

  /* ================================================================================== */
  /* render */
  /* ================================================================================== */

  // 초기 로딩
  if (isLoading && tasks.length === 0) {
    return <LoadingOverlay message="할 일 목록을 불러오는 중입니다." />;
  }

  // 조회 실패
  if (error || !data) {
    return (
      <Panel title={pageMeta.taskList.title} description={pageMeta.taskList.description}>
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

  // 조회 성공
  return (
    <TaskListView
      tasks={tasks}
      hasNextPage={hasNextPage ?? false}
      isFetchingNextPage={isFetchingNextPage}
      onEndReached={() => {
        void fetchNextPage();
      }}
    />
  );
}
