export async function downloadSvg(svgXml: string, fileName: string) {
  const blob = new Blob([svgXml], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.svg`;
  link.style.display = "block";
  link.click();

  URL.revokeObjectURL(url);
}

export async function downloadPng(svgXml: string, fileName: string) {
  const pngImage = await svgToPng(svgXml);

  const link = document.createElement("a");
  link.href = pngImage;
  link.download = `${fileName}.png`;
  link.style.display = "block";
  link.click();
}

export async function svgToPng(svgXml: string): Promise<string> {
  const [canvas] = await svgToCanvas(svgXml);
  return canvas.toDataURL("image/png");
}

export async function svgToCanvas(
  svgXml: string,
  size = 1000
): Promise<[HTMLCanvasElement, CanvasRenderingContext2D]> {
  const svgDataUrl = svgToDataUrl(svgXml);
  const svgImage = await createImage(svgDataUrl);

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d")!;
  context.fillStyle = "#fff";
  context.fillRect(0, 0, size, size);
  context.drawImage(svgImage, 0, 0, size, size);

  return [canvas, context];
}

export function svgToDataUrl(svgXml: string) {
  return `data:image/svg+xml;base64,${btoa(svgXml)}`;
}

function createImage(src: string): Promise<HTMLImageElement> {
  return new Promise((accept, reject) => {
    const image = new Image();
    image.onerror = reject;
    image.onload = () => accept(image);
    image.src = src;
  });
}
