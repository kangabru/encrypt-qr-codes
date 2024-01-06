import { Children } from "@/common/utils"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Encrypt QR Codes",
  description:
    "Securely encrypt and decrypt QR codes used for two-factor authentication. Safely store encrypted QR codes in your photo gallery or print them out.",
}

export default function RootLayout({ children }: Children) {
  return (
    <html lang="en">
      <body className="bg-gray-100 !font-mono">{children}</body>
    </html>
  )
}
