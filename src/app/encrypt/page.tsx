/* eslint-disable @next/next/no-img-element */
"use client";

import { encryptText } from "@/common/crypto";
import { EncryptedQRData } from "@/common/parser";
import { generateQrCodeSvg, readQrCode } from "@/common/qrcode.browser";
import QrCodeImageInput from "@/components/fields/qrCodeImageField";
import TextField from "@/components/fields/textField";
import { QrCodeIcon } from "@/components/icons";
import { Panel, SplitPanelSection } from "@/components/panels";
import { Form, Formik } from "formik";
import Link from "next/link";
import { useState } from "react";
import { downloadPng, downloadSvg } from "../download";
import { getErrorMessage } from "@/common/utils";

interface QrCodeInfo {
  data: EncryptedQRData;
  html: string;
}

export default function EncryptSection() {
  const [qrCodeInfo, setQrCodeInfo] = useState<QrCodeInfo | null>(null);
  return (
    <main className="bg-gray-50 min-h-screen w-full flex flex-col items-center p-5">
      <h1 className="text-4xl">Encrypt 2FA QR Codes</h1>
      <SplitPanelSection title="Encrypt">
        <EncryptPanel setQrCodeInfo={setQrCodeInfo} />
        <DisplayPanel qrCodeInfo={qrCodeInfo} />
      </SplitPanelSection>
      <Link href="/decrypt" className="">
        Decrypt instead?
      </Link>
    </main>
  );
}

interface Fields {
  image: string;
  hint: string;
  pass: string;
}

async function encrypt({ image, hint, pass }: Fields) {
  const plainText = await readQrCode(image);
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
  return (
    <Panel title="Encrypt a QR Code">
      <Formik<Fields>
        initialValues={{ image: "", hint: "", pass: "" }}
        onSubmit={async (values, helpers) => {
          props.setQrCodeInfo(null);
          await encrypt(values)
            .then(props.setQrCodeInfo)
            .catch((e) => {
              console.info(e);
              helpers.setErrors(getErrorMessage(e));
            });
        }}
      >
        {({ isValid, errors, values: { image } }) => (
          <Form className="space-y-4 flex flex-col flex-1">
            <QrCodeImageInput />

            <TextField
              name="hint"
              label="Hint"
              minLength={3}
              disabled={!image}
            />
            <TextField
              name="pass"
              label="Password"
              minLength={12}
              disabled={!image}
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
              Encrypt
            </button>
          </Form>
        )}
      </Formik>
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
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 bg-blue-500 text-white disabled"
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
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 bg-blue-500 text-white disabled"
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
