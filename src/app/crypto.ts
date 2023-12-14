"use client";

import { getDate } from "@/common/utils";
import { EncryptedQRData } from "./qrcode";

export async function encryptText(
  plainText: string,
  hint: string,
  password: string
): Promise<EncryptedQRData> {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const derivedKey = await deriveKeyFromPassword(
    password,
    salt,
    100000,
    "SHA-256"
  );

  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    derivedKey,
    new TextEncoder().encode(plainText)
  );

  const toText = (data: ArrayBuffer) =>
    Array.from(new Uint8Array(data))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

  return {
    iv: toText(iv),
    salt: toText(salt),
    cipherText: toText(encrypted),
    hint,
    date: getDate(),
  };
}

async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array,
  iterations: number,
  hash: string
): Promise<CryptoKey> {
  const passwordBuffer = new TextEncoder().encode(password);

  const importedKey = await window.crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const derivationParams = {
    name: "PBKDF2",
    salt: salt,
    iterations: iterations,
    hash: hash,
  };

  const derivedKeyParams = {
    name: "AES-GCM",
    length: 256,
  };

  // Derive the key
  const derivedKey = await window.crypto.subtle.deriveKey(
    derivationParams,
    importedKey,
    derivedKeyParams,
    false,
    ["encrypt", "decrypt"]
  );

  return derivedKey;
}
