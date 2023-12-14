import DecryptSection from "./decrypt";
import EncryptSection from "./encrypt";

export default function Home() {
  return (
    <main className="bg-gray-50 min-h-screen w-full flex flex-col items-center p-5">
      <h1 className="text-4xl">Encrypt and Backup 2FA QR Codes</h1>
      {/* <TestSection /> */}
      <EncryptSection />
      <DecryptSection />
    </main>
  );
}
