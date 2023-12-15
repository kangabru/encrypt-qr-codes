import Jimp from "jimp";
import "server-only";
import { Blocks, getQrCodeBlocks, readQrCodeBitmap } from "./qrcode";

export async function readQrCodeFile(file: File) {
  const image = await Jimp.read(Buffer.from(await file.arrayBuffer()));
  return readQrCodeBitmap(image.bitmap);
}

export async function readQrCodePng(pngBuffer: Buffer) {
  const image = await Jimp.read(pngBuffer);
  return readQrCodeBitmap(image.bitmap);
}

export async function generateQrCodePng(data: string) {
  const blocks = getQrCodeBlocks(data);
  return renderBlocksToPng(blocks, 500);
}

async function renderBlocksToPng({ size, blocks }: Blocks, outputSize: number) {
  const image = new Jimp(outputSize, outputSize, 0xffffffff);
  const s = outputSize / size;

  for (let [_x, _y] of blocks) {
    const x = _x * s;
    const y = _y * s;
    for (let i = 0; i < s; i++) {
      for (let j = 0; j < s; j++) {
        image.setPixelColor(0x000000ff, x + i, y + j);
      }
    }
  }

  return await image.getBufferAsync(Jimp.MIME_PNG);
}
