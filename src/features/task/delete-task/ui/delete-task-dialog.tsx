"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteTask } from "@/shared/api/tasks";
import { ApiError } from "@/shared/api/http";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

type DeleteTaskDialogProps = {
  id: string;
};

export function DeleteTaskDialog({ id }: DeleteTaskDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [confirmValue, setConfirmValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  const isMatch = confirmValue === id;

  async function handleDelete() {
    setIsPending(true);
    setErrorMessage("");

    try {
      await deleteTask(id);
      dialogRef.current?.close();
      router.push("/task");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : "삭제 처리에 실패했습니다.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <Button
        variant="danger"
        onClick={() => {
          dialogRef.current?.showModal();
        }}
      >
        삭제
      </Button>
      <dialog
        ref={dialogRef}
        className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-xl rounded-[28px] border border-border bg-white p-0 shadow-2xl backdrop:bg-[#172033]/35"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-text">삭제 확인</h2>
          <p className="mt-3 text-sm leading-6 text-text-muted">
            삭제를 진행하려면 아래 입력창에 정확한 할 일 ID를 입력해주세요.
          </p>
          <div className="mt-5">
            <Input
              id="delete-task-id"
              label={`할 일 ID (${id})`}
              value={confirmValue}
              onChange={(event) => {
                setConfirmValue(event.target.value);
              }}
            />
          </div>
          {errorMessage ? (
            <p className="mt-3 text-sm text-danger">{errorMessage}</p>
          ) : null}
          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                dialogRef.current?.close();
                setConfirmValue("");
                setErrorMessage("");
              }}
            >
              취소
            </Button>
            <Button disabled={!isMatch || isPending} onClick={handleDelete}>
              제출
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}
