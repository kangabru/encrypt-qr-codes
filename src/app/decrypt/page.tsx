/* eslint-disable @next/next/no-img-element */
"use client";

import { decryptText } from "@/common/crypto";
import { EncryptedQRData, parseEncryptedQRDataString } from "@/common/parser";
import { generateQrCodeSvg, readQrCode } from "@/common/qrcode.browser";
import { getErrorMessage } from "@/common/utils";
import QrCodeImageInput, {
  ImageFields,
} from "@/components/fields/qrCodeImageField";
import TextField from "@/components/fields/textField";
import { Panel, SplitPanelSection } from "@/components/panels";
import { QrcodeIcon } from "@heroicons/react/outline";
import { Form, Formik } from "formik";
import Link from "next/link";
import { useState } from "react";
import { downloadPng, downloadSvg } from "../download";

interface QrCodeInfo {
  encryptedData: EncryptedQRData;
  html: string;
}

export default function DecryptPage() {
  const [qrCodeInfo, setQrCodeInfo] = useState<QrCodeInfo | null>(null);
  return (
    <main className="bg-gray-50 min-h-screen w-full flex flex-col items-center p-5">
      <h1 className="text-4xl">Decrypt 2FA QR Codes</h1>
      <SplitPanelSection title="Decrypt">
        <DecryptPanel setQrCodeInfo={setQrCodeInfo} />
        <DisplayPanel qrCodeInfo={qrCodeInfo} />
      </SplitPanelSection>
      <Link href="/encrypt" className="">
        Encrypt instead?
      </Link>
    </main>
  );
}

interface Fields extends ImageFields {
  pass: string;
}

async function decrypt({ image, pass, webcamQrCodeData }: Fields) {
  const qrCodeData = webcamQrCodeData ?? (await readQrCode(image));
  const encryptedData = parseEncryptedQRDataString(qrCodeData);

  console.info("Encrypted data:");
  console.table({ ...encryptedData });

  const decryptedData = await decryptText(crypto, encryptedData, pass);

  const qrCode = generateQrCodeSvg(
    decryptedData,
    `Decrypted: ${encryptedData.hint}`
  );

  console.info("Decrypted data:");
  console.table({ data: decryptedData });
  return { encryptedData, html: qrCode };
}

function DecryptPanel(props: {
  setQrCodeInfo: (qr: QrCodeInfo | null) => void;
}) {
  return (
    <Panel title="Decrypt a QR Code">
      <Formik<Fields>
        initialValues={{ image: "", pass: "" }}
        onSubmit={(values, helpers) => {
          props.setQrCodeInfo(null);
          return decrypt(values)
            .then(props.setQrCodeInfo)
            .catch((e) => {
              console.info(e);
              helpers.setErrors(getErrorMessage(e));
            });
        }}
      >
        {({ isValid, errors, values: { image } }) => (
          <Form className="space-y-4 flex flex-col">
            <QrCodeImageInput />

            <TextField
              name="pass"
              label="Password"
              minLength={1}
              disabled={!image}
              placeholder="hunter2"
            />

            <div className="flex-1" />

            {typeof errors === "string" && (
              <p className="text-red-500">{errors}</p>
            )}

            <button
              type="submit"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 bg-blue-500 text-white disabled"
              disabled={!(image && isValid)}
            >
              Decrypt
            </button>
          </Form>
        )}
      </Formik>
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
          <QrcodeIcon className="max-h-40" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <button
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 bg-blue-500 text-white disabled"
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
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 bg-blue-500 text-white disabled"
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
