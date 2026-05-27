type MetricCardProps = {
  caption: string;
  tone: "primary" | "success" | "warning";
  value: number;
};

/**
 * @page  - [대시보드]
 * @title - 상단 요약 지표 컴포넌트
 * @desc  - 지표 제목과 수치 표시
 */
export function MetricCard({ caption, tone, value }: MetricCardProps) {
  const toneClass =
    tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-primary";

  return (
    <article className="rounded-[22px] border border-border bg-white px-5 py-3.5 lg:px-5 lg:py-3">
      <p className="text-sm font-medium text-text-muted">{caption}</p>
      <strong className={`mt-1.5 block text-[2.2rem] leading-none font-semibold ${toneClass}`}>
        {value}
      </strong>
    </article>
  );
}
