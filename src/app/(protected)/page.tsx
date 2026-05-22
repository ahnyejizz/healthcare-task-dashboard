import type { Metadata } from "next";
import { pageMeta } from "@/shared/config/page-meta";
import { dashboardFixture } from "@/shared/mocks/data/seed";
import { DashboardPage } from "@/widgets/dashboard/ui/dashboard-page";

export const metadata: Metadata = {
  title: pageMeta.dashboard.title,
};

export default function Page() {
  return <DashboardPage metrics={dashboardFixture} />;
}
