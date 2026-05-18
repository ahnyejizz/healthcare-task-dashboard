"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clearAccessToken } from "@/shared/api/auth-storage";
import { signOut } from "@/shared/api/auth";
import type { UserResponse } from "@/shared/api/contracts";
import { routes } from "@/shared/config/routes";
import { ApiError } from "@/shared/api/http";
import { Button } from "@/shared/ui/button";
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

    try {
      await signOut();
      clearAccessToken();
      router.replace(routes.signIn);
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : "로그아웃 처리 중 오류가 발생했습니다.",
      );
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <Panel
      title="회원정보"
      description="회원 이메일을 확인할 수 있는 화면입니다."
      action={
        <Button
          variant="secondary"
          onClick={() => {
            void handleSignOut();
          }}
          disabled={isSigningOut}
        >
          {isSigningOut ? "로그아웃 중..." : "로그아웃"}
        </Button>
      }
    >
      {errorMessage ? (
        <p className="mb-4 text-sm text-danger">{errorMessage}</p>
      ) : null}
      <div className="grid gap-4">
        <article className="rounded-[24px] border border-border bg-white p-5">
          <p className="text-sm font-medium text-text-muted">이메일</p>
          <strong className="mt-3 block text-2xl font-semibold text-text">
            {user.email}
          </strong>
        </article>
      </div>
    </Panel>
  );
}
