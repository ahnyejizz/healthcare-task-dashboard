import type { Metadata } from "next";

// shared
import { pageMeta } from "@/shared/config/page-meta";
import { dashboardFixture } from "@/shared/mocks/data/seed";

// widgets
import { DashboardPage } from "@/widgets/dashboard/ui/dashboard-page";

export const metadata: Metadata = {
  title: pageMeta.dashboard.title,
};

/**
 * @page  - [대시보드]
 * @title - 대시보드 라우트 페이지
 * @desc  - 대시보드 라우트 진입점, 데이터를 DashboardPage 컴포넌트에 전달
 */
export default function Page() {
  return <DashboardPage metrics={dashboardFixture} />;
}
