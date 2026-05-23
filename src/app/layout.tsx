import type { Metadata } from "next";
import { Providers } from "@/app/providers";
import { appMeta } from "@/shared/config/page-meta";
import "./globals.css";

export const metadata: Metadata = {
  title: appMeta.title,
  description: appMeta.description,
};

/**
 * @page  - [공통]
 * @title - 루트 레이아웃
 * @desc  - HTML 기본 구조 설정 및 전역 Provider 주입
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
