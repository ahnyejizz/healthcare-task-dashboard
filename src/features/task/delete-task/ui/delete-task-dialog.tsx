"use client";

import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { deleteTask } from "@/shared/api/tasks";
import { ApiError } from "@/shared/api/http";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { CheckIcon } from "@/shared/ui/icons";
import { Input } from "@/shared/ui/input";

type DeleteTaskDialogProps = {
  buttonClassName?: string;
  id: string;
  trigger?: ReactNode;
  triggerVariant?: "primary" | "secondary" | "ghost" | "danger";
};

type DeleteTaskFormValues = {
  confirmValue: string;
};

export function DeleteTaskDialog({
  buttonClassName,
  id,
  trigger,
  triggerVariant = "danger",
}: DeleteTaskDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<DeleteTaskFormValues>({
    mode: "onChange",
    defaultValues: {
      confirmValue: "",
    },
  });

  async function onSubmit() {
    setErrorMessage("");

    try {
      await deleteTask(id);
      dialogRef.current?.close();
      reset();
      queryClient.removeQueries({ queryKey: ["tasks"] });
      queryClient.removeQueries({ queryKey: ["task-detail", id] });
      setIsSuccessOpen(true);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : "삭제 처리에 실패했습니다.",
      );
    }
  }

  return (
    <>
      <Button
        variant={triggerVariant}
        className={buttonClassName}
        onClick={() => {
          reset();
          setErrorMessage("");
          dialogRef.current?.showModal();
        }}
      >
        {trigger ?? "삭제"}
      </Button>
      <dialog
        ref={dialogRef}
        className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-xl rounded-[28px] border border-border bg-white p-0 shadow-2xl backdrop:bg-[#172033]/35"
      >
        <form className="p-6" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-xl font-semibold text-text">삭제 확인</h2>
          <p className="mt-3 text-sm leading-6 text-text-muted">
            삭제를 진행하려면 아래 입력창에 정확한 ID를 입력해주세요.
          </p>
          <div className="mt-5">
            <Input
              id="delete-task-id"
              label={`할 일 ID (${id})`}
              errorMessage={errors.confirmValue?.message}
              {...register("confirmValue", {
                required: "할 일 ID를 입력해주세요.",
                validate: (value) =>
                  value === id || "정확한 할 일 ID를 입력해주세요.",
              })}
            />
          </div>
          {errorMessage ? (
            <p className="mt-3 text-sm text-danger">{errorMessage}</p>
          ) : null}
          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                dialogRef.current?.close();
                reset();
                setErrorMessage("");
              }}
            >
              취소
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              제출
            </Button>
          </div>
        </form>
      </dialog>
      {typeof document !== "undefined" && isSuccessOpen
        ? createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#172033]/35 px-4">
              <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-success-title"
                aria-describedby="delete-success-description"
                className="w-full max-w-md rounded-[28px] border border-border bg-white p-6 shadow-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-success/10 text-success">
                    <CheckIcon className="size-7" />
                  </div>
                  <div>
                    <h2
                      id="delete-success-title"
                      className="text-xl font-semibold text-text"
                    >
                      삭제되었습니다.
                    </h2>
                    <p
                      id="delete-success-description"
                      className="mt-2 text-sm leading-6 text-text-muted"
                    >
                      목록으로 돌아가시면 최신 목록을 확인할 수 있습니다.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={() => {
                      setIsSuccessOpen(false);
                      router.push(routes.taskList);
                      router.refresh();
                    }}
                  >
                    확인
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
