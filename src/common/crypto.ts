import { EncryptedQRData } from "@/common/parser"
import { getDate } from "@/common/utils"

const version = "v1" // ID to support older QR codes in case we update the encryption algo

const SHA = "SHA-256"
const ALGORITHM = "AES-GCM"

// https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#password-hashing-algorithms
const ITERATIONS: Record<string, number> = {
  v0: 100000,
  v1: 600000,
}

// We pass in the deps so we can target the browser, node, and tests
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
    ITERATIONS[version ?? "v0"],
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
    vers: version,
    hint,
    date: getDate(),
  }
}

export async function decryptText(
  lib: CryptoLib,
  data: EncryptedQRData & Partial<Pick<EncryptedQRData, "vers">>,
  password: string,
): Promise<string> {
  const derivedKey = await deriveKeyFromPassword(
    lib,
    password,
    dehexify(data.salt),
    ITERATIONS[data.vers] ?? ITERATIONS["v0"],
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
  if (typeof iterations !== "number" && iterations < 1000)
    throw new Error("Iterations not provided")

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
