import type { Metadata } from "next";
import { pageMeta } from "@/shared/config/page-meta";
import { TaskListPage as TaskListMainPage } from "@/widgets/task-list/ui/task-list-page";

export const metadata: Metadata = {
  title: pageMeta.taskList.title,
};

function resolvePageParam(pageParam: string | string[] | undefined) {
  const pageValue = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  const pageNumber = Number(pageValue ?? "1"); // 첫번째 화면 디폴트

  return Number.isFinite(pageNumber) && pageNumber > 0 ? Math.floor(pageNumber) : 1;
}

export default async function TaskListPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string | string[];
  }>;
}) {
  const { page } = await searchParams;

  return <TaskListMainPage initialPage={resolvePageParam(page)} />;
}
