import type { EChartsOption } from "echarts";

// shared
import type { DashboardResponse } from "@/shared/api/contracts";

// widgets
import { createComparisonCountOption } from "@/widgets/dashboard/ui/chart/options/comparison-count-option";
import { createComparisonRatioOption } from "@/widgets/dashboard/ui/chart/options/comparison-ratio-option";
import { createCompletionGaugeOption } from "@/widgets/dashboard/ui/chart/options/completion-gauge-option";
import { createDistributionOption } from "@/widgets/dashboard/ui/chart/options/distribution-option";
import {
  createDashboardChartOptionContext,
  type DashboardChartOptionContext,
} from "@/widgets/dashboard/ui/chart/options/option-context";

const chartOptionFactories: Array<(context: DashboardChartOptionContext) => EChartsOption> = [
  createComparisonCountOption,
  createComparisonRatioOption,
  createCompletionGaugeOption,
  createDistributionOption,
];

/**
 * @page  - [대시보드]
 * @title - 차트 옵션 생성 함수
 * @desc  - 대시보드 차트에 필요한 ECharts 옵션 배열 반환
 */
export function createChartOptions(metrics: DashboardResponse): EChartsOption[] {
  const context = createDashboardChartOptionContext(metrics);

  return chartOptionFactories.map((createOption) => createOption(context));
}
