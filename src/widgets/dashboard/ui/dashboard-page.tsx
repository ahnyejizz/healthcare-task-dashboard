// shared
import type { DashboardResponse } from "@/shared/api/contracts";
import { pageMeta } from "@/shared/config/page-meta";
import { Panel } from "@/shared/ui/panel";

// widgets
import { MetricCard } from "@/widgets/dashboard/ui/metric-card";
import { ChartCard } from "@/widgets/dashboard/ui/chart/chart-card";

/**
 * @page  - [대시보드]
 * @title - 대시보드 메인 페이지
 * @desc  - 요약 지표 영역 (MetricCard) + 차트 영역 (ChartCard) 조합
 */
export function DashboardPage({ metrics }: { metrics: DashboardResponse }) {
  return (
    <Panel
      title={pageMeta.dashboard.title}
      description={pageMeta.dashboard.description}
      className="flex h-full flex-col"
      contentClassName="h-full"
    >
      <div className="grid h-full min-h-0 grid-rows-[auto_1fr] gap-3">
        <div className="grid gap-3 md:grid-cols-3">
          {/* 전체 */}
          <MetricCard caption="전체" tone="primary" value={metrics.numOfTask} />

          {/* 해야할 일 */}
          <MetricCard caption="해야할 일" tone="warning" value={metrics.numOfRestTask} />

          {/* 한 일 */}
          <MetricCard caption="한 일" tone="success" value={metrics.numOfDoneTask} />
        </div>

        {/* 차트 영역 */}
        <ChartCard metrics={metrics} />
      </div>
    </Panel>
  );
}
