import { decryptText, encryptText } from "@/common/crypto";
import crypto from "crypto";
import { TextDecoder, TextEncoder } from "util";

beforeAll(() => {
  // @ts-ignore
  global.TextEncoder = TextEncoder;
  // @ts-ignore
  global.TextDecoder = TextDecoder;
});

test("Encrypt text", async () => {
  const plainText = `message-12345`;
  const password = `password-12345`;

  const getRandomValues = (array: Uint8Array) => array.map((_, i) => i);
  const cryptoMod = { ...crypto, getRandomValues };

  const qrCodeDataEncrypted = await encryptText(
    cryptoMod,
    plainText,
    "hint",
    password
  );
  expect(qrCodeDataEncrypted.hint).toEqual("hint");
  expect(qrCodeDataEncrypted.iv).toEqual("000102030405060708090a0b");
  expect(qrCodeDataEncrypted.salt).toEqual("000102030405060708090a0b0c0d0e0f");
  expect(qrCodeDataEncrypted.cipherText).toEqual(
    "bf18e246f6b02bb6f5b6717c27cc32f2d32b9ada955256531dd7e7ee96"
  );
});

test("Decrypt text", async () => {
  const plainText = `message-12345`;
  const password = `password-12345`;

  const qrCodeDataEncrypted = {
    date: "",
    hint: "",
    iv: "000102030405060708090a0b",
    salt: "000102030405060708090a0b0c0d0e0f",
    cipherText: "bf18e246f6b02bb6f5b6717c27cc32f2d32b9ada955256531dd7e7ee96",
  };
  const qrCodeDataDecrypted = await decryptText(
    crypto,
    qrCodeDataEncrypted,
    password
  );
  expect(qrCodeDataDecrypted).toEqual(plainText);
});

test("Decrypt text fail", async () => {
  const plainText = `message-12345`;
  const password = `password-12345`;

  const qrCodeDataEncrypted = {
    date: "123",
    hint: "123",
    iv: "012345678901234567890123456789",
    salt: "123123123123123",
    cipherText: "123123123123123",
  };
  try {
    await decryptText(crypto, qrCodeDataEncrypted, password);
    fail("Error wasn't thrown");
  } catch (error: any) {
    expect(error.message).toContain("Could not decrypt the QR code.");
  }
});

test("Encrypt and decrypt text", async () => {
  const plainText = `message-${crypto.randomUUID()}`;
  const password = `password-${crypto.randomUUID()}`;

  const qrCodeDataEncrypted = await encryptText(
    crypto,
    plainText,
    "",
    password
  );
  const qrCodeDataDecrypted = await decryptText(
    crypto,
    qrCodeDataEncrypted,
    password
  );
  expect(qrCodeDataDecrypted).toEqual(plainText);
});
