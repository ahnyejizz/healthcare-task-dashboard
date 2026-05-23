import type { Metadata } from "next";
import { pageMeta } from "@/shared/config/page-meta";
import { TaskDetailPage as TaskDetailMainPage } from "@/widgets/task-detail/ui/task-detail-page";

/**
 * @page  - [할 일 상세]
 * @title - 할 일 상세 동적 메타데이터
 * @desc  - URL params의 id를 기반으로 페이지 title 동적 생성
 */
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

/**
 * @page  - [할 일 상세]
 * @title - 할 일 상세 라우트 페이지
 * @desc  - 할 일 상세 라우트 진입점, URL params에서 id를 추출해 TaskDetailMainPage에 전달
 */
export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <TaskDetailMainPage id={id} />;
}
