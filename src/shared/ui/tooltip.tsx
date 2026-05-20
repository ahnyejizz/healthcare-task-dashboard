"use client";

import type { ReactNode } from "react";
import { createPortal } from "react-dom";

export type TooltipPosition = {
  left: number;
  top: number;
  width: number;
};

type TooltipProps = {
  children: ReactNode;
  isOpen: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  position: TooltipPosition | null;
};

export function Tooltip({
  children,
  isOpen,
  onMouseEnter,
  onMouseLeave,
  position,
}: TooltipProps) {
  if (!isOpen || !position || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed z-[9999] cursor-pointer"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        left: position.left,
        top: position.top,
        width: position.width,
        transform: "translateY(-100%)",
        cursor: "pointer",
      }}
    >
      <div className="relative rounded-[18px] border border-[#151a23] bg-[#151a23] px-4 py-3 text-sm leading-6 text-white shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
        {children}
        <span className="absolute left-6 top-full h-3 w-3 -translate-y-1/2 rotate-45 border-r border-b border-[#151a23] bg-[#151a23]" />
      </div>
    </div>,
    document.body,
  );
}
