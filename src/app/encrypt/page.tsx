/* eslint-disable @next/next/no-img-element */
"use client";

import { encryptText } from "@/common/crypto";
import { generateQrCodeSvg, readQrCode } from "@/common/qrcode.browser";
import { getErrorMessage, join } from "@/common/utils";
import DisplayPanel, { QrCodeInfo } from "@/components/DisplayPanel";
import { Panel, SplitPanelSection } from "@/components/Panel";
import QrCodeImageInput from "@/components/fields/QrCodeImageField";
import { ImageFields } from "@/components/fields/QrCodeImageField/types";
import TextField from "@/components/fields/TextField";
import { LockClosedIcon } from "@heroicons/react/solid";
import { Form, Formik } from "formik";
import Link from "next/link";
import { useState } from "react";

export default function EncryptSection() {
  const [qrCodeInfo, setQrCodeInfo] = useState<QrCodeInfo | null>(null);
  return (
    <main className="bg-gray-50 min-h-screen w-full flex flex-col items-center p-5">
      <h1 className="text-4xl">Encrypt 2FA QR Codes</h1>
      <SplitPanelSection title="Encrypt">
        <EncryptPanel setQrCodeInfo={setQrCodeInfo} />
        <DisplayPanel
          title="Encrypted QR Code"
          qrCodeInfo={qrCodeInfo}
          getFileName={(d) => `qr-encrypted-${d.date}-${d.hint}`}
        />
      </SplitPanelSection>
      <Link href="/decrypt" className="">
        Decrypt instead?
      </Link>
    </main>
  );
}

interface Fields extends ImageFields {
  hint: string;
  pass: string;
}

async function encrypt({
  image,
  hint,
  pass,
  cameraQrCodeData,
}: Fields): Promise<QrCodeInfo> {
  const dataDecrypted = cameraQrCodeData || (await readQrCode(image));
  const dataEncrypted = await encryptText(crypto, dataDecrypted, hint, pass);
  const svgHtml = generateQrCodeSvg(
    JSON.stringify(dataEncrypted),
    dataEncrypted.hint,
    dataEncrypted.date
  );

  console.info("Generated encrypted QR Code:");
  console.table({ plainText: dataDecrypted, ...dataEncrypted });
  return { svgHtml, dataEncrypted, dataDecrypted };
}

function EncryptPanel(props: {
  setQrCodeInfo: (qr: QrCodeInfo | null) => void;
}) {
  return (
    <Formik<Fields>
      initialValues={{ image: "", hint: "", pass: "", cameraQrCodeData: "" }}
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
        <Panel
          title="Encrypt a QR Code"
          icon={
            <LockClosedIcon className="w-6 h-6 mr-2 -mt-0.5 text-gray-300" />
          }
          hasError={typeof errors === "string"}
        >
          <Form className="space-y-4 flex flex-col flex-1">
            <QrCodeImageInput
              demoSrc="/demo/qr-code-plain.png"
              demoDescription="Demo QR Code"
            />

            <TextField
              name="hint"
              label="Hint"
              description="Unencrypted text to remember what the QR code is for."
              minLength={3}
              disabled={!image}
              placeholder="Google Account"
            />
            <TextField
              name="pass"
              label="Password"
              type="password"
              description="Make it secure but memorable as this is unrecoverable."
              minLength={12}
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
              <LockClosedIcon className="w-5 h-5 mr-1" />
              <span>Encrypt</span>
            </button>
          </Form>
        </Panel>
      )}
    </Formik>
  );
}
