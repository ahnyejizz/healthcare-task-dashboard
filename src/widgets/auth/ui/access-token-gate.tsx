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
import { LoadingOverlay } from "@/shared/ui/loading-overlay";
import { AuthRequiredPanel } from "@/widgets/auth/ui/auth-required-panel";

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
