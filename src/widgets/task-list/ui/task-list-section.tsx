"use client";

import { useQuery } from "@tanstack/react-query";
import { ApiError } from "@/shared/api/http";
import { getTaskPage } from "@/shared/api/tasks";
import { routes } from "@/shared/config/routes";
import { ButtonLink } from "@/shared/ui/button";
import { Panel } from "@/shared/ui/panel";
import { TaskListScaffold } from "@/widgets/task-list/ui/task-list-scaffold";

type TaskListSectionProps = {
  page: number;
};

export function TaskListSection({ page }: TaskListSectionProps) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["tasks", page],
    queryFn: () => getTaskPage(page),
    retry: false,
  });

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
              할 일 목록을 불러오는 중입니다.
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

  if (error || !data) {
    const errorMessage =
      error instanceof ApiError
        ? error.message
        : "할 일 목록을 불러오지 못했습니다.";
    const needsLogin = error instanceof ApiError && error.status === 401;

    return (
      <Panel
        title="할 일 목록"
        description="등록된 할 일을 목록으로 확인할 수 있는 화면입니다."
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

  return <TaskListScaffold tasks={data.data} />;
}
