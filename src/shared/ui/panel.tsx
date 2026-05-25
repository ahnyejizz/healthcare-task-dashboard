import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

type PanelProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  description?: ReactNode;
  rightComponents?: ReactNode;
  title?: string;
};

/**
 * @page  - [공통 UI]
 * @title - 패널 컴포넌트
 * @desc  - 제목, 설명, 우측 액션, 본문을 포함한 공통 패널 렌더링
 */
export function Panel({
  children,
  className,
  contentClassName,
  description,
  rightComponents,
  title,
}: PanelProps) {
  return (
    <section
      className={cn("surface-card rounded-[28px]", "px-6 py-5 lg:px-8 lg:py-7", className)}
    >
      {title ? (
        <header className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-text">{title}</h1>
            {description ? (
              <div className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">{description}</div>
            ) : null}
          </div>
          {rightComponents ? (
            <div className="w-full max-w-full xl:w-auto xl:max-w-none xl:shrink-0">
              {rightComponents}
            </div>
          ) : null}
        </header>
      ) : null}
      <div className={contentClassName}>{children}</div>
    </section>
  );
}
