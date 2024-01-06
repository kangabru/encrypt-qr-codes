import { EncryptedQRData } from "@/common/parser"
import { getDate } from "@/common/utils"

const ITERATIONS = 100000
const SHA = "SHA-256"
const ALGORITHM = "AES-GCM"

export interface CryptoLib {
  getRandomValues: (array: Uint8Array) => Uint8Array
  subtle: SubtleCrypto
}

export async function encryptText(
  lib: CryptoLib,
  plainText: string,
  hint: string,
  password: string,
): Promise<EncryptedQRData> {
  const salt = lib.getRandomValues(new Uint8Array(16))
  const derivedKey = await deriveKeyFromPassword(
    lib,
    password,
    salt,
    ITERATIONS,
    SHA,
  )

  const iv = lib.getRandomValues(new Uint8Array(12))
  const encrypted = await lib.subtle.encrypt(
    { name: ALGORITHM, iv },
    derivedKey,
    new TextEncoder().encode(plainText),
  )

  return {
    iv: hexify(iv),
    salt: hexify(salt),
    cipherText: hexify(encrypted),
    hint,
    date: getDate(),
  }
}

export async function decryptText(
  lib: CryptoLib,
  data: EncryptedQRData,
  password: string,
): Promise<string> {
  const derivedKey = await deriveKeyFromPassword(
    lib,
    password,
    dehexify(data.salt),
    ITERATIONS,
    SHA,
  )

  let decrypted
  try {
    decrypted = await lib.subtle.decrypt(
      {
        name: ALGORITHM,
        iv: dehexify(data.iv),
      },
      derivedKey,
      dehexify(data.cipherText),
    )
  } catch (error) {
    console.info(error)
    throw new Error("Could not decrypt the QR code. Is the password correct?")
  }

  return new TextDecoder().decode(decrypted)
}

async function deriveKeyFromPassword(
  lib: CryptoLib,
  password: string,
  salt: Uint8Array,
  iterations: number,
  hash: string,
): Promise<CryptoKey> {
  const importedKey = await lib.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  )

  const derivationParams = { name: "PBKDF2", salt, iterations, hash }
  const derivedKeyParams = { name: "AES-GCM", length: 256 }

  return await lib.subtle.deriveKey(
    derivationParams,
    importedKey,
    derivedKeyParams,
    false,
    ["encrypt", "decrypt"],
  )
}

function hexify(data: ArrayBuffer): string {
  return Buffer.from(data).toString("hex")
}

function dehexify(text: string): Uint8Array {
  return new Uint8Array(Buffer.from(text, "hex"))
}
