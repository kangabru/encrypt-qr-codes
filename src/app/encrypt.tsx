"use client";

import { encryptText } from "@/common/crypto";
import { EncryptedQRData } from "@/common/types";
import { ImageDetails, onInputChange } from "@/common/use-image-load";
import { join } from "@/common/utils";
import { useRef, useState } from "react";
import { z } from "zod";
import { downloadPng, downloadSvg } from "./download";
import { generateQrCode, readQrCode } from "./qrcode";

export type QrCodeInfo = { data: EncryptedQRData; html: string };

const MIN_LENGTH_PASSWORD = 12;
const MIN_LENGTH_HINT = 3;

export default function EncryptSection() {
  const [dataUrl, setDataUrl] = useState<ImageDetails | null>(null);

  const imageEl = useRef<HTMLImageElement>(null);
  const [qrCodeInfo, setQrCodeInfo] = useState<QrCodeInfo | null>(null);

  const encryptQrCode = async (e: FormData) => {
    setQrCodeInfo(null);

    const { imageFile, password, hint } = z
      .object({
        imageFile: z.instanceof(File),
        password: z.string().min(MIN_LENGTH_PASSWORD),
        hint: z.string().min(MIN_LENGTH_HINT),
      })
      .parse({
        imageFile: e.get("encrypt-image"),
        password: e.get("encrypt-password"),
        hint: e.get("hint"),
      });

    try {
      const plainText = await readQrCode(imageFile);
      const qrCodeData = await encryptText(crypto, plainText, hint, password);
      const qrCode = generateQrCode(
        JSON.stringify(qrCodeData),
        qrCodeData.hint,
        qrCodeData.date
      );
      setQrCodeInfo({ data: qrCodeData, html: qrCode.outerHTML });

      console.log("Generated encrypted QR Code:");
      console.table({ plainText, ...qrCodeData });
    } catch (error) {
      console.error(error);
    }
  };

  const isFileValid = !!dataUrl;
  const [isPassValid, setIsPassValid] = useState(false);
  const [isNameValid, setIsNameValid] = useState(false);
  const canGenerate = isFileValid && isPassValid && isNameValid;

  return (
    <section className="max-w-screen-lg w-full grid grid-cols-2 gap-4 p-4">
      <h2 className="text-xl col-span-2">Encrypt</h2>
      <div className="bg-white rounded-lg border-t-4 border-blue-200 shadow p-4 flex flex-col">
        <h2 className="text-lg mb-4">Encrypt a QR Code</h2>

        <form action={encryptQrCode} className="space-y-4 flex flex-col flex-1">
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
              required
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
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Google Account"
              onChange={(e) =>
                setIsNameValid(e.currentTarget.value.length >= MIN_LENGTH_HINT)
              }
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Password</span>
            <input
              name="encrypt-password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="12345"
              onChange={(e) =>
                setIsPassValid(
                  e.currentTarget.value.length >= MIN_LENGTH_PASSWORD
                )
              }
            />
          </label>

          <div className="flex-1" />

          <button
            type="submit"
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 bg-blue-500 text-white disabled:opacity-50"
            disabled={!canGenerate}
          >
            Encrypt
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg border-t-4 border-blue-200 shadow p-4 flex flex-col">
        <h2 className="text-lg mb-4">Encrypted QR Code</h2>
        {qrCodeInfo ? (
          <div
            dangerouslySetInnerHTML={{ __html: qrCodeInfo.html }}
            className="w-full max-w-lg aspect-square"
          />
        ) : (
          <div className="grid place-items-center w-full h-full text-gray-200">
            <svg
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              className="max-h-40"
            >
              <path
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <button
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 bg-blue-500 text-white disabled:opacity-50"
            disabled={!qrCodeInfo}
            onClick={() => {
              const { html, data } = qrCodeInfo!;
              downloadSvg(html, getFileName(data)).catch((e) =>
                console.error("Failed to download image", e)
              );
            }}
          >
            Download SVG
          </button>

          <button
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 bg-blue-500 text-white disabled:opacity-50"
            disabled={!qrCodeInfo}
            onClick={() => {
              const { html, data } = qrCodeInfo!;
              downloadPng(html, getFileName(data)).catch((e) =>
                console.error("Failed to download image", e)
              );
            }}
          >
            Download PNG
          </button>
        </div>
      </div>
    </section>
  );
}

function getFileName({ hint, date }: EncryptedQRData) {
  return `qr-encrypted-${date}-${hint}`;
}
