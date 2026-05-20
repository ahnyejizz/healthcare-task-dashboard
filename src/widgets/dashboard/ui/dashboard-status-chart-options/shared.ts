import type { DashboardResponse } from "@/shared/api/contracts";

export type DashboardChartOptionContext = {
  border: string;
  doneRate: number;
  doneStrong: string;
  doneSurface: string;
  metrics: DashboardResponse;
  primary: string;
  primarySurface: string;
  surface: string;
  text: string;
  textMuted: string;
  todoRate: number;
  todoStrong: string;
  todoSurface: string;
};

type DashboardTooltipItem = {
  color: string;
  label: string;
  value: number;
};

type TooltipParamLike = {
  axisValue?: unknown;
  axisValueLabel?: unknown;
  name?: unknown;
};

function readColorToken(name: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

export function toRgba(color: string, alpha: number) {
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

export function createDashboardChartOptionContext(
  metrics: DashboardResponse,
): DashboardChartOptionContext {
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

  return {
    border,
    doneRate,
    doneStrong,
    doneSurface: toRgba(doneStrong, 0.4),
    metrics,
    primary,
    primarySurface: toRgba(primary, 0.4),
    surface,
    text,
    textMuted,
    todoRate,
    todoStrong,
    todoSurface: toRgba(todoStrong, 0.4),
  };
}

export function createDashboardTooltipConfig() {
  return {
    show: false,
    triggerOn: "none",
  };
}

export function resolveDashboardTooltipItem(
  label: string,
  context: DashboardChartOptionContext,
): DashboardTooltipItem | null {
  if (label === "전체") {
    return {
      color: context.primary,
      label,
      value: context.metrics.numOfTask,
    };
  }

  if (label === "해야할 일") {
    return {
      color: context.todoStrong,
      label,
      value: context.metrics.numOfRestTask,
    };
  }

  if (label === "한 일") {
    return {
      color: context.doneStrong,
      label,
      value: context.metrics.numOfDoneTask,
    };
  }

  return null;
}

export function renderDashboardTooltip(
  item: DashboardTooltipItem | null,
  context: DashboardChartOptionContext,
) {
  if (!item) {
    return "";
  }

  return [
    `<div style="display:flex;align-items:center;gap:10px;min-width:122px;padding:10px 12px;">`,
    `<span style="width:10px;height:10px;border-radius:999px;background:${item.color};box-shadow:0 0 0 3px ${toRgba(item.color, 0.18)};"></span>`,
    `<span style="flex:1;color:${context.textMuted};font-size:13px;font-weight:600;line-height:1;">${item.label}</span>`,
    `<strong style="color:${context.text};font-size:20px;font-weight:700;line-height:1;">${item.value}</strong>`,
    `</div>`,
  ].join("");
}

export function resolveDashboardTooltipLabel(params: unknown) {
  if (Array.isArray(params)) {
    return resolveDashboardTooltipLabel(params[0]);
  }

  if (!params || typeof params !== "object") {
    return "";
  }

  const tooltipParam = params as TooltipParamLike;

  if (typeof tooltipParam.name === "string") {
    return tooltipParam.name;
  }

  if (typeof tooltipParam.axisValueLabel === "string") {
    return tooltipParam.axisValueLabel;
  }

  if (typeof tooltipParam.axisValue === "string") {
    return tooltipParam.axisValue;
  }

  return "";
}
