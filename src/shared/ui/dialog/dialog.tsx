"use client";

import type { ReactNode } from "react";
import { useId } from "react";
import { createPortal } from "react-dom";

type DialogProps = {
  children?: ReactNode;
  className?: string;
  description?: string;
  footer?: ReactNode;
  header?: ReactNode;
  isOpen: boolean;
  title: string;
};

/**
 * @page  - [공통 UI]
 * @title - 공통 다이얼로그 컴포넌트
 * @desc  - 포털 기반의 공통 모달 렌더링
 */
export function Dialog({
  children,
  className,
  description,
  footer,
  header,
  isOpen,
  title,
}: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#172033]/35 px-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={header ? undefined : description ? descriptionId : undefined}
        className={["w-full rounded-[28px] border border-border bg-white p-6 shadow-2xl", className]
          .filter(Boolean)
          .join(" ")}
      >
        {header ? (
          header
        ) : (
          <div>
            <h2 id={titleId} className="text-xl font-semibold text-text">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="mt-3 text-sm leading-6 text-text-muted">
                {description}
              </p>
            ) : null}
          </div>
        )}
        {children ? <div className={description ? "mt-5" : "mt-0"}>{children}</div> : null}
        {footer ? <div className="mt-6">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}
