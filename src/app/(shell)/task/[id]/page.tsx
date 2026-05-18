import type { Metadata } from "next";
import { getTaskDetailFixture } from "@/shared/mocks/data/seed";
import { ButtonLink } from "@/shared/ui/button";
import { TaskDetailView } from "@/widgets/task-detail/ui/task-detail-view";

type TaskDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: TaskDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `할 일 상세 ${id}`,
  };
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = await params;
  const task = getTaskDetailFixture(id);

  if (!task) {
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

  return <TaskDetailView id={id} task={task} />;
}
