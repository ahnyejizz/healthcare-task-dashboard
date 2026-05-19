import type { DashboardResponse } from "@/shared/api/contracts";
import { protectedPageMeta } from "@/shared/config/page-meta";
import { MetricCard } from "@/shared/ui/metric-card";
import { Panel } from "@/shared/ui/panel";

type DashboardOverviewProps = {
  metrics: DashboardResponse;
};

export function DashboardOverview({ metrics }: DashboardOverviewProps) {
  return (
    <Panel
      title={protectedPageMeta.dashboard.title}
      description={protectedPageMeta.dashboard.description}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard caption="일" tone="primary" value={metrics.numOfTask} />
        <MetricCard
          caption="해야할 일"
          tone="warning"
          value={metrics.numOfRestTask}
        />
        <MetricCard
          caption="한 일"
          tone="success"
          value={metrics.numOfDoneTask}
        />
      </div>
    </Panel>
  );
}
