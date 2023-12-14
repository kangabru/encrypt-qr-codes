import { loadImageFromFile } from "@/common/use-image-load";
import { BrowserQRCodeReader, BrowserQRCodeSvgWriter } from "@zxing/library";

export async function readQrCode(file: File) {
  const MAX_RETRIES = 10;
  const image = await loadImageFromFile(file);

  const codeReader = new BrowserQRCodeReader();
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const result = await codeReader.decodeFromImageUrl(image.dataUrl);
      return result.getText();
    } catch (e) {
      console.info(`Error decoding QR code (attempt ${i + 1}):`, e);
    }
  }
  throw new Error("Failed to read QR code");
}

export function generateQrCode(
  data: string,
  textLeft?: string,
  textRight?: string
) {
  const writer = new BrowserQRCodeSvgWriter();
  const size = 500;
  const svgEl = writer.write(data, size, size);
  svgEl.removeAttribute("width");
  svgEl.removeAttribute("height");
  svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svgEl.setAttribute("viewBox", `0 0 ${size} ${size}`);
  // textLeft && svgEl.appendChild(createTextElement(textLeft, 30, 35));
  // textRight && svgEl.appendChild(createTextElement(textRight, 470, 35, true));
  return svgEl;
}

function createTextElement(text: string, x: number, y: number, end?: boolean) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "text");
  el.setAttribute("x", x.toString());
  el.setAttribute("y", y.toString());
  el.setAttribute("font-size", `1.5em`);
  el.setAttribute("text-anchor", end ? "end" : "start");
  el.setAttribute("font-family", "sans-serif");
  el.textContent = text;
  return el;
}
