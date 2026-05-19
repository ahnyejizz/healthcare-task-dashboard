"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { pageMeta } from "@/shared/config/page-meta";
import { ApiError } from "@/shared/api/http";
import { getTaskDetail } from "@/shared/api/tasks";
import { routes } from "@/shared/config/routes";
import { ButtonLink } from "@/shared/ui/button";
import { ArrowLeftIcon } from "@/shared/ui/icons";
import { LoadingOverlay } from "@/shared/ui/loading-overlay";
import { Panel } from "@/shared/ui/panel";
import { TaskDetailView } from "@/widgets/task-detail/ui/task-detail-view";

type TaskDetailSectionProps = {
  id: string;
};

export function TaskDetailSection({ id }: TaskDetailSectionProps) {
  const router = useRouter();
  const { data, error, isLoading } = useQuery({
    queryKey: ["task-detail", id],
    queryFn: () => getTaskDetail(id),
    retry: false,
  });
  const isUnauthorized = error instanceof ApiError && error.status === 401;

  useEffect(() => {
    if (!isUnauthorized) {
      return;
    }

    router.replace(routes.dashboard);
    router.refresh();
  }, [isUnauthorized, router]);

  if (isLoading) {
    return <LoadingOverlay message="할 일 상세를 불러오는 중입니다." />;
  }

  if (isUnauthorized) {
    return null;
  }

  if (error || !data) {
    const isNotFound = error instanceof ApiError && error.status === 404;
    const errorMessage =
      error instanceof ApiError
        ? error.message
        : "할 일 상세를 불러오지 못했습니다.";

    if (isNotFound) {
      return (
        <Panel
          title="존재하지 않는 할 일입니다."
          description="요청한 리소스를 찾을 수 없습니다. 목록으로 돌아가 다시 확인해주세요."
          className="h-full"
          action={
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
          <div className="rounded-[24px] border border-border bg-white p-5">
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
      >
        <div className="rounded-[24px] border border-border bg-white p-5">
          <p className="text-sm leading-6 text-text-muted">{errorMessage}</p>
        </div>
      </Panel>
    );
  }

  return <TaskDetailView id={id} task={data} />;
}
