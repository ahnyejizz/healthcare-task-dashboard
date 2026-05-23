import { AccessTokenGate } from "@/widgets/auth/ui/access-token-gate";
import { AppShell } from "@/widgets/navigation/ui/app-shell";

/**
 * @page  - [공통]
 * @title - 인증 영역 레이아웃
 * @desc  - AppShell과 AccessTokenGate로 인증이 필요한 페이지를 감싸는 레이아웃
 */
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <AccessTokenGate>{children}</AccessTokenGate>
    </AppShell>
  );
}
