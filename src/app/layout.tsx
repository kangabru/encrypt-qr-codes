import { Children, join } from "@/common/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Encrypt QR Codes",
  description:
    "Securely encrypt and decrypt QR codes used for two-factor authentication. Safely store encrypted QR codes in your photo gallery or print them out.",
};

export default function RootLayout({ children }: Children) {
  return (
    <html lang="en">
      <body className={join(inter.className, "!font-mono")}>{children}</body>
    </html>
  );
}
