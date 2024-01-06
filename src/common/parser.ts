export interface EncryptedQRData {
  iv: string
  salt: string
  cipherText: string
  vers: string
  hint: string
  date: string
}

export function parseEncryptedQRDataString(encryptedDataString: string) {
  try {
    let encryptedData
    try {
      encryptedData = JSON.parse(encryptedDataString)
    } catch (error) {
      console.info("Could not parse JSON:", encryptedDataString)
      throw new Error("Data is not valid JSON")
    }
    return parseEncryptedQrData(encryptedData)
  } catch (error) {
    console.info(error)
    throw new Error("Data is unencrypted or in the wrong format")
  }
}

function parseEncryptedQrData(data: EncryptedQRData): EncryptedQRData {
  if (!(data && typeof data === "object"))
    throw new Error("Data is not a valid object")

  if (!data.vers) data.vers = "v0" // Default vers for old codes

  return {
    iv: parseStringFromObj("iv", data),
    salt: parseStringFromObj("salt", data),
    cipherText: parseStringFromObj("cipherText", data),
    vers: parseStringFromObj("vers", data),
    hint: parseStringFromObj("hint", data),
    date: parseStringFromObj("date", data),
  }
}

function parseStringFromObj<T>(propertyName: keyof T, data: T): string {
  return parseString(propertyName as string, data[propertyName] as string)
}

function parseString(name: string, value: any, minLength = 0): string {
  if (!isValidString(value)) throw new Error(`'${name}' is not a valid string`)
  if (value.length < minLength)
    throw new Error(`'${name}' must be at least ${minLength} chars long`)
  return value
}

function isValidString(value: any, minLength = 0): value is string {
  return value && typeof value === "string" && value.trim().length >= minLength
}
