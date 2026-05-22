import { TaskFilter } from "@/widgets/task-list/model/task-list-controls";
import type { ReactNode } from "react";

type StatusBadgeProps = {
  children: ReactNode;
  className?: string;
  tone: TaskFilter;
};

/**
 * @page  - [공통 UI]
 * @title - 상태 배지 컴포넌트
 * @desc  - 상태 톤에 맞는 공통 배지 UI 렌더링
 */
export function StatusBadge({ children, className, tone }: StatusBadgeProps) {
  const toneClass =
    tone === "done"
      ? "border-status-done-strong/20 text-status-done-strong"
      : tone === "todo"
        ? "border-status-todo-strong/20 text-status-todo-strong"
        : "border-border text-text-muted";

  return (
    <span
      className={[
        "inline-flex rounded-full border bg-white px-3 py-1 text-xs font-semibold tracking-[0.12em]",
        toneClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
