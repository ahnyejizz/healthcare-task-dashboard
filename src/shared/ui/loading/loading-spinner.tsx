import { cn } from "@/shared/lib/cn";

type LoadingSpinnerProps = {
  className?: string;
  label?: string;
};

/**
 * @page  - [공통 UI]
 * @title - 로딩 스피너 컴포넌트
 * @desc  - 로딩 상태를 표시하는 공통 스피너 렌더링
 */
export function LoadingSpinner({
  className,
  label = "로딩 중",
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn("inline-flex items-center justify-center", className)}
    >
      <span className="inline-block h-7 w-7 animate-spin rounded-full border-[3px] border-primary/25 border-t-primary" />
    </div>
  );
}
