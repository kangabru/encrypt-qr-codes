import "client-only"

import { svgToCanvas } from "@/app/download"
import qrScanner from "qr-scanner"
import { Blocks, getQrCodeBlocks } from "./qrcode"

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
    | String,
) {
  return qrScanner
    .scanImage(imageOrFileOrBlobOrUrl, {
      returnDetailedScanResult: true,
    })
    .then((r) => r.data)
}

export async function readQrCodeFromSvg(svgXml: string): Promise<ImageData> {
  const [canvas, ctx] = await svgToCanvas(svgXml)
  return ctx.getImageData(0, 0, canvas.width, canvas.height)
}

interface QrCodeOoptions {
  title?: string
  date?: string
  showLockSymbol?: boolean
  showWebsiteUrl?: boolean
}

export function generateQrCodeSvg(
  data: string,
  options: QrCodeOoptions,
): string {
  const blocks = getQrCodeBlocks(data)
  return renderBlocksToSvg(blocks, options)
}

function renderBlocksToSvg(blocks: Blocks, options: QrCodeOoptions): string {
  const pad = Math.ceil(blocks.size * 0.1)
  const size = blocks.size + 2 * pad

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" fill="black">
    <defs>
      <rect id="r" height="1.05" width="1.05" />
      <svg id="lock" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path clip-rule="evenodd" fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
      </svg>
    </defs>
    ${getQrBlocks(blocks, size, pad, !!options.showLockSymbol)}
    ${getQrText(options, size, pad)}
  </svg>`
}

function getQrBlocks(
  { size, blocks }: Blocks,
  svgSize: number,
  pad: number,
  showLockSymbol: boolean,
): string {
  const svgLines: string[] = []

  const xMid = svgSize / 2 - pad
  const yMid = xMid

  let sizeLock = Math.ceil(size * 0.12)
  if (sizeLock % 2 === 0) sizeLock++
  const sizeLockSq = (sizeLock * 0.75) ** 2

  for (let [x, y] of blocks) {
    const distSq = (x + 0.5 - xMid) ** 2 + (y + 0.5 - yMid) ** 2
    if (!showLockSymbol || distSq > sizeLockSq)
      svgLines.push(`<use href="#r" x="${pad + x}" y="${pad + y}" />`)
  }

  if (showLockSymbol) {
    const pLock = pad + xMid - sizeLock / 2
    svgLines.push(
      `<use href="#lock" x="${pLock}" y="${pLock}" width="${sizeLock}" height="${sizeLock}" />`,
    )
  }

  return svgLines.join("")
}

function getQrText(options: QrCodeOoptions, size: number, pad: number): string {
  const svgLines: string[] = []

  const f = 0.85
  const [x1, x2] = [pad, size - pad]
  const [y1, y2] = [pad * f, size - pad * f]

  const fontLarge = (pad * 0.6).toFixed(1)
  const fontSmall = (pad * 0.35).toFixed(1)

  // Top left
  if (options.title)
    svgLines.push(
      `<text x="${x1}" y="${y1}" font-size="${fontLarge}" text-anchor="start" font-family="sans-serif">
        ${escape(options.title)}
      </text>`,
    )

  svgLines.push(
    `<g font-size="${fontSmall}" font-family="sans-serif" dominant-baseline="hanging">`,
  )

  // Bottom right
  if (options.date) {
    svgLines.push(
      `<text x="${x2}" y="${y2}" text-anchor="end">
        ${escape(options.date)}
      </text>`,
    )
  }

  // Bottom left
  if (options.showWebsiteUrl)
    svgLines.push(
      `<text x="${x1}" y="${y2}" text-anchor="start">/kangabru/encrypt-qr-codes</text>`,
    )

  svgLines.push(`</g>`)

  return svgLines.join("")
}

function escape(str: string) {
  return str.replace(/[<>&'"]/g, function (char) {
    switch (char) {
      case "<":
        return "&lt;"
      case ">":
        return "&gt;"
      case "&":
        return "&amp;"
      case "'":
        return "&apos;"
      case '"':
        return "&quot;"
      default:
        return char
    }
  })
}
