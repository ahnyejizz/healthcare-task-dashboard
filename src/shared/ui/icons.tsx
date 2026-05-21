import type { ComponentProps, SVGProps } from "react";

type IconSvgProps = SVGProps<SVGSVGElement>;
type IconSpanProps = ComponentProps<"span">;

function BaseIcon(props: IconSvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      aria-hidden="true"
      {...props}
    />
  );
}

export function DashboardIcon(props: IconSvgProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 13h6v7H4z" />
      <path d="M14 4h6v16h-6z" />
      <path d="M4 4h6v5H4z" />
      <path d="M14 14h6v6h-6z" />
    </BaseIcon>
  );
}

export function HomeIcon(props: IconSvgProps) {
  return (
    <BaseIcon {...props}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V21h13V9.5" />
      <path d="M10 21v-6h4v6" />
    </BaseIcon>
  );
}

export function TasksIcon(props: IconSvgProps) {
  return (
    <BaseIcon {...props}>
      <path d="m8 7 2 2 4-4" />
      <path d="M5 7h.01" />
      <path d="M5 12h.01" />
      <path d="M5 17h.01" />
      <path d="M9 12h10" />
      <path d="M9 17h10" />
    </BaseIcon>
  );
}

export function UserIcon(props: IconSvgProps) {
  return (
    <BaseIcon {...props}>
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </BaseIcon>
  );
}

export function LoginIcon(props: IconSvgProps) {
  return (
    <BaseIcon {...props}>
      <path d="M15 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" />
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H4" />
    </BaseIcon>
  );
}

export function LogoutIcon(props: IconSvgProps) {
  return (
    <BaseIcon {...props}>
      <path d="M9 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3" />
      <path d="M14 17l5-5-5-5" />
      <path d="M19 12H9" />
    </BaseIcon>
  );
}

export function ArrowLeftIcon(props: IconSvgProps) {
  return (
    <BaseIcon {...props}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </BaseIcon>
  );
}

export function CheckIcon(props: IconSvgProps) {
  return (
    <BaseIcon {...props}>
      <path d="m5 12 4.5 4.5L19 7" />
    </BaseIcon>
  );
}

export function TrashIcon(props: IconSvgProps) {
  return (
    <BaseIcon {...props}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </BaseIcon>
  );
}

export function DownloadIcon({ className, ...props }: IconSpanProps) {
  return (
    <span
      className={[
        "relative block h-[18px] w-[18px] shrink-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <span className="absolute left-1/2 top-[1px] h-[10px] w-[2px] -translate-x-1/2 rounded-full bg-current" />
      <span className="absolute left-1/2 top-[8px] h-[7px] w-[7px] -translate-x-1/2 rotate-45 border-r-[2px] border-b-[2px] border-current" />
      <span className="absolute bottom-[1px] left-1/2 h-[2px] w-[12px] -translate-x-1/2 rounded-full bg-current" />
    </span>
  );
}

export function HealthcareLogoIcon(props: IconSvgProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 21s-6.8-4.1-8.7-8.3C1.8 9.4 3.5 5.8 7 5.2c2-.3 3.6.5 5 2.2 1.4-1.7 3-2.5 5-2.2 3.5.6 5.2 4.2 3.7 7.5C18.8 16.9 12 21 12 21Z" />
      <path d="M8 12h2.1l1.2-2.1 1.5 4.2 1.2-2.1H16" />
    </BaseIcon>
  );
}

export function FilterIcon({ className, ...props }: IconSpanProps) {
  return (
    <span
      className={[
        "relative block h-[18px] w-[18px] shrink-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <span className="absolute left-1/2 top-[2px] h-[2px] w-[14px] -translate-x-1/2 rounded-full bg-current" />
      <span className="absolute left-1/2 top-[5px] h-0 w-0 -translate-x-1/2 border-t-[7px] border-r-[5px] border-l-[5px] border-t-current border-r-transparent border-l-transparent" />
      <span className="absolute left-1/2 top-[12px] h-[5px] w-[3px] -translate-x-1/2 rounded-b-[2px] bg-current" />
    </span>
  );
}

export function SortIcon({ className, ...props }: IconSpanProps) {
  return (
    <span
      className={[
        "relative block h-[18px] w-[18px] shrink-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <span className="absolute left-[2px] top-[3px] h-[2px] w-[11px] rounded-full bg-current/85" />
      <span className="absolute left-[2px] top-[8px] h-[2px] w-[8px] rounded-full bg-current/85" />
      <span className="absolute left-[2px] top-[13px] h-[2px] w-[5px] rounded-full bg-current/85" />
      <span className="absolute right-[3px] top-[3px] h-[12px] w-[2px] rounded-full bg-current/85" />
      <span className="absolute right-[1px] top-[11px] h-[5px] w-[5px] rotate-45 border-r-[2px] border-b-[2px] border-current/85" />
    </span>
  );
}

export function CardViewIcon({ className, ...props }: IconSpanProps) {
  return (
    <span
      className={["grid h-4 w-4 shrink-0 grid-cols-2 grid-rows-2 gap-[2px] leading-none", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <span className="block h-full w-full rounded-[1px] border-[1.6px] border-current" />
      <span className="block h-full w-full rounded-[1px] border-[1.6px] border-current" />
      <span className="block h-full w-full rounded-[1px] border-[1.6px] border-current" />
      <span className="block h-full w-full rounded-[1px] border-[1.6px] border-current" />
    </span>
  );
}

export function ListViewIcon({ className, ...props }: IconSpanProps) {
  return (
    <span
      className={["grid h-4 w-4 shrink-0 grid-rows-4 items-center gap-[2px] leading-none", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <span className="block h-px w-full rounded-full bg-current/75" />
      <span className="block h-px w-full rounded-full bg-current/75" />
      <span className="block h-px w-full rounded-full bg-current/75" />
      <span className="block h-px w-full rounded-full bg-current/75" />
    </span>
  );
}
