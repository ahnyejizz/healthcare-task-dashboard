"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { pageMeta } from "@/shared/config/page-meta";
import { ApiError } from "@/shared/api/http";
import { getTaskDetail } from "@/shared/api/tasks";
import { routes } from "@/shared/config/routes";
import { ButtonLink } from "@/shared/ui/button/button";
import { ArrowLeftIcon } from "@/shared/ui/icons";
import { LoadingOverlay } from "@/shared/ui/loading/loading-overlay";
import { Panel } from "@/shared/ui/panel";
import { TaskDetailView } from "@/widgets/task-detail/ui/task-detail-view";

/**
 * @page  - [할 일 상세]
 * @title - 할 일 상세 메인 페이지
 * @desc  - 데이터 처리 및 가공 후 TaskDetailView 컴포넌트에 데이터 전달
 */
export function TaskDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const { data, error, isLoading } = useQuery({
    queryKey: ["task-detail", id],
    queryFn: () => getTaskDetail(id),
    retry: false,
  });

  const isUnauthorized = error instanceof ApiError && error.status === 401;
  const isNotFound = error instanceof ApiError && error.status === 404;

  const errorMessage =
    error instanceof ApiError ? error.message : "할 일 상세를 불러오지 못했습니다.";

  /* ================================================================================== */
  /* useEffect() */
  /* ================================================================================== */

  // 인증 만료 시 대시보드로 이동
  useEffect(() => {
    if (!isUnauthorized) {
      return;
    }

    router.replace(routes.dashboard);
    router.refresh();
  }, [isUnauthorized, router]);

  /* ================================================================================== */
  /* render */
  /* ================================================================================== */

  // 초기 로딩
  if (isLoading) {
    return <LoadingOverlay message="할 일 상세를 불러오는 중입니다." />;
  }

  // 인증 만료 리다이렉트 대기
  if (isUnauthorized) {
    return null;
  }

  // 조회 실패
  if (error || !data) {
    if (isNotFound) {
      return (
        <Panel
          title="존재하지 않는 할 일입니다."
          description="요청한 리소스를 찾을 수 없습니다. 목록으로 돌아가 다시 확인해주세요."
          className="flex h-full min-h-0 flex-col"
          rightComponents={
            <ButtonLink
              href={routes.taskList}
              variant="ghost"
              aria-label="목록으로 돌아가기"
              title="목록으로 돌아가기"
              className="h-12 w-12 rounded-[20px] bg-surface-muted px-0 py-0 text-text"
            >
              <ArrowLeftIcon className="size-7" />
            </ButtonLink>
          }
        >
          <div className="rounded-[24px] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,245,221,0.92))] p-5 shadow-[0_16px_36px_rgba(23,32,51,0.06)]">
            <p className="text-sm font-semibold tracking-[0.16em] text-danger uppercase">
              404 Not Found
            </p>
            <p className="mt-3 text-sm leading-6 text-text-muted">
              선택한 할 일을 찾을 수 없어 상세 내용을 표시하지 못했습니다.
            </p>
          </div>
        </Panel>
      );
    }

    return (
      <Panel
        title={pageMeta.taskDetail.title}
        description={pageMeta.taskDetail.description}
        className="flex h-full min-h-0 flex-col"
      >
        <div className="rounded-[24px] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,245,221,0.92))] p-5 shadow-[0_16px_36px_rgba(23,32,51,0.06)]">
          <p className="text-sm leading-6 text-text-muted">{errorMessage}</p>
        </div>
      </Panel>
    );
  }

  // 조회 성공
  return <TaskDetailView id={id} task={data} />;
}
