/* eslint-disable @next/next/no-img-element */
"use client";

import { decryptText, encryptText } from "@/common/crypto";
import { parseEncryptedQRDataString } from "@/common/parser";
import { readQrCodeBitmap } from "@/common/qrcode";
import { generateQrCodeSvg, getBitmapFromSvg } from "@/common/qrcode.browser";
import { QrCodeIcon } from "@/components/icons";
import { Panel, SplitPanelSection } from "@/components/panels";
import { useCallback, useState } from "react";
import { svgToPng } from "../download";

export default function QrCodeTestPanel() {
  const [messages, setMessages] = useState<string[]>([]);
  const addMessage = useCallback(
    (msg: string) =>
      setMessages((msgs) => [...msgs, `${msgs.length + 1}: ${msg}`]),
    []
  );

  const [dataUrl, setDataUrl] = useState<string>();

  const encryptDecryptTest = async () => {
    setMessages([]);
    setDataUrl(undefined);

    try {
      const pass = `password:${crypto.randomUUID().slice(0, 17)}`;
      const hint = pass; // Caution: for testing only! This exposes the password in plaintext
      const plainText = `my-secret-data:${crypto.randomUUID()}`;
      addMessage(`Encrypting: \n\tText: '${plainText}' \n\tPass: '${pass}'`);

      // Encrypt
      const dataEncypted = await encryptText(crypto, plainText, hint, pass);
      addMessage(`Encrypted text:\n${JSON.stringify(dataEncypted, null, 4)}`);

      const svgSrc = generateQrCodeSvg(
        JSON.stringify(dataEncypted),
        dataEncypted.hint,
        dataEncypted.date
      );
      const pngSrc = await svgToPng(svgSrc);
      setDataUrl(pngSrc);
      const qrCodeEncrypted = await getBitmapFromSvg(svgSrc);
      addMessage(`Generated QR code from encrypted data`);

      // Decrypt
      const qrCodeData = await readQrCodeBitmap(qrCodeEncrypted);
      const encryptedData = parseEncryptedQRDataString(qrCodeData);
      addMessage(
        `Read encrypted QR code:\n${JSON.stringify(dataEncypted, null, 4)}`
      );

      const decryptedData = await decryptText(crypto, encryptedData, pass);
      addMessage(`Decrypted text: ${decryptedData}`);

      addMessage("Success");
    } catch (error: any) {
      console.error(error);
      addMessage(`Error: ${error.message}`);
    }
  };

  return (
    <SplitPanelSection title="QR Code Generate/Read Test">
      <Panel title="Encrypt a QR Code">
        <form
          action={encryptDecryptTest}
          className="space-y-4 flex flex-col h-full"
        >
          <div className="flex-1 grid place-items-center w-full h-full text-gray-200">
            {dataUrl ? (
              <img
                src={dataUrl}
                className="w-full max-w-lg aspect-square"
                alt=""
              />
            ) : (
              <QrCodeIcon className="max-h-40" />
            )}
          </div>

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
        />
      </Panel>
    </SplitPanelSection>
  );
}