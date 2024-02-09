export function svgToDataUrl(svgXml: string) {
  return `data:image/svg+xml;base64,${btoa(svgXml)}`
}

export async function svgToPngDataUrl(dataUrl: string): Promise<string> {
  const [canvas] = await svgToCanvas(dataUrl)
  return canvas.toDataURL("image/png")
}

export async function downloadPng(pngDataUrl: string, fileName: string) {
  if (!pngDataUrl.startsWith("data:image/png;"))
    throw new Error(`Data is not a PNG data url: ${pngDataUrl}`)

  const link = document.createElement("a")
  link.href = pngDataUrl
  link.download = `${fileName}.png`
  link.style.display = "block"
  link.click()
}

export async function svgToCanvas(
  dataUrl: string,
  size = 1000,
): Promise<[HTMLCanvasElement, CanvasRenderingContext2D]> {
  const svgImage = await createImage(dataUrl)

  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size

  const context = canvas.getContext("2d")!
  context.fillStyle = "#fff"
  context.fillRect(0, 0, size, size)
  context.drawImage(svgImage, 0, 0, size, size)

  return [canvas, context]
}

function createImage(src: string): Promise<HTMLImageElement> {
  return new Promise((accept, reject) => {
    const image = new Image()
    image.onerror = reject
    image.onload = () => accept(image)
    image.src = src
  })
}
