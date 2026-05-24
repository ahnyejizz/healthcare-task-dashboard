"use client";

import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

// shared
import { queryKeys } from "@/shared/api/query-keys";
import { deleteTask } from "@/shared/api/tasks";
import { ApiError } from "@/shared/api/http";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button/button";
import { Dialog } from "@/shared/ui/dialog/dialog";
import { CheckIcon } from "@/shared/ui/icons";
import { Input } from "@/shared/ui/input";

type DeleteTaskDialogProps = {
  children?: ReactNode;
  id: string;
};

type DeleteTaskFormValues = {
  confirmValue: string;
};

/**
 * @page  - [할 일 상세]
 * @title - 삭제 확인 다이얼로그 컴포넌트
 * @desc  - 할 일 삭제 전 ID 확인 입력 및 삭제 완료 안내 제공
 */
export function DeleteTaskDialog({ children, id }: DeleteTaskDialogProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
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
      setIsConfirmOpen(false);
      reset();
      queryClient.removeQueries({ queryKey: queryKeys.taskListPrefix });
      queryClient.removeQueries({ queryKey: queryKeys.taskDetail(id) });
      setIsSuccessOpen(true);
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? error.message : "삭제 처리에 실패했습니다.");
    }
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void handleSubmit(onSubmit)(event);
  }

  return (
    <>
      <Button
        variant="secondary"
        className="h-12 w-12 rounded-[20px] border border-border bg-white/90 px-0 py-0 text-text shadow-none hover:border-border hover:bg-white hover:text-text"
        onClick={() => {
          reset();
          setErrorMessage("");
          setIsConfirmOpen(true);
        }}
      >
        {children ?? "삭제"}
      </Button>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        isOpen={isConfirmOpen}
        className="max-w-xl p-0"
        title="삭제 확인"
        description="삭제를 진행하려면 아래 입력창에 정확한 ID를 입력해주세요."
      >
        <form className="p-6" onSubmit={handleFormSubmit}>
          <Input
            id="delete-task-id"
            label={`할 일 ID (${id})`}
            errorMessage={errors.confirmValue?.message}
            {...register("confirmValue", {
              required: "할 일 ID를 입력해주세요.",
              validate: (value) => value === id || "정확한 할 일 ID를 입력해주세요.",
            })}
          />
          {errorMessage ? <p className="mt-3 text-sm text-danger">{errorMessage}</p> : null}
          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                setIsConfirmOpen(false);
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
      </Dialog>

      {/* 삭제 완료 다이얼로그 */}
      <Dialog
        isOpen={isSuccessOpen}
        className="max-w-md"
        title="삭제되었습니다."
        header={
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-success/10 text-success">
              <CheckIcon className="size-7" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text">삭제되었습니다.</h2>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                목록으로 돌아가시면 최신 목록을 확인할 수 있습니다.
              </p>
            </div>
          </div>
        }
        footer={
          <div className="flex justify-end">
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
        }
      />
    </>
  );
}
