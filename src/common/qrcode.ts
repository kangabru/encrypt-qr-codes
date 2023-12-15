import { Bitmap } from "@jimp/core/types/etc";
import {
  BarcodeFormat,
  BinaryBitmap,
  DecodeHintType,
  EncodeHintType,
  HybridBinarizer,
  IllegalStateException,
  MultiFormatReader,
  QRCodeDecoderErrorCorrectionLevel,
  QRCodeEncoder,
  RGBLuminanceSource,
  Result,
} from "@zxing/library";
import "jimp";

// @ts-ignore
const Jimp = window.Jimp as JimpType;

export async function readQrCodeFile(file: File) {
  const image = await Jimp.read(Buffer.from(await file.arrayBuffer()));
  return readQrCodeBitmap(image.bitmap);
}

export async function readQrCodePng(pngBuffer: Buffer) {
  const image = await Jimp.read(pngBuffer);
  return readQrCodeBitmap(image.bitmap);
}

export async function readQrCodeBitmap(bitmap: Bitmap): Promise<string> {
  const { data, width, height } = bitmap;
  const MAX_RETRIES = 10;
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const result = await _readQrCodeBitmap(data, width, height);
      return result.getText();
    } catch (e) {
      console.info(`Error decoding QR code (attempt ${i + 1}):`, e);
    }
  }
  throw new Error("Failed to read QR code");
}

export async function _readQrCodeBitmap(
  imageData: Buffer,
  width: number,
  height: number
): Promise<Result> {
  const luminance = new Uint8ClampedArray(width * height);
  for (let i = 0; i < imageData.length; i += 4) {
    let r = imageData[i];
    let g = imageData[i + 1];
    let b = imageData[i + 2];
    let avg = (r + g + b) / 3;
    luminance[i / 4] = avg;
  }

  const luminanceSource = new RGBLuminanceSource(luminance, width, height);
  const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

  const hints = new Map();
  const formats = [BarcodeFormat.QR_CODE, BarcodeFormat.DATA_MATRIX];

  hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
  hints.set(DecodeHintType.TRY_HARDER, true);

  const reader = new MultiFormatReader();
  return reader.decode(binaryBitmap, hints);
}

export async function generateQrCodePng(data: string) {
  const blocks = getQrCodeBlocks(data);
  return renderBlocksToPng(blocks, 500);
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

interface Blocks {
  size: number;
  blocks: [number, number][];
}

function getQrCodeBlocks(
  contents: string,
  hints?: Map<EncodeHintType, any>
): Blocks {
  let errorCorrectionLevel = QRCodeDecoderErrorCorrectionLevel.L;
  let quietZone = 4;

  if (hints) {
    if (undefined !== hints.get(EncodeHintType.ERROR_CORRECTION)) {
      errorCorrectionLevel = QRCodeDecoderErrorCorrectionLevel.fromString(
        hints.get(EncodeHintType.ERROR_CORRECTION).toString()
      );
    }

    if (undefined !== hints.get(EncodeHintType.MARGIN)) {
      quietZone = Number.parseInt(
        hints.get(EncodeHintType.MARGIN).toString(),
        10
      );
    }
  }

  const code = QRCodeEncoder.encode(contents, errorCorrectionLevel, hints);

  const input = code.getMatrix();
  if (input === null) throw new IllegalStateException();

  const inputWidth = input.getWidth();
  const inputHeight = input.getHeight();

  const pad = quietZone;
  const size = Math.max(inputWidth, inputHeight) + 2 * pad;
  const blocks: [number, number][] = [];

  for (let inputY = 0; inputY < inputHeight; inputY++) {
    for (let inputX = 0; inputX < inputWidth; inputX++) {
      if (input.get(inputX, inputY) === 1) {
        blocks.push([inputX + pad, inputY + pad]);
      }
    }
  }

  return { size, blocks };
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
