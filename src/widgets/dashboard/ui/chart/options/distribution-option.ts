import type { EChartsOption } from "echarts";
import type { DashboardChartOptionContext } from "@/widgets/dashboard/ui/chart/options/option-context";
import { toRgba } from "@/widgets/dashboard/ui/chart/options/option-context";

/**
 * @page  - [대시보드]
 * @title - 분포도 차트 옵션 생성 함수
 * @desc  - 분포도 차트 렌더링에 필요한 옵션 반환
 */
export function createDistributionOption(context: DashboardChartOptionContext): EChartsOption {
  const {
    doneRate,
    doneStrong,
    doneSurface,
    metrics,
    textMuted,
    todoRate,
    todoStrong,
    todoSurface,
  } = context;

  return {
    animationDuration: 500,
    grid: {
      left: 12,
      right: 12,
      top: 18,
      bottom: 18,
    },
    xAxis: {
      type: "value",
      max: 100,
      show: false,
    },
    yAxis: {
      type: "category",
      data: ["진행 현황"],
      show: false,
    },
    series: [
      {
        type: "bar",
        stack: "progress",
        emphasis: {
          focus: "self",
          itemStyle: {
            shadowBlur: 12,
            shadowColor: toRgba(todoStrong, 0.28),
          },
        },
        data: [
          {
            value: todoRate,
            name: "해야할 일",
            itemStyle: {
              color: todoSurface,
              borderColor: todoStrong,
              borderWidth: 1.5,
              borderRadius: [999, 0, 0, 999],
            },
          },
        ],
        barWidth: 24,
        label: {
          show: true,
          position: "insideLeft",
          formatter: `해야할 일 ${todoRate}%`,
          color: todoStrong,
          fontWeight: 700,
          fontSize: 11,
          padding: [0, 0, 0, 12],
        },
      },
      {
        type: "bar",
        stack: "progress",
        emphasis: {
          focus: "self",
          itemStyle: {
            shadowBlur: 12,
            shadowColor: toRgba(doneStrong, 0.24),
          },
        },
        data: [
          {
            value: doneRate,
            name: "한 일",
            itemStyle: {
              color: doneSurface,
              borderColor: doneStrong,
              borderWidth: 1.5,
              borderRadius: [0, 999, 999, 0],
            },
          },
        ],
        barWidth: 24,
        label: {
          show: true,
          position: "insideRight",
          formatter: `한 일 ${doneRate}%`,
          color: doneStrong,
          fontWeight: 700,
          fontSize: 11,
          padding: [0, 12, 0, 0],
        },
      },
    ],
    graphic: [
      {
        type: "text",
        left: "center",
        top: "72%",
        style: {
          text: `${metrics.numOfDoneTask} / ${metrics.numOfTask} 완료`,
          fill: textMuted,
          fontSize: 12,
          fontWeight: 600,
          fontFamily: "Pretendard Variable, Pretendard",
        },
      },
    ],
  };
}
