import type { EChartsOption } from "echarts";
import type { DashboardChartOptionContext } from "@/widgets/dashboard/ui/chart/options/option-context";

/**
 * @page  - [대시보드]
 * @title - 완료/잔여 비중 차트 옵션 생성 함수
 * @desc  - 완료/잔여 비중 차트 렌더링에 필요한 옵션 반환
 */
export function createComparisonRatioOption(context: DashboardChartOptionContext): EChartsOption {
  const { doneStrong, doneSurface, metrics, surface, textMuted, todoStrong, todoSurface } = context;

  return {
    animationDuration: 500,
    series: [
      {
        type: "pie",
        radius: ["54%", "74%"],
        center: ["50%", "50%"],
        itemStyle: {
          borderColor: surface,
          borderWidth: 5,
          borderRadius: 12,
        },
        label: {
          show: true,
          position: "center",
          formatter: "비중",
          color: textMuted,
          fontSize: 15,
          fontWeight: 700,
          fontFamily: "Pretendard Variable, Pretendard",
        },
        labelLine: { show: false },
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
  };
}
