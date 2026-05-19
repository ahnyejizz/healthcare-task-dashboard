"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  getIsAuthRedirecting,
  getIsAuthenticated,
  subscribeToAuthRedirectChange,
  subscribeToAuthStateChange,
} from "@/shared/api/auth-storage";
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
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172033]/18 px-4 backdrop-blur-[3px]">
        <div
          role="status"
          aria-live="polite"
          className="surface-card w-full max-w-md rounded-[28px] border border-border/80 px-6 py-5"
        >
          <div className="flex items-center justify-between gap-4">
            <strong className="text-base font-semibold text-text">
              로그아웃 중입니다.
            </strong>
            <span className="text-xs font-medium tracking-[0.16em] text-text-muted uppercase">
              loading...
            </span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-muted">
            <div className="relative h-full">
              <span className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-primary animate-[loading-overlay-bar_1.15s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return hasAccessToken ? children : <AuthRequiredPanel />;
}
