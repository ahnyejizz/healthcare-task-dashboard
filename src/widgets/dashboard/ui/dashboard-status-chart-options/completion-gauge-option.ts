import type { EChartsOption } from "echarts";
import type { DashboardChartOptionContext } from "@/widgets/dashboard/ui/dashboard-status-chart-options/shared";
import {
  createDashboardTooltipConfig,
  renderDashboardTooltip,
  resolveDashboardTooltipItem,
} from "@/widgets/dashboard/ui/dashboard-status-chart-options/shared";

export function createCompletionGaugeOption(
  context: DashboardChartOptionContext,
): EChartsOption {
  const {
    border,
    doneRate,
    doneStrong,
    doneSurface,
    metrics,
    surface,
    text,
    textMuted,
    todoStrong,
    todoSurface,
  } = context;

  return {
    animationDuration: 500,
    tooltip: {
      ...createDashboardTooltipConfig(context),
      trigger: "item",
      formatter: (params) =>
        renderDashboardTooltip(
          resolveDashboardTooltipItem(String(params.name), context),
          context,
        ),
    },
    series: [
      {
        type: "pie",
        radius: ["68%", "82%"],
        center: ["50%", "60%"],
        startAngle: 210,
        clockwise: true,
        avoidLabelOverlap: false,
        label: { show: false },
        itemStyle: {
          borderColor: surface,
          borderWidth: 4,
          borderRadius: 10,
        },
        emphasis: {
          scale: true,
          scaleSize: 4,
        },
        data: [
          {
            value: metrics.numOfDoneTask,
            name: "한 일",
            itemStyle: {
              color: doneSurface,
              borderColor: doneStrong,
              borderWidth: 1.5,
            },
          },
          {
            value: metrics.numOfRestTask,
            name: "해야할 일",
            itemStyle: {
              color: todoSurface,
              borderColor: todoStrong,
              borderWidth: 1.5,
            },
          },
          {
            value: metrics.numOfTask / 2,
            name: "hidden",
            itemStyle: {
              color: "transparent",
              borderColor: "transparent",
              borderWidth: 0,
            },
            emphasis: {
              disabled: true,
            },
          },
        ],
      },
    ],
    graphic: [
      {
        type: "text",
        left: "center",
        top: "50%",
        style: {
          text: "완료율",
          fill: textMuted,
          fontSize: 11,
          fontWeight: 700,
          fontFamily: "Pretendard Variable, Pretendard",
        },
      },
      {
        type: "text",
        left: "center",
        top: "58%",
        style: {
          text: `${doneRate}%`,
          fill: text,
          fontSize: 28,
          fontWeight: 700,
          fontFamily: "Pretendard Variable, Pretendard",
        },
      },
    ],
  };
}
