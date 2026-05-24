"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// shared
import { finishAuthRedirect, markSignedOut, startAuthRedirect } from "@/shared/api/auth-storage";
import { signOut } from "@/shared/api/auth";
import type { UserResponse } from "@/shared/api/contracts";
import { routes } from "@/shared/config/routes";
import { pageMeta } from "@/shared/config/page-meta";
import { ApiError } from "@/shared/api/http";
import { ConfirmDialog } from "@/shared/ui/dialog/confirm-dialog";
import { LogoutIcon, UserIcon } from "@/shared/ui/icons";
import { LoadingOverlay } from "@/shared/ui/loading/loading-overlay";
import { Panel } from "@/shared/ui/panel";

type UserProfileCardProps = {
  email: string;
  user: UserResponse;
};

/**
 * @page  - [회원정보]
 * @title - 회원정보 카드 컴포넌트
 * @desc  - 프로필 정보 표시 + 로그아웃 액션 제공
 */
export function UserProfileCard({ email, user }: UserProfileCardProps) {
  /* ================================================================================== */
  /* state */
  /* ================================================================================== */

  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);

  const memoFallback =
    user.memo.trim() || "아직 등록된 메모가 없습니다. 간단한 소개를 추가해보세요.";

  /* ================================================================================== */
  /* function */
  /* ================================================================================== */

  // 로그아웃 처리
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
        error instanceof ApiError ? error.message : "로그아웃 처리 중 오류가 발생했습니다.",
      );
    }
  }

  /* ================================================================================== */
  /* render */
  /* ================================================================================== */

  return (
    <>
      {/* 회원정보 패널 */}
      <Panel
        title={pageMeta.user.title}
        description={pageMeta.user.description}
        className="flex h-full min-h-0 flex-col"
        contentClassName="flex-1"
        rightComponents={
          <ConfirmDialog
            title="로그아웃 하시겠습니까?"
            description="현재 세션이 종료되며 로그인 화면으로 이동합니다."
            isPending={isSigningOut}
            onConfirm={handleSignOut}
          >
            <span className="flex items-center justify-center" aria-hidden="true">
              <LogoutIcon className="size-5" />
            </span>
          </ConfirmDialog>
        }
      >
        {/* 로그아웃 실패 문구 */}
        {errorMessage ? <p className="mb-4 text-sm text-danger">{errorMessage}</p> : null}

        {/* 프로필 요약 카드 */}
        <div className="grid w-full flex-1 gap-4">
          <article className="surface-highlight relative overflow-hidden rounded-[28px] border border-border p-6 shadow-[0_24px_48px_rgba(252,175,24,0.14)]">
            <div className="absolute -top-12 right-[-10px] h-32 w-32 rounded-full bg-primary/12 blur-2xl" />
            <div className="absolute bottom-[-28px] left-[-20px] h-28 w-28 rounded-full bg-primary/10 blur-2xl" />
            <div className="relative flex h-full flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] bg-primary text-2xl font-semibold text-white shadow-[0_18px_30px_rgba(252,175,24,0.28)]">
                  <UserIcon className="size-8 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                    Profile Overview
                  </p>
                  <strong className="mt-2 block text-3xl font-semibold tracking-tight text-text">
                    {user.name}
                  </strong>
                </div>
              </div>

              <div className="rounded-[20px] border border-white/70 bg-white/80 p-4 backdrop-blur">
                <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                  Email
                </p>
                <p className="mt-3 text-base font-semibold leading-7 text-text">{email}</p>
              </div>

              <div className="rounded-[22px] border border-white/70 bg-white/78 p-5 backdrop-blur">
                <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                  Memo
                </p>
                <p className="mt-3 text-base font-semibold leading-7 text-text">{memoFallback}</p>
              </div>
            </div>
          </article>
        </div>
      </Panel>

      {/* 로그아웃 로딩 오버레이 */}
      {isSigningOut ? <LoadingOverlay message="로그아웃 중입니다." /> : null}
    </>
  );
}
