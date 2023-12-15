import { decryptText, encryptText } from "@/common/crypto";
import {
  generateQrCodePng,
  readQrCodeBitmap,
  readQrCodePng,
} from "@/common/qrcode";
import { EncryptedQRData } from "@/common/types";
import crypto from "crypto";
import { mkdirSync, writeFileSync } from "fs";
import jimp from "jimp";
import { join } from "path";
import { TextDecoder, TextEncoder } from "util";

const TEST_DIR = "./.test";

beforeAll(() => {
  // @ts-ignore
  global.TextEncoder = TextEncoder;
  // @ts-ignore
  global.TextDecoder = TextDecoder;

  mkdirSync(TEST_DIR, { recursive: true });
});

test("Read QR code", async () => {
  const image = await jimp.read("src/tests/assets/qrcode-example.png");
  const plainText = await readQrCodeBitmap(image.bitmap);
  expect(plainText).toEqual("super-secret-message");
});

test("Generate QR code", async () => {
  const secret = `super-secret-message`;

  const qrCodePng = await generateQrCodePng(secret);

  const image = await jimp.read(qrCodePng);
  const plainText = await readQrCodeBitmap(image.bitmap);
  expect(plainText).toEqual(secret);
});

test("Generate QR code file", async () => {
  const secret = `super-extra-secret-message`;

  const filePath = join(TEST_DIR, "generate-qrcode-test.png");
  writeFileSync(filePath, await generateQrCodePng(secret));

  const image = await jimp.read(filePath);
  const plainText = await readQrCodeBitmap(image.bitmap);
  expect(plainText).toEqual(secret);
});

test("Encrypt QR code", async () => {
  const secret2fa = `super-secret-2fa-code`;
  const password = `password-12345`;

  // This represents a QR code from a 2FA app
  const qrCodeWithSecret2fa = await generateQrCodePng(secret2fa);

  // Setup dependencies
  const getRandomValues = (array: Uint8Array) => array.map((_, i) => i);
  const cryptoMod = { ...crypto, getRandomValues };

  // Encrypt the QR code
  const plainTextInput = await readQrCodePng(qrCodeWithSecret2fa);
  expect(plainTextInput).toEqual(secret2fa);

  const cipherTextInput = await encryptText(
    cryptoMod,
    plainTextInput,
    "hint",
    password
  );
  const qrCodeEncrypted = await generateQrCodePng(
    JSON.stringify(cipherTextInput)
  );

  // Decrypt the QR code
  const cipherTextOutput = await readQrCodePng(qrCodeEncrypted).then(
    (d) => JSON.parse(d) as EncryptedQRData
  );
  const plainTextOutput = await decryptText(
    cryptoMod,
    cipherTextOutput,
    password
  );

  // Test inputs
  expect(cipherTextInput.hint).toEqual("hint");
  expect(cipherTextInput.iv).toEqual("000102030405060708090a0b");
  expect(cipherTextInput.salt).toEqual("000102030405060708090a0b0c0d0e0f");
  expect(cipherTextInput.cipherText).toEqual(
    "a108e150e5fa3dfea7f6273c3f99f1467dde8eabb8616d836a29a7a6e00eebc7919684e2de"
  );

  // Test outputs
  expect(cipherTextOutput.hint).toEqual("hint");
  expect(cipherTextOutput.iv).toEqual("000102030405060708090a0b");
  expect(cipherTextOutput.salt).toEqual("000102030405060708090a0b0c0d0e0f");
  expect(cipherTextOutput.cipherText).toEqual(
    "a108e150e5fa3dfea7f6273c3f99f1467dde8eabb8616d836a29a7a6e00eebc7919684e2de"
  );
  expect(plainTextOutput).toEqual(secret2fa); // The most important one
});
