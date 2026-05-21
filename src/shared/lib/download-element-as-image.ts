import html2canvas from "html2canvas";

type DownloadElementAsImageOptions = {
  backgroundColor?: string;
  element: HTMLElement;
  fileName: string;
};

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
