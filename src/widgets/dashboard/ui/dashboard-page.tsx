"use client";

import { useQuery } from "@tanstack/react-query";

// shared
import { ApiError } from "@/shared/api/core/http";
import { queryKeys } from "@/shared/api/core/query-keys";
import { getDashboard } from "@/shared/api/endpoints/dashboard";
import { pageMeta } from "@/shared/config/page-meta";
import { routes } from "@/shared/config/routes";
import { ButtonLink } from "@/shared/ui/button/button";
import { LoadingOverlay } from "@/shared/ui/loading/loading-overlay";
import { Panel } from "@/shared/ui/panel";

// widgets
import { MetricCard } from "@/widgets/dashboard/ui/metric-card";
import { ChartCard } from "@/widgets/dashboard/ui/chart/chart-card";

/**
 * @page  - [대시보드]
 * @title - 대시보드 메인 페이지
 * @desc  - 요약 지표 영역 (MetricCard) + 차트 영역 (ChartCard) 조합
 */
export function DashboardPage() {
  const { data, error, isLoading } = useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: getDashboard,
    retry: false,
  });

  const needsLogin = error instanceof ApiError && error.status === 401;
  const errorMessage =
    error instanceof ApiError ? error.message : "대시보드 데이터를 불러오지 못했습니다.";

  if (isLoading) {
    return <LoadingOverlay message="대시보드를 불러오는 중입니다." />;
  }

  if (error || !data) {
    return (
      <Panel
        title={pageMeta.dashboard.title}
        description={pageMeta.dashboard.description}
        className="flex h-full min-h-0 flex-col"
      >
        <div className="rounded-[24px] border border-border bg-white p-5">
          <p className="text-sm leading-6 text-text-muted">{errorMessage}</p>
          {needsLogin ? (
            <div className="mt-4">
              <ButtonLink href={routes.signIn}>로그인하러 가기</ButtonLink>
            </div>
          ) : null}
        </div>
      </Panel>
    );
  }

  return (
    <Panel
      title={pageMeta.dashboard.title}
      description={pageMeta.dashboard.description}
      className="flex h-full min-h-0 flex-col overflow-hidden"
      contentClassName="min-h-0 flex-1"
    >
      <div className="grid gap-3 lg:h-full lg:min-h-0 lg:grid-rows-[auto_minmax(0,1fr)]">
        <div className="grid gap-3 md:grid-cols-3">
          {/* 전체 */}
          <MetricCard caption="전체" tone="primary" value={data.numOfTask} />

          {/* 해야할 일 */}
          <MetricCard caption="해야할 일" tone="warning" value={data.numOfRestTask} />

          {/* 한 일 */}
          <MetricCard caption="한 일" tone="success" value={data.numOfDoneTask} />
        </div>

        {/* 차트 영역 */}
        <ChartCard metrics={data} />
      </div>
    </Panel>
  );
}
