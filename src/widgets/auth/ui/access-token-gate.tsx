"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  getIsAuthRedirecting,
  getIsAuthenticated,
  subscribeToAuthRedirectChange,
  subscribeToAuthStateChange,
} from "@/shared/api/auth-storage";
import { LoadingOverlay } from "@/shared/ui/loading-overlay";
import { AuthRequiredPanel } from "@/widgets/auth/ui/auth-required-panel";

type AccessTokenGateProps = {
  children: ReactNode;
};

export function AccessTokenGate({ children }: AccessTokenGateProps) {
  const [hasAccessToken, setHasAccessToken] = useState(() =>
    getIsAuthenticated(),
  );
  const [isAuthRedirecting, setIsAuthRedirecting] = useState(() =>
    getIsAuthRedirecting(),
  );

  useEffect(() => {
    const unsubscribeAuthState = subscribeToAuthStateChange((value) => {
      setHasAccessToken(value);
    });

    const unsubscribeAuthRedirect = subscribeToAuthRedirectChange((value) => {
      setIsAuthRedirecting(value);
    });

    return () => {
      unsubscribeAuthState();
      unsubscribeAuthRedirect();
    };
  }, []);

  if (isAuthRedirecting) {
    return <LoadingOverlay message="로그아웃 중입니다." />;
  }

  return hasAccessToken ? children : <AuthRequiredPanel />;
}
