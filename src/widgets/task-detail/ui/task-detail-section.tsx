"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { protectedPageMeta } from "@/shared/config/page-meta";
import { ApiError } from "@/shared/api/http";
import { getTaskDetail } from "@/shared/api/tasks";
import { routes } from "@/shared/config/routes";
import { ButtonLink } from "@/shared/ui/button";
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
        <section className="surface-card rounded-[28px] p-8">
          <p className="text-sm font-semibold tracking-[0.16em] text-danger uppercase">
            404
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-text">
            존재하지 않는 할 일입니다.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-text-muted">
            요청한 리소스를 찾을 수 없습니다. 목록으로 돌아가 다시 확인해주세요.
          </p>
          <div className="mt-8">
            <ButtonLink href="/task">목록으로 돌아가기</ButtonLink>
          </div>
        </section>
      );
    }

    return (
      <Panel
        title={protectedPageMeta.taskDetail.title}
        description={protectedPageMeta.taskDetail.description}
      >
        <div className="rounded-[24px] border border-border bg-white p-5">
          <p className="text-sm leading-6 text-text-muted">{errorMessage}</p>
        </div>
      </Panel>
    );
  }

  return <TaskDetailView id={id} task={data} />;
}
