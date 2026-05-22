import type { ReactNode } from "react";

type ChartCardHeaderProps = {
  imageDownloadButton?: ReactNode;
  description: string;
  legend?: ReactNode;
  title: string;
};

/**
 * @page  - [대시보드]
 * @title - 차트 카드 헤더 컴포넌트
 * @desc  - 제목, 이미지 다운로드 버튼, 설명, 범례 제공
 */
export function ChartCardHeader({
  title,
  imageDownloadButton,
  description,
  legend,
}: ChartCardHeaderProps) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        {/* 제목 */}
        <p className="text-sm font-semibold tracking-[0.16em] text-primary uppercase">{title}</p>

        {/* 이미지 다운로드 버튼 */}
        {imageDownloadButton ? <div className="shrink-0">{imageDownloadButton}</div> : null}
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-4">
        {/* 설명 */}
        <p className="min-w-0 text-sm leading-5 text-text-muted">{description}</p>

        {/* 범례 */}
        {legend ? <div className="shrink-0">{legend}</div> : null}
      </div>
    </div>
  );
}
