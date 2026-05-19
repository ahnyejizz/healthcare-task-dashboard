"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/shared/api/http";
import { getTaskDetail } from "@/shared/api/tasks";
import { routes } from "@/shared/config/routes";
import { ButtonLink } from "@/shared/ui/button";
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
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172033]/18 px-4 backdrop-blur-[3px]">
        <div
          role="status"
          aria-live="polite"
          className="surface-card w-full max-w-md rounded-[28px] border border-border/80 px-6 py-5"
        >
          <div className="flex items-center justify-between gap-4">
            <strong className="text-base font-semibold text-text">
              할 일 상세를 불러오는 중입니다.
            </strong>
            <span className="text-xs font-medium tracking-[0.16em] text-text-muted uppercase">
              loading...
            </span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-muted">
            <div className="relative h-full">
              <span className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-primary animate-[loading-overlay-bar_1.15s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      </div>
    );
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
        title="할 일 상세"
        description="선택한 할 일의 내용을 확인할 수 있는 화면입니다."
      >
        <div className="rounded-[24px] border border-border bg-white p-5">
          <p className="text-sm leading-6 text-text-muted">{errorMessage}</p>
        </div>
      </Panel>
    );
  }

  return <TaskDetailView id={id} task={data} />;
}
