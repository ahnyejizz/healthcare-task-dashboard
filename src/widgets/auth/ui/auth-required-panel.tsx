"use client";

import { usePathname } from "next/navigation";
import { resolvePageMeta } from "@/shared/config/page-meta";
import { LoginIcon } from "@/shared/ui/icons";
import { Panel } from "@/shared/ui/panel";

export function AuthRequiredPanel() {
  const pathname = usePathname();
  const { title, description } = resolvePageMeta(pathname);

  return (
    <Panel title={title} description={description} className="h-full" contentClassName="h-full">
      <div className="grid content-start gap-5">
        <article className="relative w-full self-start overflow-hidden rounded-[28px] border border-border bg-white px-6 py-7 lg:px-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
          <div className="mt-5 flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-primary text-white shadow-[0_16px_32px_rgba(252,175,24,0.22)]">
              <LoginIcon className="size-7" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-text">
                이 화면은 로그인 후 이용할 수 있습니다.
              </h2>
              <p className="mt-3 text-sm leading-7 text-text-muted">
                로그인 후 대시보드, 할 일 목록, 회원정보 화면을 이용할 수 있습니다.
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[22px] border border-border/80 bg-surface p-4">
              <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                Dashboard
              </p>
              <p className="mt-2 text-sm leading-6 text-text">태스크 현황 확인</p>
            </div>
            <div className="rounded-[22px] border border-border/80 bg-surface p-4">
              <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                Tasks
              </p>
              <p className="mt-2 text-sm leading-6 text-text">할 일 목록과 할 일 상세 확인</p>
            </div>
            <div className="rounded-[22px] border border-border/80 bg-surface p-4">
              <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                Account
              </p>
              <p className="mt-2 text-sm leading-6 text-text">회원 정보 확인</p>
            </div>
          </div>
        </article>
      </div>
    </Panel>
  );
}
