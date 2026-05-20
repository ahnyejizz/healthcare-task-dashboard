type DashboardChartLegendItem = {
  color: string;
  label: string;
};

type DashboardChartLegendProps = {
  items: DashboardChartLegendItem[];
};

export function DashboardChartLegend({
  items,
}: DashboardChartLegendProps) {
  return (
    <div className="flex items-center gap-x-4 whitespace-nowrap">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-x-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-xs font-semibold text-text-muted">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
