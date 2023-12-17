export interface EncryptedQRData {
  iv: string;
  salt: string;
  cipherText: string;
  hint: string;
  date: string;
}

export function parseEncryptedQRDataString(encryptedDataString: string) {
  try {
    let encryptedData;
    try {
      encryptedData = JSON.parse(encryptedDataString);
    } catch (error) {
      console.info("Could not parse JSON:", encryptedDataString);
      throw new Error("Data is not valid JSON");
    }
    return parseEncryptedQrData(encryptedData);
  } catch (error) {
    console.info(error);
    throw new Error("Data is unencrypted or in the wrong format");
  }
}

export function parseEncryptedQrData(data: EncryptedQRData): EncryptedQRData {
  if (!(data && typeof data === "object"))
    throw new Error("Data is not a valid object");

  return {
    iv: parseStringFromObj("iv", data),
    salt: parseStringFromObj("salt", data),
    cipherText: parseStringFromObj("cipherText", data),
    hint: parseStringFromObj("hint", data),
    date: parseStringFromObj("date", data),
  };
}

export function parseStringFromObj<T>(propertyName: keyof T, data: T): string {
  return parseString(propertyName as string, data[propertyName] as string);
}

export function parseString(name: string, value: any, minLength = 0): string {
  if (!isValidString(value)) throw new Error(`'${name}' is not a valid string`);
  if (value.length < minLength)
    throw new Error(`'${name}' must be at least ${minLength} chars long`);
  return value;
}

export function isValidString(value: any, minLength = 0): value is string {
  return value && typeof value === "string" && value.trim().length >= minLength;
}

export function parseFile(name: string, value: any, error?: string): File {
  if (!(value instanceof File))
    throw new Error(error ?? `'${name}' is not a valid file`);
  return value;
}
