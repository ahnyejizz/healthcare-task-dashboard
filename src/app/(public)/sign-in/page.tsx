import type { Metadata } from "next";
import { pageMeta } from "@/shared/config/page-meta";
import { SignInPage } from "@/features/auth/sign-in/ui/sign-in-page";

export const metadata: Metadata = {
  title: pageMeta.signIn.title,
};

export default function SignInRoutePage() {
  return <SignInPage />;
}
