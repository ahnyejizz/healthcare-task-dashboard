"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { TaskItem } from "@/shared/api/contracts";
import { StatusBadge } from "@/shared/ui/status-badge";
import { Tooltip, type TooltipPosition } from "@/shared/ui/tooltip";

type TaskCardProps = {
  task: TaskItem;
  variant?: "card" | "list";
};

const TASK_MEMO_PREVIEW_MAX_LENGTH = 80;

export function TaskCard({ task, variant = "card" }: TaskCardProps) {
  const [isMemoTooltipOpen, setIsMemoTooltipOpen] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(
    null,
  );

  const shouldShowMemoTooltip = task.memo.length > TASK_MEMO_PREVIEW_MAX_LENGTH;
  const memoPreview = shouldShowMemoTooltip
    ? `${task.memo.slice(0, TASK_MEMO_PREVIEW_MAX_LENGTH).trimEnd()}...`
    : task.memo;
  const cardClass =
    task.status === "DONE"
      ? "border-status-done-strong/35 bg-status-done-surface hover:bg-status-done-surface"
      : "border-status-todo-strong/35 bg-status-todo-surface hover:bg-status-todo-surface";
  const idClass =
    task.status === "DONE" ? "text-status-done-strong" : "text-status-todo-strong";
  const isList = variant === "list";

  function openMemoTooltip(target: HTMLDivElement) {
    if (!shouldShowMemoTooltip) {
      return;
    }

    const rect = target.getBoundingClientRect();
    setTooltipPosition({
      left: rect.left,
      top: rect.top - 14,
      width: rect.width,
    });
    setIsMemoTooltipOpen(true);
  }

  function closeMemoTooltip() {
    setIsMemoTooltipOpen(false);
  }

  useEffect(() => {
    if (!isMemoTooltipOpen) {
      return;
    }

    const handleViewportChange = () => {
      closeMemoTooltip();
    };

    window.addEventListener("scroll", handleViewportChange, true);
    window.addEventListener("resize", handleViewportChange);

    return () => {
      window.removeEventListener("scroll", handleViewportChange, true);
      window.removeEventListener("resize", handleViewportChange);
    };
  }, [isMemoTooltipOpen]);

  return (
    <div className="relative h-full cursor-pointer" style={{ cursor: "pointer" }}>
      <Link
        href={`/task/${task.id}`}
        className={[
          isList
            ? "flex h-[118px] min-h-[118px] max-h-[118px] cursor-pointer flex-col rounded-[22px] border px-6 py-5 outline-none transition-[transform,box-shadow,background-color] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] focus-visible:shadow-[0_0_0_2px_var(--color-surface)] [&_*]:!cursor-pointer"
            : "flex h-[180px] min-h-[180px] max-h-[180px] cursor-pointer flex-col rounded-[24px] border p-9 outline-none transition-[transform,box-shadow,background-color] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] focus-visible:shadow-[0_0_0_2px_var(--color-surface)] [&_*]:!cursor-pointer",
          cardClass,
        ].join(" ")}
        style={{ cursor: "pointer" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p
              className={[
                "text-[11px] font-semibold tracking-[0.16em] uppercase",
                idClass,
              ].join(" ")}
            >
              {task.id}
            </p>
            <h2 className="mt-2.5 text-[1.02rem] leading-tight font-semibold tracking-tight text-text">
              {task.title}
            </h2>
          </div>
          <StatusBadge
            tone={task.status === "DONE" ? "done" : "todo"}
            className="shrink-0 px-3.5 py-1.5"
          >
            {task.status}
          </StatusBadge>
        </div>

        <div className={isList ? "mt-3 min-h-0 flex-1 overflow-hidden" : "mt-4 min-h-0 flex-1 overflow-hidden"}>
          {shouldShowMemoTooltip ? (
            <div
              className="h-full cursor-pointer"
              style={{ cursor: "pointer" }}
              onMouseEnter={(event) => {
                openMemoTooltip(event.currentTarget);
              }}
              onMouseLeave={() => {
                closeMemoTooltip();
              }}
            >
              <p
                className={[
                  "min-h-0 overflow-hidden break-words text-sm text-text-muted",
                  isList ? "line-clamp-2 leading-5" : "leading-6",
                ].join(" ")}
              >
                {memoPreview}
              </p>
            </div>
          ) : (
            <p
              className={[
                "min-h-0 overflow-hidden text-sm text-text-muted",
                isList ? "line-clamp-2 leading-5" : "line-clamp-3 leading-6",
              ].join(" ")}
            >
              {task.memo}
            </p>
          )}
        </div>
      </Link>

      <Tooltip
        isOpen={shouldShowMemoTooltip && isMemoTooltipOpen}
        position={tooltipPosition}
        onMouseEnter={() => {
          setIsMemoTooltipOpen(true);
        }}
        onMouseLeave={() => {
          closeMemoTooltip();
        }}
      >
        {task.memo}
      </Tooltip>
    </div>
  );
}
