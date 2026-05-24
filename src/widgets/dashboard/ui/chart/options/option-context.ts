import type { DashboardResponse } from "@/shared/api/api-types";

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

/**
 * @page  - [대시보드]
 * @title - 색상 토큰 조회 함수
 * @desc  - CSS 색상 토큰 값을 읽어 반환
 */
function readColorToken(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * @page  - [대시보드]
 * @title - rgba 변환 함수
 * @desc  - 차트 색상 값을 rgba 문자열로 변환
 */
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

/**
 * @page  - [대시보드]
 * @title - 차트 옵션 컨텍스트 생성 함수
 * @desc  - 대시보드 차트 공통 옵션 계산에 필요한 값 반환
 */
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

/**
 * @page  - [대시보드]
 * @title - 툴팁 항목 조회 함수
 * @desc  - 툴팁 라벨에 대응하는 차트 항목 정보 반환
 */
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

/**
 * @page  - [대시보드]
 * @title - 툴팁 라벨 추출 함수
 * @desc  - ECharts 이벤트 파라미터에서 툴팁 라벨 반환
 */
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
