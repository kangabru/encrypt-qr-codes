"use client"

import AutogrowTextarea from "@/components/AutogrowTextarea"
import { useField } from "formik"

export default function TypeMode() {
  const [field] = useField<string>("qrCodeData")
  return (
    <AutogrowTextarea
      {...field}
      className="text-mono relative min-h-40 w-full break-words rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:ring focus:ring-indigo-200/50"
      placeholder={`Google Backup codes\n\nabz2j-18dn3\n1l42k-vme4q`}
    />
  )
}
