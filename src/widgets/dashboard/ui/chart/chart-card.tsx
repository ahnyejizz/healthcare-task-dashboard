"use client";

import { useMemo } from "react";
import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

// shared
import type { DashboardResponse } from "@/shared/api/api-types";
import { downloadChartAsImage } from "@/shared/lib/download-chart-as-image";
import { Button } from "@/shared/ui/button/button";
import { DownloadIcon } from "@/shared/ui/icons";
import { LoadingSpinner } from "@/shared/ui/loading/loading-spinner";
import { Tooltip } from "@/shared/ui/tooltip";

// widgets
import { ChartCardHeader } from "@/widgets/dashboard/ui/chart/chart-card-header";
import { ChartLegend } from "@/widgets/dashboard/ui/chart/chart-legend";
import { chartCards, ChartTooltip } from "@/widgets/dashboard/model/dashboard-model";
import { createChartOptions } from "@/widgets/dashboard/ui/chart/chart-options";
import {
  createDashboardChartOptionContext,
  resolveDashboardTooltipItem,
  resolveDashboardTooltipLabel,
} from "@/widgets/dashboard/ui/chart/options/option-context";

/**
 * @page  - [대시보드]
 * @title - 차트 카드 컴포넌트
 * @desc  - 총 4가지 종류의 차트 제공 (카운트 비교, 완료/잔여 비중, 완료율, 분포도)
 */
