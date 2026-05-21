import type { TaskDetailResponse } from "@/shared/api/contracts";
import { DeleteTaskDialog } from "@/features/task/delete-task/ui/delete-task-dialog";
import { pageMeta } from "@/shared/config/page-meta";
import { routes } from "@/shared/config/routes";
import { ButtonLink } from "@/shared/ui/button";
import { ArrowLeftIcon, TrashIcon } from "@/shared/ui/icons";
import { Panel } from "@/shared/ui/panel";

type TaskDetailViewProps = {
  id: string;
  task: TaskDetailResponse;
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

export function TaskDetailView({ id, task }: TaskDetailViewProps) {
  return (
    <Panel
      title={task.title}
      description={pageMeta.taskDetail.description}
      className="flex h-full min-h-0 flex-col"
      contentClassName="flex-1"
      rightComponents={
        <div className="flex items-center">
          <ButtonLink
            href={routes.taskList}
            variant="ghost"
            aria-label="목록으로 돌아가기"
            title="목록으로 돌아가기"
            className="h-12 w-12 rounded-[20px] bg-surface-muted px-0 py-0 text-text"
          >
            <ArrowLeftIcon className="size-7" />
          </ButtonLink>
        </div>
      }
    >
      <div className="grid h-full min-h-0 gap-4">
        <article className="surface-highlight relative flex h-full min-h-0 flex-col overflow-hidden rounded-[28px] border border-border p-6 shadow-[0_24px_48px_rgba(252,175,24,0.12)]">
          <div className="absolute -top-10 right-0 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />
          <div className="relative flex h-full min-h-0 flex-col gap-6">
            <div className="rounded-[22px] border border-white/70 bg-white/82 p-5 backdrop-blur">
              <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                Task ID
              </p>
              <p className="mt-3 text-base font-semibold leading-7 text-text">
                {id}
              </p>
            </div>

            <div className="rounded-[22px] border border-white/70 bg-white/82 p-5 backdrop-blur">
              <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                Registered At
              </p>
              <p className="mt-3 text-base font-semibold leading-7 text-text">
                {formatDateTime(task.registerDatetime)}
              </p>
            </div>

            <div className="rounded-[24px] border border-white/70 bg-white/78 p-5 backdrop-blur">
              <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                Memo
              </p>
              <p className="mt-3 text-base font-semibold leading-7 text-text">
                {task.memo}
              </p>
            </div>

            <div className="mt-auto flex justify-end pt-2">
              <DeleteTaskDialog
                id={id}
                triggerVariant="secondary"
                buttonClassName="h-12 w-12 rounded-[20px] border border-border bg-white/90 px-0 py-0 text-text shadow-none hover:border-border hover:bg-white hover:text-text"
                trigger={
                  <span className="flex items-center justify-center text-text">
                    <TrashIcon className="size-5" />
                  </span>
                }
              />
            </div>
          </div>
        </article>

      </div>
    </Panel>
  );
}
