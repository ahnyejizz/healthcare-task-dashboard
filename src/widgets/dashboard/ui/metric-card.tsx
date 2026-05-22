type MetricCardProps = {
  caption: string;
  tone: "primary" | "success" | "warning";
  value: number;
};

export function MetricCard({ caption, tone, value }: MetricCardProps) {
  const toneClass =
    tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-primary";

  return (
    <article className="rounded-[22px] border border-border bg-white px-5 py-4">
      <p className="text-sm font-medium text-text-muted">{caption}</p>
      <strong className={`mt-2 block text-4xl font-semibold ${toneClass}`}>{value}</strong>
    </article>
  );
}
