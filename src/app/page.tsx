"use client";

import { ImageDetails, onInputChange } from "@/common/use-image-load";
import { getDate, join } from "@/common/utils";
import { useRef, useState } from "react";
import { encryptText } from "./crypto";
import { EncryptedQRData, generateQrCode, readQrCode } from "./qrcode";

export default function Home() {
  return (
    <main className="bg-gray-50 min-h-screen w-full flex flex-col items-center">
      <h1 className="text-4xl">Encrypt and Backup 2FA QR Codes</h1>

      <EncryptSection />
    </main>
  );
}

type QrCodeInfo = { data: EncryptedQRData; html: string };

function EncryptSection() {
  const [dataUrl, setDataUrl] = useState<ImageDetails | null>(null);

  const imageEl = useRef<HTMLImageElement>(null);
  const [qrCodeInfo, setQrCodeInfo] = useState<QrCodeInfo | null>(null);

  const encryptQrCode = async (e: FormData) => {
    const imageFile = e.get("encrypt-image") as File;
    const password = e.get("encrypt-password") as string;
    const hint = e.get("hint") as string;

    try {
      const plainText = await readQrCode(imageFile);
      const qrCodeData = await encryptText(plainText, hint, password);
      const qrCode = generateQrCode(qrCodeData);
      setQrCodeInfo({ data: qrCodeData, html: qrCode.outerHTML });

      console.log("Generated encrypted QR Code:");
      console.table({ plainText, ...qrCodeData });
    } catch (error) {
      console.error(error);
    }
  };

  const _downloadSvg = () =>
    downloadSvg(qrCodeInfo!).catch((e) =>
      console.error("Failed to download image", e)
    );

  const isFileValid = !!dataUrl;
  const [isPassValid, setIsPassValid] = useState(false);
  const [isNameValid, setIsNameValid] = useState(false);
  const canGenerate = isFileValid && isPassValid && isNameValid;

  return (
    <section className="max-w-screen-md grid grid-cols-2 gap-4 p-4">
      <div className="bg-white rounded-lg border-t-4 border-blue-200 shadow p-4 flex flex-col">
        <h2 className="text-lg">Encrypt QR Code</h2>

        <form action={encryptQrCode} className="space-y-4 flex flex-col">
          <label
            className={join(
              "w-full h-40 rounded-lg grid place-items-center cursor-pointer",
              "bg-blue-50 p-2 border-dashed border-2 border-blue-500"
            )}
          >
            {dataUrl ? (
              <>
                <img
                  ref={imageEl}
                  src={dataUrl.dataUrl}
                  alt=""
                  className="h-full w-full object-contain"
                />
                <span>{dataUrl.fileName}</span>
              </>
            ) : (
              <span>Select or paste image</span>
            )}

            <input
              name="encrypt-image"
              hidden
              type="file"
              accept="image/*"
              onChange={onInputChange(setDataUrl)}
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Hint</span>
            <input
              name="hint"
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Google Account"
              onChange={(e) =>
                setIsNameValid(e.currentTarget.value.length >= 2)
              }
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Password</span>
            <input
              name="encrypt-password"
              type="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="12345"
              onChange={(e) =>
                setIsPassValid(e.currentTarget.value.length >= 10)
              }
            />
          </label>

          <button
            type="submit"
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 bg-blue-500 text-white disabled:opacity-50"
            disabled={!canGenerate}
          >
            Generate
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg border-t-4 border-blue-200 shadow p-4 flex flex-col">
        <h2 className="text-lg">Encrypted QR Code</h2>
        {qrCodeInfo && (
          <>
            <div
              dangerouslySetInnerHTML={{ __html: qrCodeInfo.html }}
              className="w-full max-w-lg aspect-square"
            />

            <button
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 bg-blue-500 text-white disabled:opacity-50"
              onClick={_downloadSvg}
            >
              Download
            </button>
          </>
        )}
      </div>
    </section>
  );
}

async function downloadSvg(info: QrCodeInfo) {
  const svgImage = `data:image/svg+xml;base64,${btoa(info.html)}`;
  const pngImage = await svgToPng(svgImage);

  const date = getDate();
  const downloadLink = document.createElement("a");
  downloadLink.href = pngImage;
  downloadLink.download = `encrypted-qr-${date}-${info.data.hint}.png`;
  downloadLink.style.display = "block";
  downloadLink.click();
}

async function svgToPng(svgSrc: string): Promise<string> {
  const svgImage = await createImage(svgSrc);
  const canvas = document.createElement("canvas");
  const size = 1000;
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d")!;
  context.fillStyle = "#fff";
  context.fillRect(0, 0, size, size);
  context.drawImage(svgImage, 0, 0, size, size);

  return canvas.toDataURL("image/png");
}

function createImage(src: string): Promise<HTMLImageElement> {
  return new Promise((accept, reject) => {
    const image = new Image();
    image.onerror = reject;
    image.onload = () => accept(image);
    image.src = src;
  });
}
