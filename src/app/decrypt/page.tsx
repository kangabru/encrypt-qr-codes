/* eslint-disable @next/next/no-img-element */
"use client"

import { decryptText } from "@/common/crypto"
import { parseEncryptedQRDataString } from "@/common/parser"
import { generateQrCodeSvg } from "@/common/qrcode.browser"
import { getErrorMessage } from "@/common/utils"
import DisplayPanel, { QrCodeInfo } from "@/components/DisplayPanel"
import { faqsDecrypt } from "@/components/FaqContent"
import FaqList from "@/components/FaqList"
import Page from "@/components/Page"
import { Panel, SplitPanelSection } from "@/components/Panel"
import QrCodeImageInput from "@/components/fields/QrCodeImageField"
import { ImageFields } from "@/components/fields/QrCodeImageField/types"
import TextField from "@/components/fields/TextField"
import { LockOpenIcon } from "@heroicons/react/solid"
import { Form, Formik } from "formik"
import { useState } from "react"

export default function DecryptPage() {
  const [qrCodeInfo, setQrCodeInfo] = useState<QrCodeInfo | null>(null)
  const [isEncrypting, setIsEncrypting] = useState(false)
  return (
    <Page title="Encrypt QR Codes">
      <SplitPanelSection>
        <DecryptPanel
          setQrCodeInfo={setQrCodeInfo}
          setIsEncrypting={setIsEncrypting}
        />
        <DisplayPanel
          title="Decrypted QR Code"
          isLoading={isEncrypting}
          qrCodeInfo={qrCodeInfo}
          getFileName={(d) => `qr-decrypted-${d.date}-${d.hint}`}
          extraInfo={
            <>
              <p className="mb-1 mt-4 text-sm">Decrypted text</p>
              <p className="text-mono whitespace-pre-wrap break-words rounded-md border border-gray-300 bg-gray-50 p-2 text-sm shadow-sm">
                {qrCodeInfo?.dataDecrypted}
              </p>
            </>
          }
        />
      </SplitPanelSection>
      <FaqList faqs={faqsDecrypt} />
    </Page>
  )
}

interface Fields extends ImageFields {
  pass: string
}

async function decrypt({ qrCodeData, pass }: Fields): Promise<QrCodeInfo> {
  const dataEncryptedString = qrCodeData
  const dataEncrypted = parseEncryptedQRDataString(dataEncryptedString)

  console.info("Encrypted data:")
  console.table({ ...dataEncrypted })

  const dataDecrypted = await decryptText(crypto, dataEncrypted, pass)
  const svgHtml = generateQrCodeSvg(dataDecrypted, {
    title: dataEncrypted.hint,
  })

  console.info("Decrypted data:")
  console.table({ dataDecrypted })
  return { svgHtml, dataEncrypted, dataDecrypted }
}

function DecryptPanel(props: {
  setQrCodeInfo: (qr: QrCodeInfo | null) => void
  setIsEncrypting: (_: boolean) => void
}) {
  return (
    <Formik<Fields>
      initialValues={{ image: "", pass: "", qrCodeData: "" }}
      onSubmit={async (values, helpers) => {
        props.setQrCodeInfo(null)
        props.setIsEncrypting(true)
        await decrypt(values)
          .then(props.setQrCodeInfo)
          .catch((e) => {
            console.info(e)
            helpers.setErrors(getErrorMessage(e))
          })
        props.setIsEncrypting(false)
      }}
    >
      {({ isValid, errors, values: { qrCodeData: data } }) => (
        <Panel
          title="Decrypt a QR Code"
          hasError={typeof errors === "string"}
          icon={<LockOpenIcon className="-mt-0.5 mr-2 h-6 w-6 text-gray-300" />}
        >
          <Form className="flex flex-1 flex-col space-y-4">
            <QrCodeImageInput
              demoSrc="/demo/qr-code-encrypted.png"
              demoDescription="Password is 'pass-1234567890'"
            />

            <TextField
              name="pass"
              label="Password"
              type="password"
              description="Used to encrypt the QR code. Unrecoverable if lost."
              minLength={1}
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
              <LockOpenIcon className="mr-1 h-5 w-5" />
              <span>Decrypt</span>
            </button>
          </Form>
        </Panel>
      )}
    </Formik>
  )
}
