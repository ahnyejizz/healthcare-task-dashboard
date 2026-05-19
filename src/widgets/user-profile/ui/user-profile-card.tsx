"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  finishAuthRedirect,
  markSignedOut,
  startAuthRedirect,
} from "@/shared/api/auth-storage";
import { signOut } from "@/shared/api/auth";
import type { UserResponse } from "@/shared/api/contracts";
import { routes } from "@/shared/config/routes";
import { pageMeta } from "@/shared/config/page-meta";
import { ApiError } from "@/shared/api/http";
import { Button } from "@/shared/ui/button";
import { LoadingOverlay } from "@/shared/ui/loading-overlay";
import { Panel } from "@/shared/ui/panel";

type UserProfileCardProps = {
  user: UserResponse;
};

export function UserProfileCard({ user }: UserProfileCardProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setErrorMessage("");
    setIsSigningOut(true);
    startAuthRedirect();

    try {
      await signOut();
      markSignedOut();
      router.replace(routes.signIn);
      router.refresh();
    } catch (error) {
      finishAuthRedirect();
      setIsSigningOut(false);
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : "로그아웃 처리 중 오류가 발생했습니다.",
      );
    }
  }

  return (
    <>
      <Panel
        title={pageMeta.user.title}
        description={pageMeta.user.description}
        action={
          <Button
            variant="secondary"
            onClick={() => {
              void handleSignOut();
            }}
            disabled={isSigningOut}
          >
            로그아웃
          </Button>
        }
      >
        {errorMessage ? (
          <p className="mb-4 text-sm text-danger">{errorMessage}</p>
        ) : null}
        <div className="grid gap-4">
          <article className="rounded-[24px] border border-border bg-white p-5">
            <p className="text-sm font-medium text-text-muted">이름</p>
            <strong className="mt-3 block text-2xl font-semibold text-text">
              {user.name}
            </strong>
          </article>
          <article className="rounded-[24px] border border-border bg-white p-5">
            <p className="text-sm font-medium text-text-muted">메모</p>
            <strong className="mt-3 block text-xl font-semibold leading-8 text-text">
              {user.memo}
            </strong>
          </article>
        </div>
      </Panel>

      {isSigningOut ? (
        <LoadingOverlay message="로그아웃 중입니다." />
      ) : null}
    </>
  );
}
