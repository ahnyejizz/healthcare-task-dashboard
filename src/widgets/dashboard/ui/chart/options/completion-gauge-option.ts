import type { EChartsOption } from "echarts";
import type { DashboardChartOptionContext } from "@/widgets/dashboard/ui/chart/options/option-context";

/**
 * @page  - [대시보드]
 * @title - 완료율 차트 옵션 생성 함수
 * @desc  - 완료율 차트 렌더링에 필요한 옵션 반환
 */
export function createCompletionGaugeOption(context: DashboardChartOptionContext): EChartsOption {
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
        radius: ["68%", "82%"],
        center: ["50%", "60%"],
        startAngle: 210,
        clockwise: true,
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "center",
          formatter: `{label|완료율}\n{value|${doneRate}%}`,
          rich: {
            label: {
              color: textMuted,
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "Pretendard Variable, Pretendard",
              lineHeight: 20,
            },
            value: {
              color: text,
              fontSize: 28,
              fontWeight: 700,
              fontFamily: "Pretendard Variable, Pretendard",
              lineHeight: 36,
            },
          },
        },
        labelLine: { show: false },
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
            label: {
              show: false,
            },
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
  };
}
