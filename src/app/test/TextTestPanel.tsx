"use client"

import { decryptText, encryptText } from "@/common/crypto"
import { getErrorMessage } from "@/common/utils"
import { Panel, SplitPanelSection } from "@/components/Panel"
import { useCallback, useState } from "react"

export default function TextTestPanel() {
  const [messages, setMessages] = useState<string[]>([])
  const addMessage = useCallback(
    (msg: string) =>
      setMessages((msgs) => [...msgs, `${msgs.length + 1}: ${msg}`]),
    [],
  )

  const encryptDecryptTest = async (e: FormData) => {
    const plainText = e.get("text") as string
    const password = e.get("encrypt-password") as string

    try {
      setMessages([])
      addMessage(`Encrypting text '${plainText}' with password '${password}'`)

      const qrCodeDataEncrypted = await encryptText(
        crypto,
        plainText,
        "",
        password,
      )
      addMessage(`Encrypted:\n${JSON.stringify(qrCodeDataEncrypted, null, 4)}`)

      const qrCodeDataDecrypted = await decryptText(
        crypto,
        qrCodeDataEncrypted,
        password,
      )
      addMessage(`Decrypted: ${qrCodeDataDecrypted}`)
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
          <label className="block">
            <span className="text-gray-700">Text</span>
            <input
              name="text"
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200/50 focus:ring-opacity-50"
              placeholder="my-secret-text"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Password</span>
            <input
              name="encrypt-password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200/50 focus:ring-opacity-50"
              placeholder="my-secret-password"
            />
          </label>

          <div className="flex-1" />

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
