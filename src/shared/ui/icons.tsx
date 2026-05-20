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

export function LogoutIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M9 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3" />
      <path d="M14 17l5-5-5-5" />
      <path d="M19 12H9" />
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

export function CheckIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m5 12 4.5 4.5L19 7" />
    </BaseIcon>
  );
}

export function TrashIcon(props: IconProps) {
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

export function HealthcareLogoIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 21s-6.8-4.1-8.7-8.3C1.8 9.4 3.5 5.8 7 5.2c2-.3 3.6.5 5 2.2 1.4-1.7 3-2.5 5-2.2 3.5.6 5.2 4.2 3.7 7.5C18.8 16.9 12 21 12 21Z" />
      <path d="M8 12h2.1l1.2-2.1 1.5 4.2 1.2-2.1H16" />
    </BaseIcon>
  );
}
