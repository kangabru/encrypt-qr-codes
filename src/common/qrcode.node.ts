import "server-only"

import { Bitmap } from "@jimp/core/types/etc"
import {
  BarcodeFormat,
  BinaryBitmap,
  DecodeHintType,
  HybridBinarizer,
  MultiFormatReader,
  RGBLuminanceSource,
  Result,
} from "@zxing/library"
import Jimp from "jimp"
import { Blocks, getQrCodeBlocks } from "./qrcode"

export async function readQrCodeFile(file: File) {
  const image = await Jimp.read(Buffer.from(await file.arrayBuffer()))
  return readQrCodeBitmap(image.bitmap)
}

export async function readQrCodePng(pngBuffer: Buffer) {
  const image = await Jimp.read(pngBuffer)
  return readQrCodeBitmap(image.bitmap)
}

export async function readQrCodeBitmap(
  bitmap: Bitmap | ImageData,
): Promise<string> {
  const { data, width, height } = bitmap
  const MAX_RETRIES = 10
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const result = await _readQrCodeBitmap(data, width, height)
      return result.getText()
    } catch (e) {
      console.info(`Error decoding QR code (attempt ${i + 1}):`, e)
    }
  }
  throw new Error("Failed to read QR code")
}

export async function _readQrCodeBitmap(
  imageData: Buffer | Uint8ClampedArray,
  width: number,
  height: number,
): Promise<Result> {
  const luminance = new Uint8ClampedArray(width * height)
  for (let i = 0; i < imageData.length; i += 4) {
    let r = imageData[i]
    let g = imageData[i + 1]
    let b = imageData[i + 2]
    let avg = (r + g + b) / 3
    luminance[i / 4] = avg
  }

  const luminanceSource = new RGBLuminanceSource(luminance, width, height)
  const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource))

  const hints = new Map()
  const formats = [BarcodeFormat.QR_CODE, BarcodeFormat.DATA_MATRIX]

  hints.set(DecodeHintType.POSSIBLE_FORMATS, formats)
  hints.set(DecodeHintType.TRY_HARDER, true)

  const reader = new MultiFormatReader()
  return reader.decode(binaryBitmap, hints)
}

export async function generateQrCodePng(data: string) {
  const blocks = getQrCodeBlocks(data)
  return renderBlocksToPng(500, blocks)
}

async function renderBlocksToPng(outputSize: number, { size, blocks }: Blocks) {
  const image = new Jimp(outputSize, outputSize, 0xffffffff)
  const s = outputSize / size

  for (let [_x, _y] of blocks) {
    const x = _x * s
    const y = _y * s
    for (let i = 0; i < s; i++)
      for (let j = 0; j < s; j++) image.setPixelColor(0x000000ff, x + i, y + j)
  }

  return await image.getBufferAsync(Jimp.MIME_PNG)
}
