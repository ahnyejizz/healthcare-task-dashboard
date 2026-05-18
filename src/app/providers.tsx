"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type ProvidersProps = {
  children: React.ReactNode;
};

function shouldEnableMocking() {
  if (process.env.NODE_ENV !== "development") {
    return process.env.NEXT_PUBLIC_ENABLE_MSW === "true";
  }

  return process.env.NEXT_PUBLIC_ENABLE_MSW !== "false";
}

export function Providers({ children }: ProvidersProps) {
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

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
