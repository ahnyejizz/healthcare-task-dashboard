import type { Metadata } from "next";
import { pageMeta } from "@/shared/config/page-meta";
import { TaskDetailPage as TaskDetailMainPage } from "@/widgets/task-detail/ui/task-detail-page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `${pageMeta.taskDetail.title} ${id}`,
  };
}

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <TaskDetailMainPage id={id} />;
}
