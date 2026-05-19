"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "@/shared/api/auth";
import {
  finishAuthRedirect,
  getIsAuthenticated,
  markSignedIn,
} from "@/shared/api/auth-storage";
import { pageMeta } from "@/shared/config/page-meta";
import { routes } from "@/shared/config/routes";
import { ApiError } from "@/shared/api/http";
import { Button, ButtonLink } from "@/shared/ui/button";
import { HomeIcon } from "@/shared/ui/icons";
import { Input } from "@/shared/ui/input";
import { LoadingOverlay } from "@/shared/ui/loading-overlay";
import {
  signInSchema,
  type SignInFormValues,
} from "@/features/auth/sign-in/model/sign-in-schema";

export function SignInPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
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
    finishAuthRedirect();

    if (getIsAuthenticated()) {
      router.replace(routes.dashboard);
    }
  }, [router]);

  async function onSubmit(values: SignInFormValues) {
    try {
      const tokens = await signIn(values);
      setIsSigningIn(true);
      markSignedIn(tokens);
      router.replace(routes.dashboard);
      router.refresh();
    } catch (error) {
      setIsSigningIn(false);
      const nextErrorMessage =
        error instanceof ApiError
          ? error.message
          : "로그인 처리 중 오류가 발생했습니다.";
      setErrorMessage(nextErrorMessage);
    }
  }

  const isLoginPending = isSubmitting || isSigningIn;

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
            {pageMeta.signIn.title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-text-muted">
            {pageMeta.signIn.description}
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
              className={[
                "w-full",
                isLoginPending
                  ? "disabled:border-primary disabled:bg-primary disabled:text-white disabled:shadow-[0_12px_28px_rgba(252,175,24,0.18)]"
                  : "",
              ].join(" ")}
              disabled={!isValid || isLoginPending}
            >
              제출
            </Button>
          </form>
        </section>
      </main>

      {isLoginPending ? (
        <LoadingOverlay message="로그인 중입니다." />
      ) : null}

      {errorMessage ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172033]/35 px-4 backdrop-blur-[3px]">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="sign-in-error-title"
            aria-describedby="sign-in-error-description"
            className="w-full max-w-md rounded-[28px] border border-border bg-white p-6 shadow-2xl"
          >
            <h2
              id="sign-in-error-title"
              className="text-xl font-semibold text-text"
            >
              로그인 실패
            </h2>
            <p
              id="sign-in-error-description"
              className="mt-3 min-h-[3rem] text-sm leading-6 text-text-muted"
            >
              {errorMessage}
            </p>
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => {
                  setErrorMessage(null);
                }}
              >
                확인
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
