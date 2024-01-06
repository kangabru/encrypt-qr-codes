import { decryptText, encryptText } from "@/common/crypto"
import { EncryptedQRData } from "@/common/parser"
import {
  generateQrCodePng,
  readQrCodeBitmap,
  readQrCodePng,
} from "@/common/qrcode.node"
import crypto from "crypto"
import { mkdirSync, writeFileSync } from "fs"
import jimp from "jimp"
import { join } from "path"
import { TextDecoder, TextEncoder } from "util"

const TEST_DIR = "./.test"

const cryptoMod = {
  ...crypto,
  getRandomValues: (array: Uint8Array) => array.map((_, i) => i),
}

beforeAll(() => {
  // @ts-ignore
  global.TextEncoder = TextEncoder
  // @ts-ignore
  global.TextDecoder = TextDecoder

  mkdirSync(TEST_DIR, { recursive: true })
})

test("Read QR code", async () => {
  const image = await jimp.read("src/tests/assets/qrcode-example.png")
  const plainText = await readQrCodeBitmap(image.bitmap)
  expect(plainText).toEqual("super-secret-message")
})

/**
 * Test fails due to using a different QR reader on node vs browser.
 *
 * The 'zxing' library can't read this while 'qr-scanner' can - however it uses web workers which break jest during testing.
 *
 * test("Read failing QR code", async () => {
 *   const image = await jimp.read("src/tests/assets/qrcode-failing-example.png");
 *   const plainText = await readQrCodeBitmap(image.bitmap);
 *   expect(plainText).toEqual("super-secret-message");
 * });
 */

test("Decrypt QR code", async () => {
  const image = await jimp.read("src/tests/assets/qrcode-encrypted-example.png")
  const dataEncrypted: EncryptedQRData = JSON.parse(
    await readQrCodeBitmap(image.bitmap),
  )
  const dataDecrypted = await decryptText(
    cryptoMod as any,
    dataEncrypted,
    "password-12345",
  )

  expect(dataEncrypted.hint).toEqual("Test")
  expect(dataEncrypted.date).toEqual("2023-12-15")
  expect(dataEncrypted.iv).toEqual("cd127c30096254d2441fb161")
  expect(dataEncrypted.salt).toEqual("8cb33770e04a42569770fe8ff7b82a6b")
  expect(dataEncrypted.cipherText).toEqual(
    "a044246c7cef69a3e9f9f6d4f7fc5e7a5d71492f9ca4ac4c2ea2cbf9184d52f49a356504",
  )
  expect(dataDecrypted).toEqual("super-secret-message")
})

test("Generate QR code", async () => {
  const secret = `super-secret-message`

  const qrCodePng = await generateQrCodePng(secret)

  const image = await jimp.read(qrCodePng)
  const plainText = await readQrCodeBitmap(image.bitmap)
  expect(plainText).toEqual(secret)
})

test("Generate QR code file", async () => {
  const secret = `super-extra-secret-message`

  const filePath = join(TEST_DIR, "generate-qrcode-test.png")
  writeFileSync(filePath, await generateQrCodePng(secret))

  const image = await jimp.read(filePath)
  const plainText = await readQrCodeBitmap(image.bitmap)
  expect(plainText).toEqual(secret)
})

test("Encrypt QR code", async () => {
  const secret2fa = `super-secret-2fa-code`
  const password = `password-12345`

  // This represents a QR code from a 2FA app
  const qrCodeWithSecret2fa = await generateQrCodePng(secret2fa)

  // Encrypt the QR code
  const plainTextInput = await readQrCodePng(qrCodeWithSecret2fa)
  expect(plainTextInput).toEqual(secret2fa)

  const cipherTextInput = await encryptText(
    cryptoMod as any,
    plainTextInput,
    "hint",
    password,
  )
  const qrCodeEncrypted = await generateQrCodePng(
    JSON.stringify(cipherTextInput),
  )

  // Decrypt the QR code
  const cipherTextOutput = await readQrCodePng(qrCodeEncrypted).then(
    (d) => JSON.parse(d) as EncryptedQRData,
  )
  const plainTextOutput = await decryptText(
    cryptoMod as any,
    cipherTextOutput,
    password,
  )

  // Test inputs
  expect(cipherTextInput.hint).toEqual("hint")
  expect(cipherTextInput.iv).toEqual("000102030405060708090a0b")
  expect(cipherTextInput.salt).toEqual("000102030405060708090a0b0c0d0e0f")
  expect(cipherTextInput.vers).toEqual("v1")
  expect(cipherTextInput.cipherText).toEqual(
    "b28a7fe7d6ca62ca90c7b4585701d30564d4209c633f81910339f83fcaff1d4cdc31b7f361",
  )

  // Test outputs
  expect(cipherTextOutput.hint).toEqual("hint")
  expect(cipherTextOutput.iv).toEqual("000102030405060708090a0b")
  expect(cipherTextOutput.salt).toEqual("000102030405060708090a0b0c0d0e0f")
  expect(cipherTextOutput.vers).toEqual("v1")
  expect(cipherTextOutput.cipherText).toEqual(
    "b28a7fe7d6ca62ca90c7b4585701d30564d4209c633f81910339f83fcaff1d4cdc31b7f361",
  )
  expect(plainTextOutput).toEqual(secret2fa) // The most important one
})
