import type { EChartsOption } from "echarts";
import type { DashboardChartOptionContext } from "@/widgets/dashboard/ui/dashboard-status-chart-options/shared";

export function createComparisonRatioOption(
  context: DashboardChartOptionContext,
): EChartsOption {
  const {
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
    series: [
      {
        type: "pie",
        radius: ["54%", "74%"],
        center: ["50%", "42%"],
        itemStyle: {
          borderColor: surface,
          borderWidth: 5,
          borderRadius: 12,
        },
        label: { show: false },
        data: [
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
            value: metrics.numOfDoneTask,
            name: "한 일",
            itemStyle: {
              color: doneSurface,
              borderColor: doneStrong,
              borderWidth: 1.5,
            },
          },
        ],
      },
    ],
    graphic: [
      {
        type: "text",
        left: "center",
        top: "35%",
        style: {
          text: "비중",
          fill: textMuted,
          fontSize: 11,
          fontWeight: 700,
          fontFamily: "Pretendard Variable, Pretendard",
        },
      },
      {
        type: "text",
        left: "center",
        top: "43%",
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
