import type { TaskDetailResponse } from "@/shared/api/contracts";
import { DeleteTaskDialog } from "@/features/task/delete-task/ui/delete-task-dialog";
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
      description="상세 페이지의 404 처리, 삭제 플로우, 등록일 노출 구조를 먼저 구성한 상태입니다."
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
