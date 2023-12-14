export async function downloadSvg(html: string, fileName: string) {
  const blob = new Blob([html], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.svg`;
  link.style.display = "block";
  link.click();

  URL.revokeObjectURL(url);
}

export async function downloadPng(html: string, fileName: string) {
  const svgImage = `data:image/svg+xml;base64,${btoa(html)}`;
  const pngImage = await svgToPng(svgImage);

  const link = document.createElement("a");
  link.href = pngImage;
  link.download = `${fileName}.png`;
  link.style.display = "block";
  link.click();
}

async function svgToPng(svgSrc: string): Promise<string> {
  const svgImage = await createImage(svgSrc);
  const canvas = document.createElement("canvas");
  const size = 1000;
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d")!;
  context.fillStyle = "#fff";
  context.fillRect(0, 0, size, size);
  context.drawImage(svgImage, 0, 0, size, size);

  return canvas.toDataURL("image/png");
}

function createImage(src: string): Promise<HTMLImageElement> {
  return new Promise((accept, reject) => {
    const image = new Image();
    image.onerror = reject;
    image.onload = () => accept(image);
    image.src = src;
  });
}
