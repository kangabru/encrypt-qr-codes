import {
  hrefEncryptionAlgo,
  hrefExamplePython,
  hrefExampleTypescript,
  hrefGithub,
  hrefLocalHost,
  hrefSelfHost,
} from "@/common/links";
import { Children } from "@/common/utils";
import { QrcodeIcon } from "@heroicons/react/outline";
import {
  CodeIcon,
  EyeOffIcon,
  FingerPrintIcon,
  LockClosedIcon,
  LockOpenIcon,
  PhotographIcon,
} from "@heroicons/react/solid";
import Link from "next/link";
import { SVGProps } from "react";

export default function Home() {
  return (
    <main className="bg-gray-50 min-h-screen w-full flex flex-col items-center p-5 py-12 sm:py-16">
      <Content />
    </main>
  );
}

interface Feature {
  name: string;
  description: string | JSX.Element;
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

const features: Feature[] = [
  {
    name: "Secure Backups",
    description:
      "Encrypted QR code images can be saved anywhere or printed out to recover accounts if your 2FA device is lost.",
    icon: PhotographIcon,
  },
  {
    name: "Privacy Focused",
    description:
      "No data is collected about you and all QR code scanning, encryption, and decryption is done on your device.",
    icon: EyeOffIcon,
  },
  {
    name: "MIT Open Source",
    description: (
      <>
        <L href={hrefGithub}>Review the code</L> and reuse it however you like.{" "}
        <L href={hrefSelfHost}>Self-host</L> or run the{" "}
        <L href={hrefLocalHost}>site locally</L> for fully offline encryption.{" "}
      </>
    ),
    icon: CodeIcon,
  },
  {
    name: "Advanced Security",
    description: (
      <>
        Encryption uses <L href={hrefEncryptionAlgo}>AES-GCM and PBKDF2</L> with
        a salted 256-bit key. View the process in{" "}
        <L href={hrefExampleTypescript}>Typescript</L> or{" "}
        <L href={hrefExamplePython}>Python</L>.
      </>
    ),
    icon: FingerPrintIcon,
  },
];

function Content() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="flex flex-col items-center text-center mx-auto max-w-2xl">
        <QrcodeIcon className="w-20 h-20 text-indigo-500 mb-4" />

        <h1 className="text-3xl font-bold tracking-tight leading-loose text-gray-900 sm:text-4xl">
          Encrypt QR codes
          <br />
          for private backups
        </h1>
        <p className="mt-6 max-w-xl text-lg text-gray-600">
          Securely encrypt and decrypt QR codes used for 2 factor
          authentication. Safely store encrypted QR codes in your photo gallery
          or print them out.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/encrypt"
            className="flex items-center rounded-md bg-indigo-600 px-3.5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <LockClosedIcon className="w-6 h-6 mr-2 -ml-1" />
            <span>Encrypt</span>
          </Link>
          <Link
            href="/decrypt"
            className="flex items-center rounded-md bg-indigo-600 px-3.5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <LockOpenIcon className="w-6 h-6 mr-2 -ml-1" />
            <span>Decrypt</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
          {features.map((feature) => (
            <div key={feature.name} className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                  <feature.icon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                {feature.name}
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">
                {feature.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function L(props: Children & { href: string }) {
  return <Link {...props} className="text-indigo-900 underline" />;
}
