import { AccessTokenGate } from "@/widgets/auth/ui/access-token-gate";
import { AppShell } from "@/widgets/navigation/ui/app-shell";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <AccessTokenGate>{children}</AccessTokenGate>
    </AppShell>
  );
}
