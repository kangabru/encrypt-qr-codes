/* eslint-disable @next/next/no-img-element */
"use client"

import { encryptText } from "@/common/crypto"
import { generateQrCodeSvg } from "@/common/qrcode.browser"
import { getErrorMessage } from "@/common/utils"
import DisplayPanel, { QrCodeInfo } from "@/components/DisplayPanel"
import { faqsEncrypt } from "@/components/FaqContent"
import FaqList from "@/components/FaqList"
import Page from "@/components/Page"
import { Panel, SplitPanelSection } from "@/components/Panel"
import QrCodeImageInput from "@/components/fields/QrCodeImageField"
import { ImageFields } from "@/components/fields/QrCodeImageField/types"
import TextField from "@/components/fields/TextField"
import { LockClosedIcon } from "@heroicons/react/solid"
import { Form, Formik } from "formik"
import { useState } from "react"

export default function EncryptSection() {
  const [qrCodeInfo, setQrCodeInfo] = useState<QrCodeInfo | null>(null)
  const [isEncrypting, setIsEncrypting] = useState(false)
  return (
    <Page title="Encrypt QR Codes">
      <SplitPanelSection>
        <EncryptPanel
          setQrCodeInfo={setQrCodeInfo}
          setIsEncrypting={setIsEncrypting}
        />
        <DisplayPanel
          title="Encrypted QR Code"
          isLoading={isEncrypting}
          qrCodeInfo={qrCodeInfo}
          getFileName={(d) => `qr-encrypted-${d.date}-${d.hint}`}
        />
      </SplitPanelSection>
      <FaqList faqs={faqsEncrypt} />
    </Page>
  )
}

interface Fields extends ImageFields {
  hint: string
  pass1: string
  pass2: string
}

async function encrypt({
  qrCodeData,
  hint,
  pass1,
  pass2,
}: Fields): Promise<QrCodeInfo> {
  if (pass1 !== pass2) throw new Error("Passwords do not match")

  const dataDecrypted = qrCodeData
  const dataEncrypted = await encryptText(crypto, dataDecrypted, hint, pass1)
  const svgHtml = generateQrCodeSvg(JSON.stringify(dataEncrypted), {
    title: dataEncrypted.hint,
    date: dataEncrypted.date,
    showLockSymbol: true,
    showWebsiteUrl: true,
  })

  console.info("Generated encrypted QR Code:")
  console.table({ plainText: dataDecrypted, ...dataEncrypted })
  return { svgHtml, dataEncrypted, dataDecrypted }
}

function EncryptPanel(props: {
  setQrCodeInfo: (qr: QrCodeInfo | null) => void
  setIsEncrypting: (_: boolean) => void
}) {
  return (
    <Formik<Fields>
      initialValues={{
        image: "",
        qrCodeData: "",
        hint: "",
        pass1: "",
        pass2: "",
      }}
      onSubmit={async (values, helpers) => {
        props.setQrCodeInfo(null)
        props.setIsEncrypting(true)
        await encrypt(values)
          .then(props.setQrCodeInfo)
          .catch((e) => {
            console.info(e)
            helpers.setErrors(getErrorMessage(e))
          })
        props.setIsEncrypting(false)
      }}
    >
      {({ isValid, errors, values: { pass1, qrCodeData: data } }) => (
        <Panel
          title="Encrypt a QR Code"
          icon={
            <LockClosedIcon className="-mt-0.5 mr-2 h-6 w-6 text-gray-300" />
          }
          hasError={typeof errors === "string"}
        >
          <Form className="flex flex-1 flex-col space-y-4">
            <QrCodeImageInput
              demoSrc="/demo/qr-code-plain.png"
              demoDescription="Demo QR Code"
            />

            <TextField
              name="hint"
              label="Hint"
              description="Unencrypted text to remember what the QR code is for."
              minLength={3}
              disabled={!data}
              placeholder="Google Account"
            />
            <TextField
              name="pass1"
              label="Password"
              type="password"
              description="Make it secure but memorable as this is unrecoverable."
              minLength={12}
              disabled={!data}
              placeholder="hunter2"
            />
            <TextField
              name="pass2"
              label="Confirm Password"
              type="password"
              description="To ensure that you didn't mistype it."
              minLength={pass1.length || 12}
              disabled={!data}
              placeholder="hunter2"
            />

            <div className="flex-1" />

            {typeof errors === "string" && (
              <p className="text-red-500">{errors}</p>
            )}

            <button
              type="submit"
              className="action-button mt-1"
              disabled={!(data && isValid)}
            >
              <LockClosedIcon className="mr-1 h-5 w-5" />
              <span>Encrypt</span>
            </button>
          </Form>
        </Panel>
      )}
    </Formik>
  )
}
