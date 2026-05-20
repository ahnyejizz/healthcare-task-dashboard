import type { EChartsOption } from "echarts";
import type { DashboardChartOptionContext } from "@/widgets/dashboard/ui/dashboard-status-chart-options/shared";
import {
  createDashboardTooltipConfig,
  renderDashboardTooltip,
  resolveDashboardTooltipItem,
} from "@/widgets/dashboard/ui/dashboard-status-chart-options/shared";

export function createComparisonCountOption(
  context: DashboardChartOptionContext,
): EChartsOption {
  const {
    border,
    doneStrong,
    doneSurface,
    metrics,
    primary,
    primarySurface,
    text,
    textMuted,
    todoStrong,
    todoSurface,
  } = context;

  return {
    animationDuration: 500,
    grid: {
      left: 8,
      right: 6,
      top: 10,
      bottom: 8,
      containLabel: true,
    },
    xAxis: {
      type: "value",
      splitLine: {
        lineStyle: {
          color: border,
          opacity: 0.5,
        },
      },
      axisLabel: {
        color: textMuted,
        fontSize: 11,
      },
    },
    yAxis: {
      type: "category",
      inverse: true,
      data: ["전체", "해야할 일", "한 일"],
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: {
        color: text,
        fontWeight: 600,
        fontSize: 11,
      },
    },
    tooltip: {
      ...createDashboardTooltipConfig(context),
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params) => {
        const firstParam = Array.isArray(params) ? params[0] : params;
        const label =
          typeof firstParam?.name === "string"
            ? firstParam.name
            : typeof firstParam?.axisValueLabel === "string"
              ? firstParam.axisValueLabel
              : "";

        return renderDashboardTooltip(
          resolveDashboardTooltipItem(label, context),
          context,
        );
      },
    },
    series: [
      {
        type: "bar",
        data: [
          {
            value: metrics.numOfTask,
            itemStyle: {
              color: primarySurface,
              borderColor: primary,
              borderRadius: 999,
              borderWidth: 1.5,
            },
          },
          {
            value: metrics.numOfRestTask,
            itemStyle: {
              color: todoSurface,
              borderColor: todoStrong,
              borderRadius: 999,
              borderWidth: 1.5,
            },
          },
          {
            value: metrics.numOfDoneTask,
            itemStyle: {
              color: doneSurface,
              borderColor: doneStrong,
              borderRadius: 999,
              borderWidth: 1.5,
            },
          },
        ],
        barWidth: 14,
        label: {
          show: true,
          position: "right",
          color: textMuted,
          fontWeight: 700,
          fontSize: 11,
        },
      },
    ],
  };
}
