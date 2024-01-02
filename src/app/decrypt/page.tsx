/* eslint-disable @next/next/no-img-element */
"use client";

import { decryptText } from "@/common/crypto";
import { parseEncryptedQRDataString } from "@/common/parser";
import { generateQrCodeSvg, readQrCode } from "@/common/qrcode.browser";
import { getErrorMessage, join } from "@/common/utils";
import DisplayPanel, { QrCodeInfo } from "@/components/DisplayPanel";
import { Panel, SplitPanelSection } from "@/components/Panel";
import QrCodeImageInput from "@/components/fields/QrCodeImageField";
import { ImageFields } from "@/components/fields/QrCodeImageField/types";
import TextField from "@/components/fields/TextField";
import { LockOpenIcon } from "@heroicons/react/solid";
import { Form, Formik } from "formik";
import Link from "next/link";
import { useState } from "react";

export default function DecryptPage() {
  const [qrCodeInfo, setQrCodeInfo] = useState<QrCodeInfo | null>(null);
  return (
    <main className="bg-gray-50 min-h-screen w-full flex flex-col items-center p-5">
      <h1 className="text-4xl">Decrypt 2FA QR Codes</h1>
      <SplitPanelSection title="Decrypt">
        <DecryptPanel setQrCodeInfo={setQrCodeInfo} />
        <DisplayPanel
          title="Decrypted QR Code"
          qrCodeInfo={qrCodeInfo}
          getFileName={(d) => `qr-decrypted-${d.date}-${d.hint}`}
        />
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

async function decrypt({
  image,
  pass,
  cameraQrCodeData,
}: Fields): Promise<QrCodeInfo> {
  const qrCodeData = cameraQrCodeData || (await readQrCode(image));
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
  return { data: encryptedData, html: qrCode };
}

function DecryptPanel(props: {
  setQrCodeInfo: (qr: QrCodeInfo | null) => void;
}) {
  return (
    <Formik<Fields>
      initialValues={{ image: "", pass: "", cameraQrCodeData: "" }}
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
        <Panel
          title="Decrypt a QR Code"
          hasError={typeof errors === "string"}
          icon={<LockOpenIcon className="w-6 h-6 mr-2 -mt-0.5 text-gray-300" />}
        >
          <Form className="space-y-4 flex flex-col flex-1">
            <QrCodeImageInput />

            <TextField
              name="pass"
              label="Password"
              type="password"
              description="Used to encrypt the QR code. Unrecoverable if lost."
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
              className={join(
                "flex items-center justify-center mt-1 p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 text-white disabled",
                typeof errors === "string" ? "bg-red-500" : "bg-blue-500"
              )}
              disabled={!(image && isValid)}
            >
              <LockOpenIcon className="w-5 h-5 mr-1" />
              <span>Decrypt</span>
            </button>
          </Form>
        </Panel>
      )}
    </Formik>
  );
}
