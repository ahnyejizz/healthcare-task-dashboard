import { ChartLegendItem } from "../../model/dashboard-model";

/**
 * @page  - [대시보드]
 * @title - 차트 범례 컴포넌트
 * @desc  - 차트 항목의 색상 및 라벨 정보를 범례 UI로 렌더링
 */
export function ChartLegend({ items }: { items: ChartLegendItem[] }) {
  return (
    <div className="flex items-center gap-x-4 whitespace-nowrap">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-x-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-xs font-semibold text-text-muted">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
