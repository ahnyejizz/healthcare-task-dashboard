import { hasAuthenticatedSession } from "@/shared/api/server-auth";
import { AuthRequiredPanel } from "@/widgets/auth/ui/auth-required-panel";
import { AppShell } from "@/widgets/navigation/ui/app-shell";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const isAuthenticated = await hasAuthenticatedSession();

  return <AppShell>{isAuthenticated ? children : <AuthRequiredPanel />}</AppShell>;
}
