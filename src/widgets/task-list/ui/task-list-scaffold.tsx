import type { TaskItem } from "@/shared/api/contracts";
import { TaskCard } from "@/entities/task/ui/task-card";
import { Panel } from "@/shared/ui/panel";

type TaskListScaffoldProps = {
  tasks: TaskItem[];
};

export function TaskListScaffold({ tasks }: TaskListScaffoldProps) {
  return (
    <Panel
      title="할 일 목록"
      description="카드 UI, 라우팅 연결, 상태 배지 구조를 먼저 잡아둔 단계입니다. 다음 구현 단계에서 가상 스크롤과 무한 스크롤을 완성합니다."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </Panel>
  );
}
