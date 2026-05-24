import type { ECharts } from "echarts";

// widgets
import type { ChartCardMeta } from "@/widgets/dashboard/ui/chart/chart-options";

const EXPORT_BACKGROUND = "#ffffff";
const EXPORT_BORDER = "rgba(252, 175, 24, 0.24)";
const EXPORT_PADDING_X = 32;
const EXPORT_PADDING_Y = 28;
const EXPORT_TITLE_FONT = '600 14px "Pretendard", "Apple SD Gothic Neo", sans-serif';
const EXPORT_LEGEND_FONT = '600 12px "Pretendard", "Apple SD Gothic Neo", sans-serif';
const EXPORT_TEXT_COLOR = "#61708c";
const EXPORT_TITLE_COLOR = "#fcaf18";
const EXPORT_LEGEND_GAP = 16;
const EXPORT_LEGEND_MARKER_SIZE = 10;

type ExportLegendItem = {
  color: string;
  label: string;
};

type DownloadChartAsImageOptions = {
  card: ChartCardMeta;
  chart: ECharts;
  chartNode: HTMLDivElement;
  legendItems: ExportLegendItem[];
};

/**
 * @page  - [공통 유틸]
 * @title - 둥근 사각형 경로 생성 함수
 * @desc  - 차트 다운로드 배경 카드에 사용할 rounded rectangle path 생성
 */
function drawRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

/**
 * @page  - [공통 유틸]
 * @title - 텍스트 한 줄 맞춤 함수
 * @desc  - 최대 너비 안에 설명 문장이 한 줄로 들어오도록 폰트 크기 조정
 */
function fitTextToSingleLine(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  startFontSize: number,
  minFontSize: number,
) {
  let fontSize = startFontSize;

  while (fontSize > minFontSize) {
    context.font = `500 ${fontSize}px "Pretendard", "Apple SD Gothic Neo", sans-serif`;

    if (context.measureText(text).width <= maxWidth) {
      return fontSize;
    }

    fontSize -= 1;
  }

  context.font = `500 ${minFontSize}px "Pretendard", "Apple SD Gothic Neo", sans-serif`;
  return minFontSize;
}

/**
 * @page  - [공통 유틸]
 * @title - 캔버스 다운로드 트리거 함수
 * @desc  - 생성된 canvas 이미지를 PNG 파일로 다운로드 실행
 */
function triggerCanvasDownload(canvas: HTMLCanvasElement, fileName: string) {
  const link = document.createElement("a");

  link.href = canvas.toDataURL("image/png");
  link.download = fileName;
  link.click();
}

/**
 * @page  - [공통 유틸]
 * @title - 차트 이미지 다운로드 함수
 * @desc  - 차트 카드 메타 정보와 ECharts 인스턴스를 조합해 PNG 이미지 저장
 */
export async function downloadChartAsImage({
  card,
  chart,
  chartNode,
  legendItems,
}: DownloadChartAsImageOptions) {
  if ("fonts" in document) {
    await document.fonts.ready;
  }

  const fileName = card.title.replace(/\s*\/\s*/g, "／").replace(/\//g, "／");
  const { width, height } = chartNode.getBoundingClientRect();
  const exportWidth = Math.max(Math.round(width), 520);
  const exportHeight = Math.max(Math.round(height + 92), 330);
  const pixelRatio = window.devicePixelRatio > 1 ? 2 : 1.5;
  const canvas = document.createElement("canvas");

  canvas.width = Math.round(exportWidth * pixelRatio);
  canvas.height = Math.round(exportHeight * pixelRatio);
  canvas.style.width = `${exportWidth}px`;
  canvas.style.height = `${exportHeight}px`;

  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  context.scale(pixelRatio, pixelRatio);
  context.fillStyle = EXPORT_BACKGROUND;
  context.strokeStyle = EXPORT_BORDER;
  context.lineWidth = 1;
  drawRoundedRect(context, 0.5, 0.5, exportWidth - 1, exportHeight - 1, 24);
  context.fill();
  context.stroke();

  context.textBaseline = "top";
  context.fillStyle = EXPORT_TITLE_COLOR;
  context.font = EXPORT_TITLE_FONT;
  context.fillText(card.title, EXPORT_PADDING_X, EXPORT_PADDING_Y);

  context.font = EXPORT_LEGEND_FONT;
  const legendWidths = legendItems.map(
    (item) =>
      EXPORT_LEGEND_MARKER_SIZE + 8 + context.measureText(item.label).width + EXPORT_LEGEND_GAP,
  );
  const legendTotalWidth =
    legendWidths.length > 0
      ? legendWidths.reduce((sum, itemWidth) => sum + itemWidth, 0) - EXPORT_LEGEND_GAP
      : 0;

  const descriptionStartY = EXPORT_PADDING_Y + 34;
  const descriptionFontSize = fitTextToSingleLine(
    context,
    card.description,
    exportWidth - EXPORT_PADDING_X * 2,
    14,
    11,
  );

  context.font = `500 ${descriptionFontSize}px "Pretendard", "Apple SD Gothic Neo", sans-serif`;
  context.fillStyle = EXPORT_TEXT_COLOR;
  context.fillText(card.description, EXPORT_PADDING_X, descriptionStartY);

  if (legendItems.length > 0) {
    context.font = EXPORT_LEGEND_FONT;
    let legendX = exportWidth - EXPORT_PADDING_X - legendTotalWidth;
    const descriptionCenterY = descriptionStartY + descriptionFontSize / 2;
    const legendY = descriptionCenterY - EXPORT_LEGEND_MARKER_SIZE / 2 - 1;

    legendItems.forEach((item, itemIndex) => {
      context.beginPath();
      context.fillStyle = item.color;
      context.arc(
        legendX + EXPORT_LEGEND_MARKER_SIZE / 2,
        legendY + EXPORT_LEGEND_MARKER_SIZE / 2,
        EXPORT_LEGEND_MARKER_SIZE / 2,
        0,
        Math.PI * 2,
      );
      context.fill();

      context.fillStyle = EXPORT_TEXT_COLOR;
      context.fillText(
        item.label,
        legendX + EXPORT_LEGEND_MARKER_SIZE + 8,
        descriptionCenterY - 8,
      );
      legendX += legendWidths[itemIndex];
    });
  }

  const chartDataUrl = chart.getDataURL({
    backgroundColor: EXPORT_BACKGROUND,
    pixelRatio: 3,
  });
  const chartImage = new Image();

  await new Promise<void>((resolve, reject) => {
    chartImage.onload = () => resolve();
    chartImage.onerror = () => reject(new Error("차트 이미지 생성에 실패했습니다."));
    chartImage.src = chartDataUrl;
  });

  const chartAreaTop = descriptionStartY + 44;
  const chartAreaHeight = exportHeight - chartAreaTop - EXPORT_PADDING_Y;
  const chartScale = Math.min(exportWidth / chartImage.width, chartAreaHeight / chartImage.height);
  const chartWidth = chartImage.width * chartScale;
  const chartHeight = chartImage.height * chartScale;
  const chartX = (exportWidth - chartWidth) / 2;
  const chartY = chartAreaTop + (chartAreaHeight - chartHeight) / 2;

  context.drawImage(chartImage, chartX, chartY, chartWidth, chartHeight);
  triggerCanvasDownload(canvas, `${fileName}.png`);
}
