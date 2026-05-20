"use client";

import { useState } from "react";
import Link from "next/link";
import type { TaskItem } from "@/shared/api/contracts";
import { Tooltip, type TooltipPosition } from "@/shared/ui/tooltip";

type TaskCardProps = {
  task: TaskItem;
};

const TASK_MEMO_PREVIEW_MAX_LENGTH = 80;

export function TaskCard({ task }: TaskCardProps) {
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
  const badgeClass =
    task.status === "DONE"
      ? "border border-status-done-strong/20 bg-white text-status-done-strong"
      : "border border-status-todo-strong/20 bg-white text-status-todo-strong";
  const idClass =
    task.status === "DONE" ? "text-status-done-strong" : "text-status-todo-strong";

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

  return (
    <div className="relative h-full cursor-pointer" style={{ cursor: "pointer" }}>
      <Link
        href={`/task/${task.id}`}
        className={[
          "flex h-[180px] min-h-[180px] max-h-[180px] cursor-pointer flex-col rounded-[24px] border p-9 outline-none transition-[transform,box-shadow,background-color] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] focus-visible:shadow-[0_0_0_2px_var(--color-surface)] [&_*]:!cursor-pointer",
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
          <span
            className={`inline-flex shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-[0.12em] ${badgeClass}`}
          >
            {task.status}
          </span>
        </div>

        <div className="mt-4 min-h-0 flex-1 overflow-hidden">
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
              <p className="min-h-0 overflow-hidden break-words text-sm leading-6 text-text-muted">
                {memoPreview}
              </p>
            </div>
          ) : (
            <p className="line-clamp-3 min-h-0 overflow-hidden text-sm leading-6 text-text-muted">
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
