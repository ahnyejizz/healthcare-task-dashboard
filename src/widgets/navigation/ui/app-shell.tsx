import type { ReactNode } from "react";
import { Navigation } from "@/widgets/navigation/ui/navigation";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="mx-auto min-h-screen max-w-[1600px] px-4 py-6 lg:px-6 lg:py-6">
      <div className="grid gap-6 lg:h-[calc(100dvh-3rem)] lg:max-h-[calc(100dvh-3rem)] lg:grid-cols-[280px_1fr]">
        <Navigation />
        <main className="flex min-h-[calc(100vh-3rem)] min-w-0 flex-col gap-6 lg:h-full lg:max-h-[calc(100dvh-3rem)] lg:min-h-0 lg:overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
