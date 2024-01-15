"use client"

import { useField } from "formik"

export default function TypeMode() {
  const [field] = useField<string>("qrCodeData")
  return (
    <textarea
      {...field}
      rows={5}
      className="text-mono relative h-40 w-full break-words rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:ring focus:ring-indigo-200/50"
    />
  )
}
