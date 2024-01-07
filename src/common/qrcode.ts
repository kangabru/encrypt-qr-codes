import {
  IllegalStateException,
  QRCodeDecoderErrorCorrectionLevel,
  QRCodeEncoder,
} from "@zxing/library"
import QRCode from "@zxing/library/esm/core/qrcode/encoder/QRCode"

export interface BlockText {
  text: string
  x: number
  y: number
  align: "left" | "right"
}
export interface Blocks {
  size: number
  blocks: [number, number][]
}
export enum ErrorCorrectionLevel {
  Low,
  Medium,
  High,
  Higher,
}

export function getQrCodeBlocks(
  contents: string,
  errorCorrectionLevel?: ErrorCorrectionLevel,
): Blocks {
  const _errorCorrectionLevel: QRCodeDecoderErrorCorrectionLevel = {
    [ErrorCorrectionLevel.Low]: QRCodeDecoderErrorCorrectionLevel.L,
    [ErrorCorrectionLevel.Medium]: QRCodeDecoderErrorCorrectionLevel.M,
    [ErrorCorrectionLevel.High]: QRCodeDecoderErrorCorrectionLevel.Q,
    [ErrorCorrectionLevel.Higher]: QRCodeDecoderErrorCorrectionLevel.H,
  }[errorCorrectionLevel ?? ErrorCorrectionLevel.Medium]

  let code: QRCode
  try {
    code = QRCodeEncoder.encode(contents, _errorCorrectionLevel)
  } catch (error) {
    console.info(error)
    throw new Error("Failed to read QR code")
  }

  const input = code.getMatrix()
  if (input === null) throw new IllegalStateException()

  const inputWidth = input.getWidth()
  const inputHeight = input.getHeight()

  const size = Math.max(inputWidth, inputHeight)

  const blocks: [number, number][] = []

  for (let inputY = 0; inputY < inputHeight; inputY++)
    for (let inputX = 0; inputX < inputWidth; inputX++)
      if (input.get(inputX, inputY) === 1) blocks.push([inputX, inputY])

  return { size, blocks }
}
