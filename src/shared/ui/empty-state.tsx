import type { ReactNode } from "react";

// shared
import { cn } from "@/shared/lib/cn";
import { EmptyStateIcon } from "@/shared/ui/icons";

type EmptyStateProps = {
  className?: string;
  description: string;
  icon?: ReactNode;
  title: string;
};

/**
 * @page  - [공통 UI]
 * @title - 엠티셋 컴포넌트
 * @desc  - 검색어에 따른 검색 결과가 존재하지 않는 경우 공통 EmptyState UI 렌더링
 */
export function EmptyState({
  className,
  description,
  icon = <EmptyStateIcon className="size-11 text-white" />,
  title,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "surface-highlight flex h-full min-h-full w-full flex-col items-center justify-center rounded-[28px] border border-border px-8 py-10 text-center shadow-[0_24px_48px_rgba(252,175,24,0.14)]",
        className,
      )}
    >
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[26px] bg-primary text-white shadow-[0_18px_30px_rgba(252,175,24,0.28)]">
        {icon}
      </div>
      <strong className="mt-6 text-xl font-semibold tracking-[-0.02em] text-text">{title}</strong>
      <p className="mt-3 max-w-xl text-sm leading-6 text-text-muted">{description}</p>
    </div>
  );
}
