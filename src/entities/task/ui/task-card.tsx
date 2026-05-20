"use client";

import { useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import type { TaskItem } from "@/shared/api/contracts";

type TaskCardProps = {
  task: TaskItem;
};

type TooltipPosition = {
  left: number;
  top: number;
  width: number;
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

      {shouldShowMemoTooltip &&
      isMemoTooltipOpen &&
      tooltipPosition &&
      typeof document !== "undefined"
        ? createPortal(
            <div
              className="fixed z-[9999] cursor-pointer"
              onMouseEnter={() => {
                setIsMemoTooltipOpen(true);
              }}
              onMouseLeave={() => {
                closeMemoTooltip();
              }}
              style={{
                left: tooltipPosition.left,
                top: tooltipPosition.top,
                width: tooltipPosition.width,
                transform: "translateY(-100%)",
                cursor: "pointer",
              }}
            >
              <div className="relative rounded-[18px] border border-[#151a23] bg-[#151a23] px-4 py-3 text-sm leading-6 text-white shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
                {task.memo}
                <span className="absolute left-6 top-full h-3 w-3 -translate-y-1/2 rotate-45 border-r border-b border-[#151a23] bg-[#151a23]" />
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
