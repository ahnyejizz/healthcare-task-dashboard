import type { DashboardResponse } from "@/shared/api/contracts";
import { MetricCard } from "@/shared/ui/metric-card";
import { Panel } from "@/shared/ui/panel";

type DashboardOverviewProps = {
  metrics: DashboardResponse;
};

export function DashboardOverview({ metrics }: DashboardOverviewProps) {
  return (
    <Panel
      title="대시보드"
      description="핵심 지표를 카드형 위젯으로 배치한 레이아웃입니다. 실제 구현 시 인증 상태와 API 응답에 따라 수치를 동기화합니다."
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
