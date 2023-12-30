import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-gray-50 min-h-screen w-full flex flex-col items-center p-5">
      <h1 className="text-4xl">Encrypt and Backup 2FA QR Codes</h1>
      {/* <TestSection /> */}
      <Link href="/encrypt" className="">
        Encrypt
      </Link>
      <Link href="/decrypt" className="">
        Decrypt
      </Link>
    </main>
  );
}
