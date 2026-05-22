import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button/button";

type ViewToggleButtonProps = {
  activeClassName?: string;
  children: ReactNode;
  inactiveClassName?: string;
  isActive: boolean;
  label: string;
  onClick: () => void;
};

/**
 * @page  - [공통 UI]
 * @title - 뷰 토글 버튼 컴포넌트
 * @desc  - 활성화 상태를 포함한 공통 토글 버튼 렌더링
 */
export function ViewToggleButton({
  activeClassName,
  children,
  inactiveClassName,
  isActive,
  label,
  onClick,
}: ViewToggleButtonProps) {
  return (
    <Button
      variant="secondary"
      aria-label={label}
      title={label}
      className={cn(
        "h-9 w-9 rounded-xl p-0",
        isActive
          ? (activeClassName ?? "border-primary/40 bg-surface-muted text-primary")
          : (inactiveClassName ?? "text-text-muted hover:text-text"),
      )}
      onClick={onClick}
    >
      <span className="flex h-full w-full items-center justify-center">{children}</span>
    </Button>
  );
}
