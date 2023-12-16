"use client";

import { decryptText, encryptText } from "@/common/crypto";
import { Panel, SplitPanelSection } from "@/components/panels";
import { useCallback, useState } from "react";

export default function TestSection() {
  return (
    <main className="bg-gray-50 min-h-screen w-full flex flex-col items-center p-5">
      <h1 className="text-4xl">UI Tests</h1>
      <TextTestPanel />
    </main>
  );
}

function TextTestPanel() {
  const [messages, setMessages] = useState<string[]>([]);
  const addMessage = useCallback(
    (msg: string) =>
      setMessages((msgs) => [...msgs, `${msgs.length + 1}: ${msg}`]),
    []
  );

  const encryptDecryptTest = async (e: FormData) => {
    const plainText = e.get("text") as string;
    const password = e.get("encrypt-password") as string;

    try {
      setMessages([]);
      addMessage(`Encrypting text '${plainText}' with password '${password}'`);

      const qrCodeDataEncrypted = await encryptText(
        crypto,
        plainText,
        "",
        password
      );
      addMessage(`Encrypted:\n${JSON.stringify(qrCodeDataEncrypted, null, 4)}`);

      const qrCodeDataDecrypted = await decryptText(
        crypto,
        qrCodeDataEncrypted,
        password
      );
      addMessage(`Decrypted: ${qrCodeDataDecrypted}`);
      addMessage("Success");
    } catch (error) {
      console.error(error);
      addMessage("Error: ${error}");
    }
  };

  return (
    <SplitPanelSection title="Encrypt/Decrypt Test">
      <Panel title="Encrypt a QR Code">
        <form
          action={encryptDecryptTest}
          className="space-y-4 flex flex-col h-full"
        >
          <label className="block">
            <span className="text-gray-700">Text</span>
            <input
              name="text"
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="my-secret-text"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Password</span>
            <input
              name="encrypt-password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="my-secret-password"
            />
          </label>

          <div className="flex-1" />

          <button
            type="submit"
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 bg-blue-500 text-white disabled:opacity-50"
          >
            Encrypt/Decrypt
          </button>
        </form>
      </Panel>
      <Panel title="Logs">
        <textarea
          className="h-full space-y-4 p-4 overflow-scroll flex flex-col bg-gray-50 border border-gray-200 rounded font-mono text-sm"
          value={messages.join("\n\n")}
          disabled
        >
          {/* {messages.map((msg, i) => (
            <p key={i}>{msg}</p>
          ))} */}
        </textarea>
      </Panel>
    </SplitPanelSection>
  );
}