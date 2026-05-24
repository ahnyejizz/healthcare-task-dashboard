"use client";

import type { CSSProperties, ReactNode } from "react";
import { createPortal } from "react-dom";

export type TooltipPosition = {
  left: number;
  top: number;
  width?: number;
};

type TooltipProps = {
  arrowLeft?: string;
  children: ReactNode;
  isOpen: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  position: TooltipPosition | null;
  transform?: string;
};

/**
 * @page  - [공통 UI]
 * @title - 툴팁 컴포넌트
 * @desc  - 포털 기반의 공통 말풍선 툴팁 렌더링
 */
export function Tooltip({
  arrowLeft = "calc(50% - 0.375rem)", // 툴팁 꼬리 중앙
  children,
  isOpen,
  onMouseEnter,
  onMouseLeave,
  position,
  transform = "translateY(-100%)",
}: TooltipProps) {
  if (!isOpen || !position || typeof document === "undefined") {
    return null;
  }

  const containerStyle: CSSProperties = {
    left: position.left,
    top: position.top,
    transform,
    cursor: "pointer",
  };

  if (typeof position.width === "number") {
    containerStyle.width = position.width;
  }

  return createPortal(
    <div
      className="fixed z-[9999]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={containerStyle}
    >
      <div className="relative rounded-[18px] border border-[#151a23] bg-[#151a23] px-4 py-3 text-sm leading-6 text-white shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
        {children}
        <span
          className="absolute top-full h-3 w-3 -translate-y-1/2 rotate-45 border-r border-b border-[#151a23] bg-[#151a23]"
          style={{ left: arrowLeft }}
        />
      </div>
    </div>,
    document.body,
  );
}
