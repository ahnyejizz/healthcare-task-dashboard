type SpinnerProps = {
  className?: string;
  label?: string;
};

export function Spinner({ className, label = "로딩 중" }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={["inline-flex items-center justify-center", className].filter(Boolean).join(" ")}
    >
      <span className="inline-block h-7 w-7 animate-spin rounded-full border-[3px] border-primary/25 border-t-primary" />
    </div>
  );
}
