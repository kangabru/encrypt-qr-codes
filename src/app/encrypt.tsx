"use client";

import { encryptText } from "@/common/crypto";
import { generateQrCodeSvg, readQrCodeFile } from "@/common/qrcode.browser";
import { EncryptedQRData } from "@/common/types";
import { ImageDetails, onInputChange } from "@/common/use-image-load";
import { join } from "@/common/utils";
import { useState } from "react";
import { downloadPng, downloadSvg } from "./download";

export type QrCodeInfo = { data: EncryptedQRData; html: string };

const MIN_LENGTH_PASS = 12;
const MIN_LENGTH_HINT = 3;

export default function EncryptSection() {
  const [qrCodeInfo, setQrCodeInfo] = useState<QrCodeInfo | null>(null);

  return (
    <section className="max-w-screen-lg w-full grid grid-cols-2 gap-4 p-4">
      <h2 className="text-xl col-span-2">Encrypt</h2>

      <GeneratePanel setQrCodeInfo={setQrCodeInfo} />
      <DisplayPanel qrCodeInfo={qrCodeInfo} />
    </section>
  );
}

function GeneratePanel(props: {
  setQrCodeInfo: (qr: QrCodeInfo | null) => void;
}) {
  const [formError, setFormError] = useState<string>();

  const [dataUrl, setDataUrl] = useState<ImageDetails | null>(null);
  const [lengthHint, setLengthHint] = useState(0);
  const [lengthPass, setLengthPass] = useState(0);

  const canGenerate =
    dataUrl && lengthHint >= MIN_LENGTH_HINT && lengthPass >= MIN_LENGTH_PASS;

  return (
    <div className="bg-white rounded-lg border-t-4 border-blue-200 shadow p-4 flex flex-col">
      <h2 className="text-lg mb-4">Encrypt a QR Code</h2>

      <form
        action={(d) => generateQrCode(d, props.setQrCodeInfo, setFormError)}
        className="space-y-4 flex flex-col flex-1"
      >
        <label
          className={join(
            "w-full h-40 rounded-lg grid place-items-center cursor-pointer",
            "bg-blue-50 p-2 border-dashed border-2 border-blue-500"
          )}
        >
          {dataUrl ? (
            <>
              <img
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
            name="image"
            hidden
            required
            type="file"
            accept="image/*"
            onChange={onInputChange(setDataUrl)}
          />
        </label>

        <label className="block">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Hint</span>
            <span className="text-xs mr-2">
              {lengthHint === 0
                ? "*"
                : lengthHint < MIN_LENGTH_HINT
                  ? MIN_LENGTH_HINT - lengthHint
                  : null}
            </span>
          </div>
          <input
            name="hint"
            type="text"
            required
            className={join(
              "mt-1 block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50",
              lengthHint > 0 && lengthHint < MIN_LENGTH_HINT
                ? "border-red-300 focus:border-red-300 focus:ring-red-200"
                : "border-gray-300 focus:border-indigo-300 focus:ring-indigo-200"
            )}
            placeholder="Google Account"
            onChange={(e) => setLengthHint(e.currentTarget.value.length)}
          />
        </label>

        <label className="block">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Password</span>
            <span className="text-xs mr-2">
              {lengthPass === 0
                ? "*"
                : lengthPass < MIN_LENGTH_PASS
                  ? MIN_LENGTH_PASS - lengthPass
                  : null}
            </span>
          </div>
          <input
            name="pass"
            type="password"
            required
            className={join(
              "mt-1 block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50",
              lengthPass > 0 && lengthPass < MIN_LENGTH_PASS
                ? "border-red-300 focus:border-red-300 focus:ring-red-200"
                : "border-gray-300 focus:border-indigo-300 focus:ring-indigo-200"
            )}
            placeholder="12345"
            onChange={(e) => setLengthPass(e.currentTarget.value.length)}
          />
        </label>

        <div className="flex-1" />

        {formError && <p className="text-red-500">{formError}</p>}

        <button
          type="submit"
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 bg-blue-500 text-white disabled:opacity-50"
          disabled={!canGenerate}
        >
          Encrypt
        </button>
      </form>
    </div>
  );
}

function DisplayPanel({ qrCodeInfo }: { qrCodeInfo: QrCodeInfo | null }) {
  return (
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
  );
}

async function generateQrCode(
  e: FormData,
  setQrCodeInfo: (d: QrCodeInfo | null) => void,
  setFormError: (e: string | undefined) => void
) {
  // Reset
  setQrCodeInfo(null);
  setFormError(undefined);

  // Field date
  const image = e.get("image") as File;
  const hint = e.get("hint") as string;
  const pass = e.get("pass") as string;

  // Validate
  if (!(image && image instanceof File))
    return setFormError("Please provide an image");

  const isBadString = (val: string) => !(val && typeof val === "string");
  if (isBadString(hint)) return setFormError("Please provide a hint");
  if (isBadString(pass)) return setFormError("Please provide a password");

  if (hint.length < MIN_LENGTH_HINT) return setFormError(`Hint is too short`);
  if (pass.length < MIN_LENGTH_PASS)
    return setFormError(`Password is too short`);

  // Encrypt
  try {
    const plainText = await readQrCodeFile(image);
    const qrCodeData = await encryptText(crypto, plainText, hint, pass);
    const qrCodeSvg = generateQrCodeSvg(
      JSON.stringify(qrCodeData),
      qrCodeData.hint,
      qrCodeData.date
    );

    console.log("Generated encrypted QR Code:");
    console.table({ plainText, ...qrCodeData });
    setQrCodeInfo({ data: qrCodeData, html: qrCodeSvg });
  } catch (error: any) {
    console.error(error);
    setFormError(error.message);
  }
}

function getFileName({ hint, date }: EncryptedQRData) {
  return `qr-encrypted-${date}-${hint}`;
}
