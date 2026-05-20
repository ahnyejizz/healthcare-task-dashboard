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
