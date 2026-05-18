import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인",
};

export { SignInPage as default } from "@/features/auth/sign-in/ui/sign-in-page";
