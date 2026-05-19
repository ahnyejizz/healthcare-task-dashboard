"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  getAccessToken,
  subscribeToAccessTokenChange,
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
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(getAccessToken()),
  );

  useEffect(() => {
    return subscribeToAccessTokenChange((token) => {
      setIsAuthenticated(Boolean(token));
    });
  }, []);

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
                "focus-ring flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors",
                isActive
                  ? "bg-surface-muted text-text"
                  : "text-text-muted hover:bg-surface-muted hover:text-text",
              ].join(" ")}
            >
              <Icon className="size-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-[24px] bg-white p-4">
        <p className="text-xs font-semibold tracking-[0.16em] text-text-muted uppercase">
          Account
        </p>
        <Link
          href={accountHref}
          className={[
            "focus-ring mt-3 flex items-center gap-3 rounded-2xl border border-border/80 px-4 py-3 text-sm font-semibold text-text transition-colors",
            isAccountActive ? "bg-surface-muted" : "bg-white",
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
