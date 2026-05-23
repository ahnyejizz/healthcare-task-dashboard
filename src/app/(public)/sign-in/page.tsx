import type { Metadata } from "next";
import { pageMeta } from "@/shared/config/page-meta";
import { SignInPage } from "@/features/auth/sign-in/ui/sign-in-page";

export const metadata: Metadata = {
  title: pageMeta.signIn.title,
};

/**
 * @page  - [로그인]
 * @title - 로그인 라우트 페이지
 * @desc  - 로그인 라우트 진입점, SignInPage 컴포넌트 렌더링
 */
export default function SignInRoutePage() {
  return <SignInPage />;
}
