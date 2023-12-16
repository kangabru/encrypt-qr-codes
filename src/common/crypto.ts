import { EncryptedQRData } from "@/common/parser";
import { getDate } from "@/common/utils";

const ITERATIONS = 100000;
const SHA = "SHA-256";
const ALGORITHM = "AES-GCM";

export interface CryptoLib {
  getRandomValues: (array: Uint8Array) => Uint8Array;
  subtle: SubtleCrypto;
}

export async function encryptText(
  lib: CryptoLib,
  plainText: string,
  hint: string,
  password: string
): Promise<EncryptedQRData> {
  const salt = lib.getRandomValues(new Uint8Array(16));
  const iv = lib.getRandomValues(new Uint8Array(12));
  const derivedKey = await deriveKeyFromPassword(
    lib,
    password,
    salt,
    ITERATIONS,
    SHA
  );

  const encrypted = await lib.subtle.encrypt(
    { name: ALGORITHM, iv },
    derivedKey,
    new TextEncoder().encode(plainText)
  );

  return {
    iv: toText(iv),
    salt: toText(salt),
    cipherText: toText(encrypted),
    hint,
    date: getDate(),
  };
}

export async function decryptText(
  lib: CryptoLib,
  data: EncryptedQRData,
  password: string
): Promise<string> {
  const derivedKey = await deriveKeyFromPassword(
    lib,
    password,
    fromText(data.salt),
    ITERATIONS,
    SHA
  );

  const decrypted = await lib.subtle.decrypt(
    {
      name: ALGORITHM,
      iv: fromText(data.iv),
    },
    derivedKey,
    fromText(data.cipherText)
  );

  return new TextDecoder().decode(decrypted);
}

async function deriveKeyFromPassword(
  lib: CryptoLib,
  password: string,
  salt: Uint8Array,
  iterations: number,
  hash: string
): Promise<CryptoKey> {
  const importedKey = await lib.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const derivationParams = { name: "PBKDF2", salt, iterations, hash };
  const derivedKeyParams = { name: "AES-GCM", length: 256 };

  return await lib.subtle.deriveKey(
    derivationParams,
    importedKey,
    derivedKeyParams,
    false,
    ["encrypt", "decrypt"]
  );
}

function toText(data: ArrayBuffer) {
  return Array.from(new Uint8Array(data))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromText(text: string): Uint8Array {
  const matches = text.match(/.{1,2}/g) || [];
  const numbers = matches.map((byte) => parseInt(byte, 16));
  return new Uint8Array(numbers);
}
