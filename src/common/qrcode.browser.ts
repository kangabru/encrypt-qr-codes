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
  return renderBlocksToSvg(blocks, textLeft, textRight);
}

function renderBlocksToSvg(
  { size, blocks }: Blocks,
  textLeft?: string,
  textRight?: string
): string {
  const pad = Math.ceil(size * 0.05);

  const totalSize = size + 2 * pad;
  const svgLines: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" fill="white">`,
    `<defs><rect id="r" height="1" width="1" fill="black" /></defs>`,
  ];

  const ty = totalSize - pad / 2;
  const tSize = (pad * 0.9).toFixed(1);
  const textAttrs = `font-size="${tSize}" font-family="sans-serif" fill="black" dominant-baseline="central"`;
  if (textLeft)
    svgLines.push(
      `<text x="${pad}" y="${ty}" text-anchor="start" ${textAttrs}>${textLeft}</text>`
    );

  if (textRight)
    svgLines.push(
      `<text x="${
        totalSize - pad
      }" y="${ty}" text-anchor="end" ${textAttrs}>${textRight}</text>`
    );

  for (let [x, y] of blocks)
    svgLines.push(`<use href="#r" x="${pad + x}" y="${pad + y}" />`);

  svgLines.push(`</svg>`);

  return svgLines.join("");
}
