import { Bitmap } from "@jimp/core/types/etc";
import {
  BarcodeFormat,
  BinaryBitmap,
  DecodeHintType,
  HybridBinarizer,
  IllegalStateException,
  MultiFormatReader,
  QRCodeDecoderErrorCorrectionLevel,
  QRCodeEncoder,
  RGBLuminanceSource,
  Result,
} from "@zxing/library";

export async function readQrCodeBitmap(
  bitmap: Bitmap | ImageData
): Promise<string> {
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
  imageData: Buffer | Uint8ClampedArray,
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

export interface BlockText {
  text: string;
  x: number;
  y: number;
  align: "left" | "right";
}
export interface Blocks {
  size: number;
  blocks: [number, number][];
}

export function getQrCodeBlocks(contents: string): Blocks {
  let errorCorrectionLevel = QRCodeDecoderErrorCorrectionLevel.H;

  const code = QRCodeEncoder.encode(contents, errorCorrectionLevel);

  const input = code.getMatrix();
  if (input === null) throw new IllegalStateException();

  const inputWidth = input.getWidth();
  const inputHeight = input.getHeight();

  const size = Math.max(inputWidth, inputHeight);

  const blocks: [number, number][] = [];

  for (let inputY = 0; inputY < inputHeight; inputY++)
    for (let inputX = 0; inputX < inputWidth; inputX++)
      if (input.get(inputX, inputY) === 1) blocks.push([inputX, inputY]);

  return { size, blocks };
}
