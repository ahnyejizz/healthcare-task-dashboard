import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function BaseIcon(props: IconProps) {
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

export function DashboardIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 13h6v7H4z" />
      <path d="M14 4h6v16h-6z" />
      <path d="M4 4h6v5H4z" />
      <path d="M14 14h6v6h-6z" />
    </BaseIcon>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V21h13V9.5" />
      <path d="M10 21v-6h4v6" />
    </BaseIcon>
  );
}

export function TasksIcon(props: IconProps) {
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

export function UserIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </BaseIcon>
  );
}

export function LoginIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M15 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" />
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H4" />
    </BaseIcon>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </BaseIcon>
  );
}
