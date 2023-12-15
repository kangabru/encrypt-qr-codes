"use client";

import { useState } from "react";
import { decryptText, encryptText } from "@/common/crypto";

export default function TestSection() {
  const [success, setSuccess] = useState<boolean | null>(null);
  const encryptDecryptTest = async (e: FormData) => {
    const plainText = e.get("text") as string;
    const password = e.get("encrypt-password") as string;

    try {
      setSuccess(null);
      console.log("Encrypting", plainText, "with pass", password);

      const qrCodeDataEncrypted = await encryptText(
        crypto,
        plainText,
        "",
        password
      );
      console.log("Encrypted", qrCodeDataEncrypted);

      const qrCodeDataDecrypted = await decryptText(
        crypto,
        qrCodeDataEncrypted,
        password
      );
      console.log("Decrypted", qrCodeDataDecrypted);

      setSuccess(qrCodeDataDecrypted === plainText);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="max-w-screen-lg w-full grid grid-cols-2 gap-4 p-4">
      <h2 className="text-xl col-span-2">Encrypt/Decrypt Test</h2>
      <div className="bg-white rounded-lg border-t-4 border-blue-200 shadow p-4 flex flex-col">
        <h2 className="text-lg mb-4">Encrypt a QR Code</h2>

        <form action={encryptDecryptTest} className="space-y-4 flex flex-col">
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

          <button
            type="submit"
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 bg-blue-500 text-white disabled:opacity-50"
          >
            Encrypt/Decrypt
          </button>

          {success === true && <p>Success!</p>}
          {success === false && <p>Failed. See console logs for details.</p>}
        </form>
      </div>
    </section>
  );
}
