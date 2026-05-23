"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

function shouldEnableMocking() {
  return process.env.NEXT_PUBLIC_ENABLE_MSW === "true";
}

/**
 * @page  - [공통]
 * @title - 전역 Provider 컴포넌트
 * @desc  - TanStack Query 클라이언트 초기화 및 MSW Worker 조건부 활성화
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  const [isMockReady, setIsMockReady] = useState(!shouldEnableMocking());

  useEffect(() => {
    if (!shouldEnableMocking()) {
      return;
    }

    void import("@/shared/mocks/browser")
      .then(async ({ worker }) => {
        await worker.start({
          onUnhandledRequest: "bypass",
        });
      })
      .catch((error: unknown) => {
        console.error("MSW worker failed to start. Falling back to route handlers.", error);
      })
      .finally(() => {
        setIsMockReady(true);
      });
  }, []);

  if (!isMockReady) {
    return null;
  }

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
