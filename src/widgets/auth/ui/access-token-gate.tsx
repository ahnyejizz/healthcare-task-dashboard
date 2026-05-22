"use client";

import type { ReactNode } from "react";
import { useSyncExternalStore } from "react";
import {
  getAuthRedirectServerSnapshot,
  getAuthRedirectSnapshot,
  getAuthStateServerSnapshot,
  getAuthStateSnapshot,
  subscribeAuthRedirectState,
  subscribeAuthState,
} from "@/shared/api/auth-storage";
import { LoadingOverlay } from "@/shared/ui/loading/loading-overlay";
import { AuthRequiredPanel } from "@/widgets/auth/ui/auth-required-panel";

/**
 * @page  - [공통]
 * @title - 인증 게이트 컴포넌트
 * @desc  - 인증 상태에 따라 하위 화면 또는 인증 안내 패널 렌더링
 */
export function AccessTokenGate({ children }: { children: ReactNode }) {
  const hasAccessToken = useSyncExternalStore(
    subscribeAuthState,
    getAuthStateSnapshot,
    getAuthStateServerSnapshot,
  );
  const isAuthRedirecting = useSyncExternalStore(
    subscribeAuthRedirectState,
    getAuthRedirectSnapshot,
    getAuthRedirectServerSnapshot,
  );

  if (isAuthRedirecting) {
    return <LoadingOverlay message="로그아웃 중입니다." />;
  }

  return hasAccessToken ? children : <AuthRequiredPanel />;
}
