import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

type ButtonLinkProps = ComponentProps<typeof Link> & {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
};

function resolveVariant(variant: ButtonVariant) {
  switch (variant) {
    case "secondary":
      return "border border-border bg-surface text-text hover:border-primary/30 hover:text-text";
    case "ghost":
      return "border border-transparent bg-transparent text-text-muted hover:text-text";
    case "danger":
      return "border border-danger/15 bg-danger text-white hover:bg-[#b53333]";
    case "primary":
    default:
      return "border border-primary bg-primary text-white shadow-[0_12px_28px_rgba(252,175,24,0.18)] hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(252,175,24,0.24)] active:translate-y-0 active:shadow-[0_10px_20px_rgba(252,175,24,0.18)]";
  }
}

function resolveClassName(variant: ButtonVariant, className?: string) {
  return [
    "focus-ring inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out disabled:cursor-not-allowed disabled:pointer-events-none disabled:border-disabled disabled:bg-disabled disabled:text-white/80 disabled:shadow-none",
    resolveVariant(variant),
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={resolveClassName(variant, className)}
      {...props}
    />
  );
}

export function ButtonLink({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={resolveClassName(variant, className)} {...props}>
      {children}
    </Link>
  );
}
