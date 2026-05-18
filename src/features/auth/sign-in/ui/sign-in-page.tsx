"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "@/shared/api/auth";
import { setAccessToken } from "@/shared/api/auth-storage";
import { routes } from "@/shared/config/routes";
import { ApiError } from "@/shared/api/http";
import { Button, ButtonLink } from "@/shared/ui/button";
import { HomeIcon } from "@/shared/ui/icons";
import { Input } from "@/shared/ui/input";
import {
  signInSchema,
  type SignInFormValues,
} from "@/features/auth/sign-in/model/sign-in-schema";

export function SignInPage() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!dialogRef.current) {
      return;
    }

    if (isErrorOpen) {
      dialogRef.current.showModal();
      return;
    }

    dialogRef.current.close();
  }, [isErrorOpen]);

  async function onSubmit(values: SignInFormValues) {
    try {
      const response = await signIn(values);
      setAccessToken(response.accessToken);
      router.push("/");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : "로그인 처리 중 오류가 발생했습니다.",
      );
      setIsErrorOpen(true);
    }
  }

  return (
    <>
      <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-12 lg:px-12">
        <section className="surface-card w-full max-w-xl rounded-[32px] border border-border/80 p-8">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold tracking-[0.16em] text-primary uppercase">
              Sign In
            </p>
            <ButtonLink
              href={routes.dashboard}
              variant="ghost"
              aria-label="홈으로 돌아가기"
              title="홈으로 돌아가기"
              className="h-12 w-12 rounded-[20px] bg-surface-muted px-0 py-0 text-text"
            >
              <HomeIcon className="size-7" />
            </ButtonLink>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-text">
            계정에 로그인
          </h1>
          <p className="mt-3 text-sm leading-6 text-text-muted">
            유효성 검증과 실패 모달 동작을 포함한 로그인 폼 시작점입니다.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              label="이메일"
              placeholder="test@naver.com"
              errorMessage={errors.email?.message}
              {...register("email")}
            />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              label="비밀번호"
              placeholder="영문과 숫자 조합, 8자 이상"
              errorMessage={errors.password?.message}
              {...register("password")}
            />
            <div className="rounded-2xl bg-surface-muted p-4 text-sm leading-6 text-text-muted">
              MSW 기본 계정:
              <br />
              이메일 `test@naver.com`
              <br />
              비밀번호 `frontend2026`
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? "로그인 중..." : "제출"}
            </Button>
          </form>
        </section>
      </main>

      <dialog
        ref={dialogRef}
        className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-[28px] border border-border bg-white p-0 shadow-2xl backdrop:bg-[#172033]/35"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-text">로그인 실패</h2>
          <p className="mt-3 text-sm leading-6 text-text-muted">
            {errorMessage}
          </p>
          <div className="mt-6 flex justify-end">
            <Button
              onClick={() => {
                setIsErrorOpen(false);
              }}
            >
              확인
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}
