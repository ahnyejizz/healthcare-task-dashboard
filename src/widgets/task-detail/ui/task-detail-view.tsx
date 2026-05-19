import type { TaskDetailResponse } from "@/shared/api/contracts";
import { DeleteTaskDialog } from "@/features/task/delete-task/ui/delete-task-dialog";
import { pageMeta } from "@/shared/config/page-meta";
import { routes } from "@/shared/config/routes";
import { ButtonLink } from "@/shared/ui/button";
import { ArrowLeftIcon } from "@/shared/ui/icons";
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
      <dl className="grid gap-6">
        <div className="rounded-[24px] border border-border bg-white p-5">
          <dt className="text-sm font-medium text-text-muted">메모</dt>
          <dd className="mt-3 whitespace-pre-wrap text-sm leading-7 text-text">
            {task.memo}
          </dd>
        </div>
        <div className="rounded-[24px] border border-border bg-white p-5">
          <dt className="text-sm font-medium text-text-muted">등록일시</dt>
          <dd className="mt-3 text-sm font-semibold text-text">
            {formatDateTime(task.registerDatetime)}
          </dd>
        </div>
        <div className="flex items-center justify-between rounded-[24px] border border-dashed border-border bg-surface-muted p-5">
          <div>
            <dt className="text-sm font-medium text-text-muted">삭제 확인용 ID</dt>
            <dd className="mt-2 text-base font-semibold text-text">{id}</dd>
          </div>
          <DeleteTaskDialog id={id} />
        </div>
      </dl>
    </Panel>
  );
}
