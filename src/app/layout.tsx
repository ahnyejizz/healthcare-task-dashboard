import type { Metadata } from "next";
import { Providers } from "@/app/providers";
import { appMeta } from "@/shared/config/page-meta";
import "./globals.css";

export const metadata: Metadata = {
  title: appMeta.title,
  description: appMeta.description,
};

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
