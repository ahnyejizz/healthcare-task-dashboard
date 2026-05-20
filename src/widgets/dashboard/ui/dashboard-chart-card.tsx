import type { ReactNode } from "react";

type DashboardChartCardProps = {
  description: string;
  legend?: ReactNode;
  title: string;
};

export function DashboardChartCard({
  description,
  legend,
  title,
}: DashboardChartCardProps) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
        {title}
      </p>
      <div className="mt-1.5 flex items-center justify-between gap-4">
        <p className="min-w-0 text-sm leading-5 text-text-muted">{description}</p>
        {legend ? <div className="shrink-0">{legend}</div> : null}
      </div>
    </div>
  );
}
