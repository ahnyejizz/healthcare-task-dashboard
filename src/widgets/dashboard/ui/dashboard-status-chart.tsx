"use client";

import { useEffect, useState, useRef } from "react";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";
import type { DashboardResponse } from "@/shared/api/contracts";
import { Spinner } from "@/shared/ui/spinner";

type DashboardStatusChartProps = {
  metrics: DashboardResponse;
};

type ChartCardProps = {
  description: string;
  title: string;
};

const chartCards: ChartCardProps[] = [
  {
    title: "카운트 비교",
    description: "전체 할 일, 남은 일, 완료한 일을 한눈에 비교할 수 있습니다.",
  },
  {
    title: "완료/잔여 비중",
    description: "전체 할 일 중 잔여 비중과 완료 비중을 도넛 차트로 확인합니다.",
  },
  {
    title: "완료율",
    description: "현재 진행률을 게이지로 빠르게 파악합니다.",
  },
  {
    title: "분포도",
    description: "남은 일과 완료한 일이 어느정도 비중을 차지하는지 보여줍니다.",
  },
];

function readColorToken(name: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

function toRgba(color: string, alpha: number) {
  if (color.startsWith("#")) {
    const normalized = color.replace("#", "");
    const hex =
      normalized.length === 3
        ? normalized
            .split("")
            .map((char) => char + char)
            .join("")
        : normalized;
    const red = Number.parseInt(hex.slice(0, 2), 16);
    const green = Number.parseInt(hex.slice(2, 4), 16);
    const blue = Number.parseInt(hex.slice(4, 6), 16);

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  const match = color.match(/\d+/g);

  if (match && match.length >= 3) {
    const [red, green, blue] = match;
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  return color;
}

function createChartOptions(metrics: DashboardResponse): EChartsOption[] {
  const total = metrics.numOfTask || 1;
  const doneRate = Math.round((metrics.numOfDoneTask / total) * 100);
  const todoRate = Math.round((metrics.numOfRestTask / total) * 100);
  const primary = readColorToken("--color-primary");
  const surface = readColorToken("--color-surface");
  const text = readColorToken("--color-text");
  const textMuted = readColorToken("--color-text-muted");
  const border = readColorToken("--color-border");
  const doneStrong = readColorToken("--color-status-done-strong");
  const todoStrong = readColorToken("--color-status-todo-strong");
  const primarySurface = toRgba(primary, 0.4);
  const doneSurface = toRgba(doneStrong, 0.4);
  const todoSurface = toRgba(todoStrong, 0.4);

  return [
    {
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
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: surface,
        borderColor: border,
        borderWidth: 1,
        textStyle: { color: text },
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
    },
    {
      animationDuration: 500,
      tooltip: {
        trigger: "item",
        backgroundColor: surface,
        borderColor: border,
        borderWidth: 1,
        textStyle: { color: text },
      },
      legend: {
        bottom: 0,
        left: "center",
        icon: "circle",
        itemWidth: 8,
        itemHeight: 8,
        textStyle: {
          color: textMuted,
          fontFamily: "Pretendard Variable, Pretendard",
          fontSize: 11,
          fontWeight: 600,
        },
      },
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
    },
    {
      animationDuration: 500,
      tooltip: {
        trigger: "item",
        backgroundColor: surface,
        borderColor: border,
        borderWidth: 1,
        textStyle: { color: text },
        formatter: (params) => {
          if (Array.isArray(params)) {
            return "";
          }

          const { name } = params;

          if (name === "한 일") {
            return `한 일 ${metrics.numOfDoneTask}`;
          }

          if (name === "해야할 일") {
            return `해야할 일 ${metrics.numOfRestTask}`;
          }

          return "";
        },
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
    },
    {
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
      tooltip: {
        trigger: "item",
        backgroundColor: surface,
        borderColor: border,
        borderWidth: 1,
        textStyle: { color: text },
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
    },
  ];
}

function DashboardChartCard({ description, title }: ChartCardProps) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.16em] text-text-muted uppercase">
        {title}
      </p>
      <p className="mt-1.5 text-sm leading-5 text-text-muted">{description}</p>
    </div>
  );
}

export function DashboardStatusChart({ metrics }: DashboardStatusChartProps) {
  const chartRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [readyCharts, setReadyCharts] = useState<boolean[]>(() =>
    chartCards.map(() => false),
  );

  useEffect(() => {
    const chartNodes = chartRefs.current.slice(0, chartCards.length);

    if (chartNodes.some((node) => !node)) {
      return;
    }

    const chartOptions = createChartOptions(metrics);
    setReadyCharts(chartCards.map(() => false));
    const readyTimers: number[] = [];

    const chartInstances = chartNodes.map((node, index) => {
      if (!node) {
        return null;
      }

      const safeNode = node as HTMLDivElement;
      const existingChart = echarts.getInstanceByDom(safeNode);
      const chart = existingChart ?? echarts.init(safeNode);
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
      {chartCards.map((card, index) => (
        <div
          key={card.title}
          className="flex h-full flex-col rounded-[24px] border border-border bg-white p-4"
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
