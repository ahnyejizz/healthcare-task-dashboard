"use client";

import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import type { DashboardResponse } from "@/shared/api/contracts";
import { Spinner } from "@/shared/ui/spinner";
import { DashboardChartCard } from "@/widgets/dashboard/ui/dashboard-chart-card";
import {
  createDashboardChartOptions,
  dashboardChartCards,
} from "@/widgets/dashboard/ui/dashboard-status-chart-options";

type DashboardStatusChartProps = {
  metrics: DashboardResponse;
};

export function DashboardStatusChart({ metrics }: DashboardStatusChartProps) {
  const chartRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [readyCharts, setReadyCharts] = useState<boolean[]>(() =>
    dashboardChartCards.map(() => false),
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
  }, [metrics]);

  return (
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
  );
}
