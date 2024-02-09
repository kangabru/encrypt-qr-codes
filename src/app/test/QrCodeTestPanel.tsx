/* eslint-disable @next/next/no-img-element */
"use client"

import { decryptText, encryptText } from "@/common/crypto"
import { parseEncryptedQRDataString } from "@/common/parser"
import { generateQrCodeSvg, readQrCode } from "@/common/qrcode.browser"
import { getErrorMessage } from "@/common/utils"
import { Panel, SplitPanelSection } from "@/components/Panel"
import { QrcodeIcon } from "@heroicons/react/outline"
import { useCallback, useState } from "react"
import { svgToPngDataUrl } from "../download"

export default function QrCodeTestPanel() {
  const [messages, setMessages] = useState<string[]>([])
  const addMessage = useCallback(
    (msg: string) =>
      setMessages((msgs) => [...msgs, `${msgs.length + 1}: ${msg}`]),
    [],
  )

  const [dataUrl, setDataUrl] = useState<string>()

  const encryptDecryptTest = async () => {
    setMessages([])
    setDataUrl(undefined)

    try {
      const pass = `password:${crypto.randomUUID().slice(0, 17)}`
      const hint = pass // Caution: for testing only! This exposes the password in plaintext
      const plainText = `my-secret-data:${crypto.randomUUID()}`
      addMessage(`Encrypting: \n\tText: '${plainText}' \n\tPass: '${pass}'`)

      // Encrypt
      const dataEncypted = await encryptText(crypto, plainText, hint, pass)
      addMessage(`Encrypted text:\n${JSON.stringify(dataEncypted, null, 4)}`)

      const svgSrc = generateQrCodeSvg(JSON.stringify(dataEncypted), {
        title: dataEncypted.hint,
        date: dataEncypted.date,
      })
      const pngSrc = await svgToPngDataUrl(svgSrc)
      setDataUrl(pngSrc)
      addMessage(`Generated QR code from encrypted data`)

      // Decrypt
      const qrCodeData = await readQrCode(pngSrc)
      const encryptedData = parseEncryptedQRDataString(qrCodeData)
      addMessage(
        `Read encrypted QR code:\n${JSON.stringify(dataEncypted, null, 4)}`,
      )

      const decryptedData = await decryptText(crypto, encryptedData, pass)
      addMessage(`Decrypted text: ${decryptedData}`)

      addMessage("Success")
    } catch (error: any) {
      console.error(error)
      addMessage(`Error: ${getErrorMessage(error)}`)
    }
  }

  return (
    <SplitPanelSection>
      <Panel title="Encrypt a QR Code">
        <form
          action={encryptDecryptTest}
          className="flex h-full flex-col space-y-4"
        >
          <div className="grid h-full w-full flex-1 place-items-center text-gray-200">
            {dataUrl ? (
              <img
                src={dataUrl}
                className="aspect-square w-full max-w-lg"
                alt=""
              />
            ) : (
              <QrcodeIcon className="max-h-40" />
            )}
          </div>

          <button type="submit" className="action-button">
            Encrypt/Decrypt
          </button>
        </form>
      </Panel>
      <Panel title="Logs">
        <textarea
          className="flex h-full flex-col space-y-4 overflow-scroll rounded border border-gray-200 bg-gray-50 p-4 text-sm"
          value={messages.join("\n\n")}
          disabled
        />
      </Panel>
    </SplitPanelSection>
  )
}
