import type { DashboardResponse } from "@/shared/api/contracts";
import { pageMeta } from "@/shared/config/page-meta";
import { MetricCard } from "@/shared/ui/metric-card";
import { Panel } from "@/shared/ui/panel";
import { pagePanelSpacing } from "@/shared/ui/panel-spacing";
import { DashboardStatusChart } from "@/widgets/dashboard/ui/dashboard-status-chart";

type DashboardOverviewProps = {
  metrics: DashboardResponse;
};

export function DashboardOverview({ metrics }: DashboardOverviewProps) {
  return (
    <Panel
      title={pageMeta.dashboard.title}
      description={pageMeta.dashboard.description}
      paddingClassName={pagePanelSpacing.paddingClassName}
      className="flex h-full flex-col"
      contentClassName="h-full"
    >
      <div className="grid h-full min-h-0 grid-rows-[auto_1fr] gap-3">
        <div className="grid gap-3 md:grid-cols-3">
          <MetricCard caption="전체" tone="primary" value={metrics.numOfTask} />
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
        <DashboardStatusChart metrics={metrics} />
      </div>
    </Panel>
  );
}
