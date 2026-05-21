import type { ReactNode } from "react";

type DashboardChartCardProps = {
  action?: ReactNode;
  description: string;
  legend?: ReactNode;
  title: string;
};

export function DashboardChartCard({
  action,
  description,
  legend,
  title,
}: DashboardChartCardProps) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold tracking-[0.16em] text-primary uppercase">
          {title}
        </p>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-4">
        <p className="min-w-0 text-sm leading-5 text-text-muted">{description}</p>
        {legend ? <div className="shrink-0">{legend}</div> : null}
      </div>
    </div>
  );
}
