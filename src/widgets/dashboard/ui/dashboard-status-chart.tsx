"use client";

import { useMemo } from "react";
import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import type { DashboardResponse } from "@/shared/api/contracts";
import { Spinner } from "@/shared/ui/spinner";
import { Tooltip, type TooltipPosition } from "@/shared/ui/tooltip";
import { DashboardChartCard } from "@/widgets/dashboard/ui/dashboard-chart-card";
import {
  createDashboardChartOptions,
  dashboardChartCards,
} from "@/widgets/dashboard/ui/dashboard-status-chart-options";
import {
  createDashboardChartOptionContext,
  resolveDashboardTooltipItem,
  resolveDashboardTooltipLabel,
} from "@/widgets/dashboard/ui/dashboard-status-chart-options/shared";

type DashboardStatusChartProps = {
  metrics: DashboardResponse;
};

type ChartTooltipState = {
  color: string;
  label: string;
  position: TooltipPosition;
  value: number;
} | null;

export function DashboardStatusChart({ metrics }: DashboardStatusChartProps) {
  const chartRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [readyCharts, setReadyCharts] = useState<boolean[]>(() =>
    dashboardChartCards.map(() => false),
  );
  const [tooltipState, setTooltipState] = useState<ChartTooltipState>(null);
  const tooltipContext = useMemo(
    () => createDashboardChartOptionContext(metrics),
    [metrics],
  );

  useEffect(() => {
    const chartNodes = chartRefs.current.slice(0, dashboardChartCards.length);

    if (chartNodes.some((node) => !node)) {
      return;
    }

    const chartOptions = createDashboardChartOptions(metrics);
    setReadyCharts(dashboardChartCards.map(() => false));
    const readyTimers: number[] = [];

    const chartInstances = chartNodes.map((node, index) => {
      if (!node) {
        return null;
      }

      const existingChart = echarts.getInstanceByDom(node);
      const chart = existingChart ?? echarts.init(node);
      chart.setOption(chartOptions[index]);
      chart.off("mousemove");
      chart.off("globalout");
      chart.on("mousemove", (params: unknown) => {
        const label = resolveDashboardTooltipLabel(params);
        const item = resolveDashboardTooltipItem(label, tooltipContext);

        if (
          !item ||
          !params ||
          typeof params !== "object" ||
          !("event" in params) ||
          !params.event ||
          typeof params.event !== "object" ||
          !("event" in params.event) ||
          !(params.event.event instanceof MouseEvent)
        ) {
          setTooltipState(null);
          return;
        }

        const mouseEvent = params.event.event;
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
      });
      chart.on("globalout", () => {
        setTooltipState(null);
      });

      window.requestAnimationFrame(() => {
        chart.resize();
        const timer = window.setTimeout(() => {
          setReadyCharts((current) =>
            current.map((item, readyIndex) =>
              readyIndex === index ? true : item,
            ),
          );
        }, 220);

        readyTimers.push(timer);
      });

      return chart;
    });

    const resizeObserver = new ResizeObserver(() => {
      chartInstances.forEach((chart) => {
        if (!chart) {
          return;
        }

        chart.resize();
      });
    });

    chartNodes.forEach((node) => {
      if (!node) {
        return;
      }

      resizeObserver.observe(node);
    });

    return () => {
      resizeObserver.disconnect();
      setTooltipState(null);
      readyTimers.forEach((timer) => {
        window.clearTimeout(timer);
      });
      chartInstances.forEach((chart) => {
        if (!chart) {
          return;
        }

        chart.dispose();
      });
    };
  }, [metrics, tooltipContext]);

  return (
    <>
      <div className="grid h-full min-h-0 auto-rows-fr gap-3 lg:grid-cols-2">
        {dashboardChartCards.map((card, index) => (
          <div
            key={card.title}
            className="flex h-full flex-col rounded-[24px] border border-border bg-white p-4 text-primary"
          >
            <DashboardChartCard
              title={card.title}
              description={card.description}
            />
            <div className="relative mt-3 min-h-[210px] flex-1">
              {readyCharts[index] ? null : (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[20px] bg-white/78">
                  <Spinner label={`${card.title} 차트를 불러오는 중입니다.`} />
                </div>
              )}
              <div
                ref={(node) => {
                  chartRefs.current[index] = node;
                }}
                className={[
                  "absolute inset-0 h-[235px] w-full transition-opacity duration-200 lg:h-full",
                  readyCharts[index] ? "opacity-100" : "opacity-0",
                ].join(" ")}
              />
            </div>
          </div>
        ))}
      </div>
      <Tooltip
        isOpen={Boolean(tooltipState)}
        position={tooltipState?.position ?? null}
        transform="translate(-50%, -100%)"
        bubbleClassName="border border-[#151a23] bg-[#151a23] px-3 py-2.5"
      >
        {tooltipState ? (
          <div className="flex items-center gap-2.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: tooltipState.color,
                boxShadow: `0 0 0 3px ${tooltipState.color}2e`,
              }}
            />
            <span className="flex-1 text-xs font-semibold text-white/78">
              {tooltipState.label}
            </span>
            <strong className="text-lg font-semibold text-white">
              {tooltipState.value}
            </strong>
          </div>
        ) : null}
      </Tooltip>
    </>
  );
}
