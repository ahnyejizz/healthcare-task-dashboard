import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  errorMessage?: string;
  label: string;
};

export function Input({ className, errorMessage, id, label, ...props }: InputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-text">{label}</span>
      <input
        id={id}
        className={[
          "focus-ring w-full rounded-2xl border bg-white px-4 py-3 text-sm text-text placeholder:text-text-muted/70",
          errorMessage ? "border-danger" : "border-border",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-invalid={Boolean(errorMessage)}
        {...props}
      />
      {errorMessage ? <span className="mt-2 block text-sm text-danger">{errorMessage}</span> : null}
    </label>
  );
}
