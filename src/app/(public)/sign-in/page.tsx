import type { Metadata } from "next";
import { SignInPage } from "@/features/auth/sign-in/ui/sign-in-page";

export const metadata: Metadata = {
  title: "로그인",
};

export default function SignInRoutePage() {
  return <SignInPage />;
}
