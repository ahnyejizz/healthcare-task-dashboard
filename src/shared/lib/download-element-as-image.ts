import html2canvas from "html2canvas";

type DownloadElementAsImageOptions = {
  backgroundColor?: string;
  element: HTMLElement;
  fileName: string;
};

/**
 * @page  - [공통 유틸]
 * @title - 이미지 다운로드 함수
 * @desc  - 지정한 DOM 영역을 이미지 파일로 저장
 */
export async function downloadElementAsImage({
  backgroundColor = "#ffffff",
  element,
  fileName,
}: DownloadElementAsImageOptions) {
  const canvas = await html2canvas(element, {
    backgroundColor,
    scale: window.devicePixelRatio > 1 ? 2 : 1.5,
    useCORS: true,
  });
  const link = document.createElement("a");

  link.href = canvas.toDataURL("image/png");
  link.download = fileName;
  link.click();
}
