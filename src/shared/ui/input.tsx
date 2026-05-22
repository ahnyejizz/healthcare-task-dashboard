import type { InputHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  errorMessage?: string;
  label: string;
};

/**
 * @page  - [공통 UI]
 * @title - 입력 필드 컴포넌트
 * @desc  - 라벨, 에러 메시지를 포함한 공통 입력 필드 렌더링
 */
export function Input({ className, errorMessage, id, label, ...props }: InputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-text">{label}</span>
      <input
        id={id}
        className={cn(
          "focus-ring w-full rounded-2xl border bg-white px-4 py-3 text-sm text-text placeholder:text-text-muted/70",
          errorMessage ? "border-danger" : "border-border",
          className,
        )}
        aria-invalid={Boolean(errorMessage)}
        {...props}
      />
      {errorMessage ? <span className="mt-2 block text-sm text-danger">{errorMessage}</span> : null}
    </label>
  );
}
