import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignInPage } from "@/features/auth/sign-in/ui/sign-in-page";
import { hasAuthenticatedSession } from "@/shared/api/server-auth";
import { routes } from "@/shared/config/routes";

export const metadata: Metadata = {
  title: "로그인",
};

export default async function SignInRoutePage() {
  if (await hasAuthenticatedSession()) {
    redirect(routes.dashboard);
  }

  return <SignInPage />;
}
