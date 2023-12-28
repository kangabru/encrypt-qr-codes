/* eslint-disable @next/next/no-img-element */
"use client";

import { decryptText } from "@/common/crypto";
import {
  EncryptedQRData,
  parseEncryptedQRDataString,
  parseFile,
  parseString,
} from "@/common/parser";
import { generateQrCodeSvg, readQrCode } from "@/common/qrcode.browser";
import { ImageDetails, onInputChange } from "@/common/use-image-load";
import { getErrorMessage, join } from "@/common/utils";
import { QrCodeIcon } from "@/components/icons";
import { Panel, SplitPanelSection } from "@/components/panels";
import { useState } from "react";
import { downloadPng, downloadSvg } from "./download";

const MIN_LENGTH_PASS = 1;

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
  const qrCodeData = await readQrCode(image);
  const encryptedData = parseEncryptedQRDataString(qrCodeData);

  console.log("Encrypted data:");
  console.table({ ...encryptedData });

  const decryptedData = await decryptText(crypto, encryptedData, pass);

  const qrCode = generateQrCodeSvg(
    decryptedData,
    `Decrypted: ${encryptedData.hint}`
  );

  console.log("Decrypted data:");
  console.table({ data: decryptedData });

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
              setFormError(getErrorMessage(e));
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
          <QrCodeIcon className="max-h-40" />
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
