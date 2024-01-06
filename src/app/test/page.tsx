"use client"

import QrCodeTestPanel from "./QrCodeTestPanel"
import TextTestPanel from "./TextTestPanel"

export default function TestSection() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-gray-50 p-5">
      <h1 className="text-4xl">UI Tests</h1>
      <TextTestPanel />
      <QrCodeTestPanel />
    </main>
  )
}
