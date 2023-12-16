"use client";

import QrCodeTestPanel from "./QrCodeTestPanel";
import TextTestPanel from "./TextTestPanel";

export default function TestSection() {
  return (
    <main className="bg-gray-50 min-h-screen w-full flex flex-col items-center p-5">
      <h1 className="text-4xl">UI Tests</h1>
      <TextTestPanel />
      <QrCodeTestPanel />
    </main>
  );
}
