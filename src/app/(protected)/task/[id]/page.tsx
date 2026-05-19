import type { Metadata } from "next";
import { TaskDetailSection } from "@/widgets/task-detail/ui/task-detail-section";

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

  return <TaskDetailSection id={id} />;
}
