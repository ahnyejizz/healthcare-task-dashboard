import type { ReactNode } from "react";

type StatusBadgeTone = "all" | "done" | "todo";

type StatusBadgeProps = {
  children: ReactNode;
  className?: string;
  tone: StatusBadgeTone;
};

export function StatusBadge({
  children,
  className,
  tone,
}: StatusBadgeProps) {
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
