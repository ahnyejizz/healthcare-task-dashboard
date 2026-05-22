/**
 * @page  - [공통 UI]
 * @title - 로딩 오버레이 컴포넌트
 * @desc  - 화면 전체를 덮는 공통 로딩 오버레이 렌더링
 */
export function LoadingOverlay({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172033]/18 px-4 backdrop-blur-[3px]">
      <div
        role="status"
        aria-live="polite"
        className="surface-card w-full max-w-md rounded-[28px] border border-border/80 px-6 py-5"
      >
        <div className="flex items-center justify-between gap-4">
          <strong className="text-base font-semibold text-text">{message}</strong>
          <span className="text-xs font-medium tracking-[0.16em] text-text-muted uppercase">
            loading...
          </span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-muted">
          <div className="relative h-full">
            <span className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-primary animate-[loading-overlay-bar_1.15s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    </div>
  );
}
