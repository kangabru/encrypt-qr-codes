"use client";

import { decryptText } from "@/common/crypto";
import {
  EncryptedQRData,
  parseEncryptedQRDataString,
  parseFile,
  parseString,
} from "@/common/parser";
import { generateQrCodeSvg, readQrCodeFile } from "@/common/qrcode.browser";
import { ImageDetails, onInputChange } from "@/common/use-image-load";
import { join } from "@/common/utils";
import { Panel, SplitPanelSection } from "@/components/panels";
import { useState } from "react";
import { downloadPng, downloadSvg } from "./download";

const MIN_LENGTH_PASS = 10;

export type QrCodeInfo = { encryptedData: EncryptedQRData; html: string };

export default function DecryptSection() {
  const [qrCodeInfo, setQrCodeInfo] = useState<QrCodeInfo | null>(null);
  return (
    <SplitPanelSection title="Decrypt">
      <DecryptPanel setQrCodeInfo={setQrCodeInfo} />
      <DisplayPanel qrCodeInfo={qrCodeInfo} />
    </SplitPanelSection>
  );
}

async function decryptQrCode(e: FormData): Promise<QrCodeInfo> {
  // Form
  const image = parseFile("Image", e.get("image"), "Please provide an image");
  const pass = parseString("Password", e.get("pass"), MIN_LENGTH_PASS);

  // Decrypt
  const qrCodeData = await readQrCodeFile(image);
  const encryptedData = parseEncryptedQRDataString(qrCodeData);
  console.log(3, encryptedData);
  const decryptedData = await decryptText(crypto, encryptedData, pass);

  const qrCode = generateQrCodeSvg(
    decryptedData,
    `Decrypted: ${encryptedData.hint}`
  );

  console.log("Generated decrypted QR Code:");
  console.table({ ...encryptedData, decryptedData });
  return { encryptedData, html: qrCode };
}

function DecryptPanel(props: {
  setQrCodeInfo: (qr: QrCodeInfo | null) => void;
}) {
  const [formError, setFormError] = useState<string>();

  const [dataUrl, setDataUrl] = useState<ImageDetails | null>(null);
  const [lengthPass, setLengthPass] = useState(0);
  const canDecrypt = dataUrl && lengthPass >= MIN_LENGTH_PASS;

  return (
    <Panel title="Decrypt a QR Code">
      <form
        action={(d) => {
          props.setQrCodeInfo(null);
          setFormError(undefined);
          decryptQrCode(d)
            .then(props.setQrCodeInfo)
            .catch((e) => {
              console.info(e);
              setFormError(e.message);
            });
        }}
        className="space-y-4 flex flex-col"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="12345"
            onChange={(e) => setLengthPass(e.currentTarget.value.length)}
          />
        </label>

        {formError && <p className="text-red-500">{formError}</p>}

        <button
          type="submit"
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 bg-blue-500 text-white disabled:opacity-50"
          disabled={!canDecrypt}
        >
          Decrypt
        </button>
      </form>
    </Panel>
  );
}

function DisplayPanel({ qrCodeInfo }: { qrCodeInfo: QrCodeInfo | null }) {
  return (
    <Panel title="Decrypted QR Code">
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
            const { html, encryptedData } = qrCodeInfo!;
            downloadSvg(html, getFileName(encryptedData)).catch((e) =>
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
            const { html, encryptedData } = qrCodeInfo!;
            downloadPng(html, getFileName(encryptedData)).catch((e) =>
              console.error("Failed to download image", e)
            );
          }}
        >
          Download PNG
        </button>
      </div>
    </Panel>
  );
}

function getFileName({ hint, date }: EncryptedQRData) {
  return `qr-decrypted-${date}-${hint}`;
}
