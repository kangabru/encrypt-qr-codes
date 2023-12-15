import "client-only";
import { Blocks, getQrCodeBlocks, readQrCodeBitmap } from "./qrcode";

export async function readQrCodeFile(file: File) {
  const bitmap = await getBitmapFromFile(file);
  return readQrCodeBitmap(bitmap);
}

async function getBitmapFromFile(file: File): Promise<ImageData> {
  const bitmap = await createImageBitmap(file);

  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0);
  const data = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
  bitmap.close();
  return data;
}

export function generateQrCodeSvg(
  data: string,
  textLeft?: string,
  textRight?: string
): string {
  const blocks = getQrCodeBlocks(data);
  return renderBlocksToSvg(blocks, 500);
  // textLeft && svgEl.appendChild(createTextElement(textLeft, 30, 35));
  // textRight && svgEl.appendChild(createTextElement(textRight, 470, 35, true));
}

function renderBlocksToSvg(
  { size, blocks }: Blocks,
  outputSize: number
): string {
  const svgLines: string[] = [];

  svgLines.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${outputSize} ${outputSize}" fill="white">`
  );

  const s = outputSize / size;
  for (let [_x, _y] of blocks) {
    const x = _x * s;
    const y = _y * s;
    svgLines.push(
      `<rect x="${x}" y="${y}" height="${s}" width="${s}" fill="black" />`
    );
  }

  svgLines.push(`</svg>`);

  return svgLines.join("");
}
