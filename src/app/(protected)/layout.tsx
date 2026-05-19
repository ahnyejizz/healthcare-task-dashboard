import { AccessTokenGate } from "@/widgets/auth/ui/access-token-gate";
import { AppShell } from "@/widgets/navigation/ui/app-shell";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  return <AppShell><AccessTokenGate>{children}</AccessTokenGate></AppShell>;
}
