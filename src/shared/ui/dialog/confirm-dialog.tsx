"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "@/shared/ui/button/button";
import { Dialog } from "@/shared/ui/dialog/dialog";

type ConfirmDialogProps = {
  children: ReactNode;
  description: string;
  isPending?: boolean;
  title: string;
  onConfirm: () => void | Promise<void>;
};

/**
 * @page  - [공통 UI]
 * @title - 확인 다이얼로그 컴포넌트
 * @desc  - 트리거 버튼 클릭 시 확인/취소 모달 제공
 */
export function ConfirmDialog({
  children,
  description,
  isPending = false,
  title,
  onConfirm,
}: ConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (typeof document === "undefined") {
    return (
      <Button
        variant="secondary"
        className="h-12 w-12 rounded-[18px] p-0 text-text hover:text-text"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {children}
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="secondary"
        className="h-12 w-12 rounded-[18px] p-0 text-text hover:text-text"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {children}
      </Button>

      {/* 컨펌 다이얼로그 */}
      <Dialog
        isOpen={isOpen}
        className="max-w-md"
        title={title}
        description={description}
        footer={
          <div className="flex justify-end gap-3">
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
              확인
            </Button>
          </div>
        }
      />
    </>
  );
}
