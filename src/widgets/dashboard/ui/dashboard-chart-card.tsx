type DashboardChartCardProps = {
  description: string;
  title: string;
};

export function DashboardChartCard({
  description,
  title,
}: DashboardChartCardProps) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.16em] text-text-muted uppercase">
        {title}
      </p>
      <p className="mt-1.5 text-sm leading-5 text-text-muted">{description}</p>
    </div>
  );
}
