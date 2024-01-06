import { decryptText, encryptText } from "@/common/crypto"
import crypto from "crypto"
import { TextDecoder, TextEncoder } from "util"

beforeAll(() => {
  // @ts-ignore
  global.TextEncoder = TextEncoder
  // @ts-ignore
  global.TextDecoder = TextDecoder
})

test("Encrypt text", async () => {
  const plainText = `message-12345`
  const password = `password-12345`

  const getRandomValues = (array: Uint8Array) => array.map((_, i) => i)
  const cryptoMod = { ...(crypto as any), getRandomValues }

  const qrCodeDataEncrypted = await encryptText(
    cryptoMod as any,
    plainText,
    "hint",
    password,
  )
  expect(qrCodeDataEncrypted.hint).toEqual("hint")
  expect(qrCodeDataEncrypted.iv).toEqual("000102030405060708090a0b")
  expect(qrCodeDataEncrypted.salt).toEqual("000102030405060708090a0b0c0d0e0f")
  expect(qrCodeDataEncrypted.vers).toEqual("v1")
  expect(qrCodeDataEncrypted.cipherText).toEqual(
    "ac9a7cf1c5807482c287e2184fd70b08ab20ce880d34e0f32c1f7ba60e",
  )
})

test("Decrypt text v0", async () => {
  const plainText = `message-12345`
  const password = `password-12345`

  const qrCodeDataEncrypted = {
    date: "",
    hint: "",
    iv: "000102030405060708090a0b",
    salt: "000102030405060708090a0b0c0d0e0f",
    cipherText: "bf18e246f6b02bb6f5b6717c27cc32f2d32b9ada955256531dd7e7ee96",
  }
  const qrCodeDataDecrypted = await decryptText(
    crypto as any,
    qrCodeDataEncrypted as any, // imitate an older code without the 'vers' prop
    password,
  )
  expect(qrCodeDataDecrypted).toEqual(plainText)
})

test("Decrypt text v1", async () => {
  const plainText = `message-12345`
  const password = `password-12345`

  const qrCodeDataEncrypted = {
    date: "",
    hint: "",
    vers: "v1",
    iv: "000102030405060708090a0b",
    salt: "000102030405060708090a0b0c0d0e0f",
    cipherText: "ac9a7cf1c5807482c287e2184fd70b08ab20ce880d34e0f32c1f7ba60e",
  }
  const qrCodeDataDecrypted = await decryptText(
    crypto as any,
    qrCodeDataEncrypted,
    password,
  )
  expect(qrCodeDataDecrypted).toEqual(plainText)
})

test("Decrypt text bad version", async () => {
  const password = `password-12345`

  const qrCodeDataEncrypted = {
    date: "",
    hint: "",
    vers: "version-doesnt-exist",
    iv: "000102030405060708090a0b",
    salt: "000102030405060708090a0b0c0d0e0f",
    cipherText: "ac9a7cf1c5807482c287e2184fd70b08ab20ce880d34e0f32c1f7ba60e",
  }

  try {
    await decryptText(crypto as any, qrCodeDataEncrypted, password)
    fail("Error wasn't thrown")
  } catch (error: any) {
    expect(error.message).toContain("Could not decrypt the QR code.")
  }
})

test("Decrypt text fail", async () => {
  const password = `password-12345`

  const qrCodeDataEncrypted = {
    date: "123",
    hint: "123",
    vers: "vers",
    iv: "012345678901234567890123456789",
    salt: "123123123123123",
    cipherText: "123123123123123",
  }
  try {
    await decryptText(crypto as any, qrCodeDataEncrypted, password)
    fail("Error wasn't thrown")
  } catch (error: any) {
    expect(error.message).toContain("Could not decrypt the QR code.")
  }
})

test("Encrypt and decrypt text", async () => {
  const plainText = `message-${crypto.randomUUID()}`
  const password = `password-${crypto.randomUUID()}`

  const qrCodeDataEncrypted = await encryptText(
    crypto as any,
    plainText,
    "",
    password,
  )
  const qrCodeDataDecrypted = await decryptText(
    crypto as any,
    qrCodeDataEncrypted,
    password,
  )
  expect(qrCodeDataDecrypted).toEqual(plainText)
})
