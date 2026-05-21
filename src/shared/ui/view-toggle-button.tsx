import type { ReactNode } from "react";
import { Button } from "@/shared/ui/button";

type ViewToggleButtonProps = {
  activeClassName?: string;
  children: ReactNode;
  inactiveClassName?: string;
  isActive: boolean;
  label: string;
  onClick: () => void;
};

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
      className={[
        "h-9 w-9 rounded-xl p-0",
        isActive
          ? (activeClassName ?? "border-primary/40 bg-surface-muted text-primary")
          : (inactiveClassName ?? "text-text-muted hover:text-text"),
      ].join(" ")}
      onClick={onClick}
    >
      <span className="flex h-full w-full items-center justify-center">
        {children}
      </span>
    </Button>
  );
}
