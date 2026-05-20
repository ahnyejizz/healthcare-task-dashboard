"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import {
  getAuthStateServerSnapshot,
  getAuthStateSnapshot,
  subscribeAuthState,
} from "@/shared/api/auth-storage";
import { primaryNavigation, routes } from "@/shared/config/routes";
import {
  DashboardIcon,
  HealthcareLogoIcon,
  LoginIcon,
  TasksIcon,
  UserIcon,
} from "@/shared/ui/icons";

function resolveIcon(icon: (typeof primaryNavigation)[number]["icon"]) {
  return icon === "dashboard" ? DashboardIcon : TasksIcon;
}

export function Navigation() {
  const pathname = usePathname();
  const isAuthenticated = useSyncExternalStore(
    subscribeAuthState,
    getAuthStateSnapshot,
    getAuthStateServerSnapshot,
  );

  const accountHref = isAuthenticated ? routes.user : routes.signIn;
  const AccountIcon = isAuthenticated ? UserIcon : LoginIcon;
  const accountLabel = isAuthenticated ? "회원정보" : "로그인";
  const isAccountActive = pathname.startsWith(accountHref);

  return (
    <aside className="surface-card flex h-full flex-col rounded-[32px] p-6">
      <Link
        href={routes.dashboard}
        className="focus-ring rounded-[28px] border border-primary/35 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(255,243,210,0.92))] p-4 shadow-[0_16px_36px_rgba(252,175,24,0.14)]"
      >
        <div className="flex items-center gap-3">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.96),rgba(255,214,124,0.98))] shadow-[inset_0_1px_0_rgba(255,255,255,0.88),0_14px_24px_rgba(252,175,24,0.28)]">
            <span className="absolute inset-[7px] rounded-[16px] border border-white/70" />
            <span className="absolute inset-0 rounded-[20px] bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.4),transparent_58%)]" />
            <HealthcareLogoIcon className="relative z-10 size-7 text-primary-strong" />
          </div>

          <div className="min-w-0 overflow-hidden">
            <p className="whitespace-nowrap text-[10px] font-bold tracking-[0.22em] text-primary uppercase">
              Healthcare
            </p>
            <p className="whitespace-nowrap text-[10px] font-bold tracking-[0.22em] text-primary uppercase">
              Routine Insights
            </p>
            <strong className="mt-1 block whitespace-nowrap text-[1.1rem] leading-none font-semibold tracking-[-0.03em] text-text">
              Task Dashboard
            </strong>
          </div>
        </div>
      </Link>

      <nav className="mt-10 flex flex-1 flex-col gap-2" aria-label="주요 메뉴">
        {primaryNavigation.map((item) => {
          const Icon = resolveIcon(item.icon);
          const isActive =
            item.href === "/"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "focus-ring flex h-13 items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors",
                isActive
                  ? "border-primary/30 bg-surface-muted text-text"
                  : "border-border/80 text-text-muted",
              ].join(" ")}
            >
              <Icon className="size-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-[24px] bg-white px-0 pb-0 pt-4">
        <p className="px-4 text-xs font-semibold tracking-[0.16em] text-primary uppercase">
          Account
        </p>
        <Link
          href={accountHref}
          className={[
            "focus-ring mt-3 flex h-13 w-full items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors",
            isAccountActive
              ? "border-primary/30 bg-surface-muted text-text"
              : "border-border/80 bg-white text-text-muted",
          ].join(" ")}
        >
          <AccountIcon
            className={[
              "size-5",
              isAuthenticated ? "text-primary" : "",
            ].join(" ")}
          />
          {accountLabel}
        </Link>
      </div>
    </aside>
  );
}
