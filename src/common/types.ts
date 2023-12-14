import { z } from "zod";

export type EncryptedQRData = z.infer<typeof schemaEncryptedQRData>;
export const schemaEncryptedQRData = z.object({
  iv: z.string(),
  salt: z.string(),
  cipherText: z.string(),
  hint: z.string(),
  date: z.string(),
});
