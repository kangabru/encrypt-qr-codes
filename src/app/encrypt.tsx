/* eslint-disable @next/next/no-img-element */
"use client";

import { encryptText } from "@/common/crypto";
import { EncryptedQRData, parseFile, parseString } from "@/common/parser";
import { generateQrCodeSvg, readQrCodeFile } from "@/common/qrcode.browser";
import { ImageDetails, onInputChange } from "@/common/use-image-load";
import { getErrorMessage, join } from "@/common/utils";
import { QrCodeIcon } from "@/components/icons";
import { Panel, SplitPanelSection } from "@/components/panels";
import { useState } from "react";
import { downloadPng, downloadSvg } from "./download";

export type QrCodeInfo = { data: EncryptedQRData; html: string };

const MIN_LENGTH_PASS = 12;
const MIN_LENGTH_HINT = 3;

export default function EncryptSection() {
  const [qrCodeInfo, setQrCodeInfo] = useState<QrCodeInfo | null>(null);
  return (
    <SplitPanelSection title="Encrypt">
      <EncryptPanel setQrCodeInfo={setQrCodeInfo} />
      <DisplayPanel qrCodeInfo={qrCodeInfo} />
    </SplitPanelSection>
  );
}

async function generateQrCode(d: FormData): Promise<QrCodeInfo> {
  // Form
  const image = parseFile("Image", d.get("image"), "Please provide an image");
  const hint = parseString("Hint", d.get("hint"), MIN_LENGTH_HINT);
  const pass = parseString("Password", d.get("pass"), MIN_LENGTH_PASS);

  // Encrypt
  const plainText = await readQrCodeFile(image);
  const qrCodeData = await encryptText(crypto, plainText, hint, pass);
  const qrCodeSvg = generateQrCodeSvg(
    JSON.stringify(qrCodeData),
    qrCodeData.hint,
    qrCodeData.date
  );

  console.log("Generated encrypted QR Code:");
  console.table({ plainText, ...qrCodeData });
  return { data: qrCodeData, html: qrCodeSvg };
}

function EncryptPanel(props: {
  setQrCodeInfo: (qr: QrCodeInfo | null) => void;
}) {
  const [formError, setFormError] = useState<string>();

  const [dataUrl, setDataUrl] = useState<ImageDetails | null>(null);
  const [lengthHint, setLengthHint] = useState(0);
  const [lengthPass, setLengthPass] = useState(0);

  const canEncrypt =
    dataUrl && lengthHint >= MIN_LENGTH_HINT && lengthPass >= MIN_LENGTH_PASS;

  return (
    <Panel title="Encrypt a QR Code">
      <form
        action={(d) => {
          props.setQrCodeInfo(null);
          setFormError(undefined);
          generateQrCode(d)
            .then(props.setQrCodeInfo)
            .catch((e) => {
              console.info(e);
              setFormError(getErrorMessage(e));
            });
        }}
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
          disabled={!canEncrypt}
        >
          Encrypt
        </button>
      </form>
    </Panel>
  );
}

function DisplayPanel({ qrCodeInfo }: { qrCodeInfo: QrCodeInfo | null }) {
  return (
    <Panel title="Encrypted QR Code">
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
    </Panel>
  );
}

function getFileName({ hint, date }: EncryptedQRData) {
  return `qr-encrypted-${date}-${hint}`;
}
