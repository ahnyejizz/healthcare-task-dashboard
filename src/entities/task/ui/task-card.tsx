"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// shared
import type { TaskItem } from "@/shared/api/contracts";
import { cn } from "@/shared/lib/cn";
import { StatusBadge } from "@/shared/ui/status-badge";
import { Tooltip, type TooltipPosition } from "@/shared/ui/tooltip";

// widgets
import { type TaskListViewMode } from "@/widgets/task-list/model/task-list-controls";

type TaskCardProps = {
  task: TaskItem;
  variant?: TaskListViewMode;
};

const TASK_MEMO_PREVIEW_MAX_LENGTH = 80;
const TASK_CARD_BASE_CLASS =
  "flex cursor-pointer flex-col border outline-none transition-[transform,box-shadow,background-color] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] focus-visible:shadow-[0_0_0_2px_var(--color-surface)] [&_*]:!cursor-pointer";
const TASK_CARD_LIST_CLASS = "h-[118px] min-h-[118px] max-h-[118px] rounded-[22px] px-6 py-5";
const TASK_CARD_GRID_CLASS = "h-[180px] min-h-[180px] max-h-[180px] rounded-[24px] p-9";
const TASK_CARD_MEMO_BASE_CLASS = "min-h-0 flex-1 overflow-hidden";
const TASK_CARD_MEMO_TEXT_BASE_CLASS = "min-h-0 overflow-hidden text-sm text-text-muted";
const TASK_CARD_MEMO_TOOLTIP_TEXT_CLASS =
  "min-h-0 overflow-hidden break-words text-sm text-text-muted";

/**
 * @page  - [할 일 목록]
 * @title - 할 일 컴포넌트
 * @desc  - 태스크 ID, 태스크 명, 상태 뱃지, 메모 정보를 카드 또는 리스트 형태로 표시
 */
export function TaskCard({ task, variant = "card" }: TaskCardProps) {
  /* ================================================================================== */
  /* state */
  /* ================================================================================== */

  const [isMemoTooltipOpen, setIsMemoTooltipOpen] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(null);

  const shouldShowMemoTooltip = task.memo.length > TASK_MEMO_PREVIEW_MAX_LENGTH;

  const memoPreview = shouldShowMemoTooltip
    ? `${task.memo.slice(0, TASK_MEMO_PREVIEW_MAX_LENGTH).trimEnd()}...`
    : task.memo;

  const memoContainerClass = variant === "list" ? "mt-3" : "mt-4";
  const memoTextClass = variant === "list" ? "line-clamp-2 leading-5" : "line-clamp-3 leading-6";
  const memoTooltipTextClass = variant === "list" ? "line-clamp-2 leading-5" : "leading-6";
  const layoutClass = variant === "list" ? TASK_CARD_LIST_CLASS : TASK_CARD_GRID_CLASS;

  const cardClass =
    task.status === "DONE"
      ? "border-status-done-strong/35 bg-status-done-surface hover:bg-status-done-surface"
      : "border-status-todo-strong/35 bg-status-todo-surface hover:bg-status-todo-surface";
  const idClass = task.status === "DONE" ? "text-status-done-strong" : "text-status-todo-strong";
  const statusTone = task.status === "DONE" ? "done" : "todo";

  /* ================================================================================== */
  /* function */
  /* ================================================================================== */

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

  /* ================================================================================== */
  /* useEffect() */
  /* ================================================================================== */

  useEffect(() => {
    if (!isMemoTooltipOpen) {
      return;
    }

    const handleViewportChange = () => {
      setIsMemoTooltipOpen(false);
    };

    window.addEventListener("scroll", handleViewportChange, true);
    window.addEventListener("resize", handleViewportChange);

    return () => {
      window.removeEventListener("scroll", handleViewportChange, true);
      window.removeEventListener("resize", handleViewportChange);
    };
  }, [isMemoTooltipOpen]);

  /* ================================================================================== */
  /* render */
  /* ================================================================================== */

  return (
    <div className="relative h-full cursor-pointer">
      <Link
        href={`/task/${task.id}`}
        className={cn(TASK_CARD_BASE_CLASS, layoutClass, cardClass)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {/* id */}
            <p className={cn("text-[11px] font-semibold tracking-[0.16em] uppercase", idClass)}>
              {task.id}
            </p>

            {/* title */}
            <h2 className="mt-2.5 text-[1.02rem] leading-tight font-semibold tracking-tight text-text">
              {task.title}
            </h2>
          </div>

          {/* status */}
          <StatusBadge tone={statusTone} className="shrink-0 px-3.5 py-1.5">
            {task.status}
          </StatusBadge>
        </div>

        {/* memo */}
        <div className={cn(TASK_CARD_MEMO_BASE_CLASS, memoContainerClass)}>
          {shouldShowMemoTooltip ? (
            <div
              className="h-full cursor-pointer"
              onMouseEnter={(event) => {
                openMemoTooltip(event.currentTarget);
              }}
              onMouseLeave={() => {
                setIsMemoTooltipOpen(false);
              }}
            >
              <p className={cn(TASK_CARD_MEMO_TOOLTIP_TEXT_CLASS, memoTooltipTextClass)}>
                {memoPreview}
              </p>
            </div>
          ) : (
            <p className={cn(TASK_CARD_MEMO_TEXT_BASE_CLASS, memoTextClass)}>{task.memo}</p>
          )}
        </div>
      </Link>

      {/* 툴팁 */}
      <Tooltip
        isOpen={shouldShowMemoTooltip && isMemoTooltipOpen}
        position={tooltipPosition}
        onMouseEnter={() => {
          setIsMemoTooltipOpen(true);
        }}
        onMouseLeave={() => {
          setIsMemoTooltipOpen(false);
        }}
      >
        {task.memo}
      </Tooltip>
    </div>
  );
}
