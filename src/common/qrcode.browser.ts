import "client-only";

import { svgToCanvas } from "@/app/download";
import qrScanner from "qr-scanner";
import { Blocks, getQrCodeBlocks } from "./qrcode";

export async function readQrCode(
  imageOrFileOrBlobOrUrl:
    | HTMLImageElement
    | HTMLVideoElement
    | HTMLCanvasElement
    | OffscreenCanvas
    | ImageBitmap
    | SVGImageElement
    | File
    | Blob
    | URL
    | String
) {
  return qrScanner
    .scanImage(imageOrFileOrBlobOrUrl, {
      returnDetailedScanResult: true,
    })
    .then((r) => r.data);
}

export async function readQrCodeFromSvg(svgXml: string): Promise<ImageData> {
  const [canvas, ctx] = await svgToCanvas(svgXml);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
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
    `<defs><rect id="r" height="1.05" width="1.05" fill="black" /></defs>`,
  ];

  const ty = totalSize - pad / 2,
    tr = totalSize - pad;
  const tSize = (pad * 0.9).toFixed(1);
  const textAttrs = `font-size="${tSize}" font-family="sans-serif" fill="black" dominant-baseline="central"`;

  if (textLeft) {
    const line = xml`<text x="${pad}" y="${ty}" text-anchor="start" $attrs>${textLeft}</text>`;
    svgLines.push(line.replace("$attrs", textAttrs));
  }

  if (textRight) {
    const line = xml`<text x="${tr}" y="${ty}" text-anchor="end" $attrs>${textRight}</text>`;
    svgLines.push(line.replace("$attrs", textAttrs));
  }

  for (let [x, y] of blocks)
    svgLines.push(`<use href="#r" x="${pad + x}" y="${pad + y}" />`);

  svgLines.push(`</svg>`);

  return svgLines.join("");
}

function xml(
  strings: TemplateStringsArray,
  ...values: (string | number | boolean)[]
): string {
  return strings.reduce((result, string, i) => {
    let value = values[i - 1];
    if (typeof value === "string") {
      value = escapeXML(value);
    }
    return result + value + string;
  });
}

function escapeXML(str: string) {
  return str.replace(/[<>&'"]/g, function (char) {
    switch (char) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return char;
    }
  });
}
