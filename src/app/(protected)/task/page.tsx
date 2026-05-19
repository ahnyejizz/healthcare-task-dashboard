import type { Metadata } from "next";
import { TaskListSection } from "@/widgets/task-list/ui/task-list-section";

export const metadata: Metadata = {
  title: "할 일 목록",
};

type TaskListPageProps = {
  searchParams: Promise<{
    page?: string | string[];
  }>;
};

function resolvePageParam(pageParam: string | string[] | undefined) {
  const pageValue = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  const pageNumber = Number(pageValue ?? "1"); // 첫번째 화면 디폴트

  return Number.isFinite(pageNumber) && pageNumber > 0
    ? Math.floor(pageNumber)
    : 1;
}

export default async function TaskListPage({
  searchParams,
}: TaskListPageProps) {
  const { page } = await searchParams;

  return <TaskListSection initialPage={resolvePageParam(page)} />;
}
