"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/shared/ui/button";

type ConfirmDialogProps = {
  triggerClassName?: string;
  triggerVariant?: "primary" | "secondary" | "ghost" | "danger";
  confirmLabel?: string;
  description: string;
  isPending?: boolean;
  title: string;
  trigger: ReactNode;
  onConfirm: () => void | Promise<void>;
};

/**
 * @page  - [공통 UI]
 * @title - 확인 다이얼로그 컴포넌트
 * @desc  - 트리거 버튼 클릭 시 확인/취소 모달 제공
 */
export function ConfirmDialog({
  triggerClassName,
  triggerVariant = "secondary",
  confirmLabel = "확인",
  description,
  isPending = false,
  title,
  trigger,
  onConfirm,
}: ConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (typeof document === "undefined") {
    return (
      <Button
        variant={triggerVariant}
        className={triggerClassName}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {trigger}
      </Button>
    );
  }

  return (
    <>
      <Button
        variant={triggerVariant}
        className={triggerClassName}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {trigger}
      </Button>
      {isOpen
        ? createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#172033]/35 px-4">
              <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
                className="w-full max-w-md rounded-[28px] border border-border bg-white p-6 shadow-2xl"
              >
                <div>
                  <h2 id="confirm-dialog-title" className="text-xl font-semibold text-text">
                    {title}
                  </h2>
                  <p
                    id="confirm-dialog-description"
                    className="mt-3 text-sm leading-6 text-text-muted"
                  >
                    {description}
                  </p>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    disabled={isPending}
                  >
                    취소
                  </Button>
                  <Button
                    onClick={async () => {
                      await onConfirm();
                      setIsOpen(false);
                    }}
                    disabled={isPending}
                  >
                    {confirmLabel}
                  </Button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
