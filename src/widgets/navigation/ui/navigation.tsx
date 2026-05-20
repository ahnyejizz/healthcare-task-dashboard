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
      <Link href={routes.dashboard} className="focus-ring rounded-2xl p-2">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          healthcare-task-dashboard
        </p>
        <strong className="mt-2 block text-xl font-semibold tracking-tight text-text">
          Task Dashboard
        </strong>
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
