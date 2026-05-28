import type { EChartsOption } from "echarts";
import type { DashboardChartOptionContext } from "@/widgets/dashboard/ui/chart/options/option-context";

/**
 * @page  - [대시보드]
 * @title - 카운트 비교 차트 옵션 생성 함수
 * @desc  - 카운트 비교 차트 렌더링에 필요한 옵션 반환
 */
export function createComparisonCountOption(context: DashboardChartOptionContext): EChartsOption {
  const {
    border,
    doneStrong,
    doneSurface,
    metrics,
    primary,
    primarySurface,
    textMuted,
    todoStrong,
    todoSurface,
  } = context;
  return {
    animationDuration: 500,
    grid: {
      left: 8,
      right: 20,
      top: 10,
      bottom: 8,
      containLabel: true,
    },
    xAxis: {
      type: "value",
      max: 100,
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
        fontWeight: 600,
        fontSize: 11,
        color: textMuted,
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