export function ChartCard({ metrics }: { metrics: DashboardResponse }) {
  /* ================================================================================== */
  /* state */
  /* ================================================================================== */

  const chartRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [readyCharts, setReadyCharts] = useState<boolean[]>(() => chartCards.map(() => false));
  const [tooltipState, setTooltipState] = useState<ChartTooltip>(null);
  const tooltipContext = useMemo(() => createDashboardChartOptionContext(metrics), [metrics]);

  /* ================================================================================== */
  /* function */
  /* ================================================================================== */

  // 차트 카드를 이미지로 저장
  async function handleDownloadChartCard(index: number) {
    const chartNode = chartRefs.current[index];
    const card = chartCards[index];
    const chart = chartNode ? echarts.getInstanceByDom(chartNode) : null;

    if (!chart || !chartNode) {
      return;
    }

    await downloadChartAsImage({
      card,
      chart,
      chartNode,
      legendItems:
        card.legendItems?.map((item) => ({
          color:
            item.colorKey === "todoStrong"
              ? tooltipContext.todoStrong
              : item.colorKey === "doneStrong"
                ? tooltipContext.doneStrong
                : tooltipContext.primary,
          label: item.label,
        })) ?? [],
    });
  }

  // 차트 렌더 완료 상태 반영
  function markChartReady(chart: echarts.ECharts, index: number, readyTimers: number[]) {
    window.requestAnimationFrame(() => {
      chart.resize();

      const timer = window.setTimeout(() => {
        setReadyCharts((current) =>
          current.map((item, readyIndex) => (readyIndex === index ? true : item)),
        );
      }, 220);

      readyTimers.push(timer);
    });
  }

  // 차트 영역 resize 감지
  function observeChartResize(
    chartNodes: HTMLDivElement[],
    chartInstances: Array<echarts.ECharts | null>,
  ) {
    const resizeObserver = new ResizeObserver(() => {
      chartInstances.forEach((chart) => {
        chart?.resize();
      });
    });

    chartNodes.forEach((node) => {
      resizeObserver.observe(node);
    });

    return resizeObserver;
  }

  /* ================================================================================== */
  /* useEffect() */
  /* ================================================================================== */

  // 차트 옵션이나 metrics가 바뀔 때만 차트 인스턴스 재생성
  useEffect(() => {
    const chartNodes = chartRefs.current.slice(0, chartCards.length);

    if (chartNodes.some((node) => !node)) {
      return;
    }

    const chartOptions = createChartOptions(metrics);
    setReadyCharts(chartCards.map(() => false));
    const readyTimers: number[] = [];

    function resolveMouseEvent(params: unknown) {
      const mouseEvent = (params as { event?: { event?: MouseEvent } })?.event?.event;

      if (!(mouseEvent instanceof MouseEvent)) {
        return null;
      }

      return mouseEvent;
    }

    function openTooltip(params: unknown) {
      const label = resolveDashboardTooltipLabel(params);
      const item = resolveDashboardTooltipItem(label, tooltipContext);
      const mouseEvent = resolveMouseEvent(params);

      if (!item || !mouseEvent) {
        setTooltipState(null);
        return;
      }

      setTooltipState({
        color: item.color,
        label: item.label,
        position: {
          left: mouseEvent.clientX,
          top: mouseEvent.clientY - 14,
          width: 172,
        },
        value: item.value,
      });
    }

    function initializeChart(node: HTMLDivElement, index: number) {
      const existingChart = echarts.getInstanceByDom(node);
      const chart = existingChart ?? echarts.init(node);

      chart.setOption(chartOptions[index]);
      chart.off("mousemove");
      chart.off("globalout");
      chart.on("mousemove", openTooltip);
      chart.on("globalout", () => {
        setTooltipState(null);
      });

      markChartReady(chart, index, readyTimers);

      return chart;
    }

    const mountedChartNodes = chartNodes.filter((node): node is HTMLDivElement => Boolean(node));
    const chartInstances = mountedChartNodes.map((node, index) => initializeChart(node, index));
    const resizeObserver = observeChartResize(mountedChartNodes, chartInstances);

    return () => {
      resizeObserver.disconnect();
      setTooltipState(null);
      readyTimers.forEach((timer) => {
        window.clearTimeout(timer);
      });
      chartInstances.forEach((chart) => {
        chart?.dispose();
      });
    };
  }, [metrics, tooltipContext]);

  /* ================================================================================== */
  /* render */
  /* ================================================================================== */

  return (
    <>
      <div className="grid gap-3 lg:h-full lg:min-h-0 lg:auto-rows-fr lg:grid-cols-2">
        {chartCards.map((card, index) => {
          const chartVisibilityClass = readyCharts[index] ? "opacity-100" : "opacity-0";

          return (
            <div
              key={card.title}
              className="group/chart-card flex min-h-[260px] flex-col rounded-[24px] border border-border bg-white p-4 text-primary lg:min-h-0"
            >
              <ChartCardHeader
                title={card.title}
                description={card.description}
                // 이미지 다운로드 버튼
                imageDownloadButton={
                  <Button
                    variant="secondary"
                    className="pointer-events-none h-9 w-9 rounded-xl p-0 text-text-muted opacity-0 shadow-[0_10px_24px_rgba(23,32,51,0.08)] transition-[opacity,color,border-color] duration-200 hover:text-text group-hover/chart-card:pointer-events-auto group-hover/chart-card:opacity-100"
                    onClick={() => {
                      void handleDownloadChartCard(index);
                    }}
                    aria-label={`${card.title} 차트 다운로드`}
                    title={`${card.title} 차트 다운로드`}
                  >
                    <DownloadIcon className="h-[18px] w-[18px] stroke-[2px]" />
                  </Button>
                }
                // 범례
                legend={
                  card.legendItems ? (
                    <ChartLegend
                      items={card.legendItems.map((item) => ({
                        color:
                          item.colorKey === "todoStrong"
                            ? tooltipContext.todoStrong
                            : item.colorKey === "doneStrong"
                              ? tooltipContext.doneStrong
                              : tooltipContext.primary,
                        label: item.label,
                      }))}
                    />
                  ) : undefined
                }
              />
              <div className="relative mt-3 min-h-[170px] flex-1 lg:min-h-0">
                {/* 로딩 스피너 오버레이 */}
                {readyCharts[index] ? null : (
                  <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[20px] bg-white/78">
                    <LoadingSpinner label={`${card.title} 차트를 불러오는 중입니다.`} />
                  </div>
                )}
                {/* 실제 차트 DOM 영역 */}
                <div
                  ref={(node) => {
                    chartRefs.current[index] = node;
                  }}
                  className={`absolute inset-0 h-full w-full transition-opacity duration-200 ${chartVisibilityClass}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 툴팁 */}
      <Tooltip
        isOpen={!!tooltipState}
        position={tooltipState?.position ?? null}
        transform="translate(-50%, -100%)"
      >
        {tooltipState ? (
          <div className="flex items-center gap-2.5">
            {/* 아이콘 */}
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: tooltipState.color,
              }}
            />

            {/* label */}
            <span className="flex-1 text-xs font-semibold text-white/78">{tooltipState.label}</span>

            {/* value */}
            <strong className="text-lg font-semibold text-white">{tooltipState.value}</strong>
          </div>
        ) : null}
      </Tooltip>
    </>
  );
}
