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

/**
 * @page  - [할 일 목록]
 * @title - 할 일 목록 라우트 페이지
 * @desc  - 할 일 목록 라우트 진입점, searchParams의 page 파라미터를 파싱해 TaskListMainPage에 전달
 */
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
