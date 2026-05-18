import type { Metadata } from "next";
import { dashboardFixture } from "@/shared/mocks/data/seed";
import { DashboardOverview } from "@/widgets/dashboard/ui/dashboard-overview";

export const metadata: Metadata = {
  title: "대시보드",
};

export default function DashboardPage() {
  return <DashboardOverview metrics={dashboardFixture} />;
}
