import links from "@/common/links";
import { CssClass } from "@/common/utils";
import L from "@/components/FaqLink";
import { QnA, faqsHome } from "@/components/FaqContent";
import HangingQrCodes from "@/components/HangingQrCodes";
import { GitHubIcon } from "@/components/icons";
import { QrcodeIcon } from "@heroicons/react/outline";
import {
  CodeIcon,
  EyeOffIcon,
  FingerPrintIcon,
  LockClosedIcon,
  LockOpenIcon,
  PhotographIcon,
} from "@heroicons/react/solid";
import Image from "next/image";
import Link from "next/link";
import { SVGProps } from "react";

export default function Home() {
  return (
    <main className="relative bg-gray-50 min-h-screen w-full px-5 pt-12 sm:pt-16 pb-32 border-y-4 border-indigo-500 overflow-hidden">
      <HangingQrCodes />

      <section className="relative flex flex-col items-center text-center">
        <div className="relative z-10 flex flex-col items-center text-center">
          <QrcodeIcon className="w-20 h-20 text-indigo-500 mb-4" />

          <h1 className="text-3xl font-bold tracking-tight leading-loose text-gray-900 sm:text-4xl">
            Encrypt QR codes
            <br />
            for private 2FA backups
          </h1>
          <p className="mt-6 max-w-xl text-lg text-gray-600">
            Securely encrypt and decrypt QR codes used for two-factor
            authentication. Safely store encrypted QR codes as photos or print
            them out.
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

          <Link
            href={links.github.home}
            className="mt-5 mx-auto flex items-center rounded-md py-2 px-3 font-medium text-black hover:bg-gray-200 hover:bg-opacity-75"
          >
            <GitHubIcon
              className="h-5 w-5 -mt-0.5 mr-2 -ml-1"
              aria-hidden="true"
            />
            <span>Star on GitHub</span>
          </Link>
        </div>
      </section>

      <Image
        src="/images/ui-encrypt.png"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wEEEAAjACMAIwAjACUAIwAnACsAKwAnADYAOwA0ADsANgBQAEoAQwBDAEoAUAB6AFcAXQBXAF0AVwB6ALgAcwCHAHMAcwCHAHMAuACjAMUAoQCWAKEAxQCjASUA5gDMAMwA5gElAVMBHAENARwBUwGaAW8BbwGaAgQB6gIEAqMCowOLEQAjACMAIwAjACUAIwAnACsAKwAnADYAOwA0ADsANgBQAEoAQwBDAEoAUAB6AFcAXQBXAF0AVwB6ALgAcwCHAHMAcwCHAHMAuACjAMUAoQCWAKEAxQCjASUA5gDMAMwA5gElAVMBHAENARwBUwGaAW8BbwGaAgQB6gIEAqMCowOL/8IAEQgATwB4AwEiAAIRAQMRAf/EAC8AAAIDAQAAAAAAAAAAAAAAAAAEAQIDBQEBAQEBAQAAAAAAAAAAAAAAAAECAwT/2gAMAwEAAhADEAAAAGWBnqWGjJUakUX6auoFMs1gWubGAVNz0zRmJ8lwVaSi/Q53SBZmKTy1wiCly0EjIwdZM1nlaZ7yLsAETAlnqsBa5WusD4ARYCYCSAmAFMOlIjD4IU6QVJDFZzLpMNLmmdNwwew3wUNDTO83MS4XJOd//8QAMRAAAQMCAwcCBQQDAAAAAAAAAQACEQMhBBIUEzFBUVKSoRBhICIjY5EyNFNyRIGD/9oACAEBAAE/AMLhaNWiHvmZK0OH5O7locPyd3LQ4fk7uWhw/J3ctDh+Tu5aHD8ndy0tLVbK+XZytDheT+5aHDcn9y0OG5P7locNyf3LQ4bk/uWhw3J/csVhaNKiXsmZCwP7Zv8AZyDANzVFoyoCNwWRmYugyQAsreRQAG5f5/8AwVaNq6+4XCZDbmA0kATuU/VLS83vvXzva68CyBe2LAHdEp0ZTDpjksZ+07FhGPZQa1wgy70xE5LGDKfULQ0Z8t090PDDVGYyYlDcPTI7WZ4+XZRKrnI8mE2xJZ8wKpvLWuB32OZPNVpNiTFkBMZTaIlEgENZIvaBZYpj34bK0SZYh6YgSwCBvRLgKhcW2go1YDQ7NDTE7/Xiq2XO64kZZTAJaXfqg3BML6QBp52kACZv+ZTmENc4kC0crTaE6QzqFtyDAYJLpELgEPSrT2jYmFpxxdM7xCOHbLTNwZJj14rEZszgCbhCXggmLAray4ONxxiwQyCnLmOF7OIQkNAeIn3hPnODAOUcRNiuAXDfCB95UjmPh4quYcbyTuaiDDYEuNwJhRDrU3ZzciYUZxOch0QHLcRJmQfBV2gfN/bdIXAKQBdSz2/Cgch8PFVg41ItEcU1jz+r2/2m0KlnXJ32tJWwq/Kcj8wPVZClVY0ZkabyC4wTC4BDcr+yv7fDx+MqtV2LA7LN4Wv+0td9pHFVBY0PKOMcBJo+Vr/tLX/aU8fZDGOcJFHytW/+HyjjHNEml5VXEFjwwMm0rVP/AIPK1TzP0fKo1tswuyxdPYx7cr2zdabD9Hlaah0eVpqHQfytNQ6D+VpsP0eVpsP0efTTYfo8rTUOjytNQ6PKfRpVDLmXhabD9HlabD9HlMYxjYYIEr//xAAhEQACAgICAQUAAAAAAAAAAAABAgARA1ITIjEQEiBAQf/aAAgBAgEBPwB3cO3Y+ZyPsZyPsYrv27HxOR9jOR9jOR9jMJJSyf2E2SfUGr+CZWQUAPoqcddlNy8Opl4dTHKGvaCJeLUy8VjqZeLWGrNeJ//EABcRAQEBAQAAAAAAAAAAAAAAACEAEFD/2gAIAQMBAT8A4DM4zOf/2Q=="
        alt="Encrypt UI"
        width={1542}
        height={1018}
        className="mt-5 mx-auto w-full max-w-3xl rounded-2xl shadow"
      />

      <section className="mx-auto max-w-2xl mt-16 sm:mt-20 lg:mt-24 lg:max-w-4xl">
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
      </section>

      <section className="relative mt-20 mx-auto max-w-screen-2xl">
        <QrcodeIcon className="absolute w-48 h-48 left-10 top-1/4 rotate-6 text-indigo-500 opacity-5" />
        <QrcodeIcon className="absolute w-64 h-64 -right-5 top-1/2 -rotate-3 text-indigo-500 opacity-5" />
        <QrcodeIcon className="absolute w-52 h-52 -left-5 top-[80%] rotate-3 text-indigo-500 opacity-5" />

        <FaqLarge faqs={faqsHome} className="mx-auto max-w-2xl" />
      </section>
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
      "Encrypted QR code images can be saved or printed for account recovery if your 2FA device is lost.",
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
        <L href={links.github.home}>Review the code</L> and reuse it however you
        like. <L href={links.github.deploy}>Self-host</L> or run the{" "}
        <L href={links.github.local}>site locally</L> for fully offline
        encryption.{" "}
      </>
    ),
    icon: CodeIcon,
  },
  {
    name: "Advanced Security",
    description: (
      <>
        Encryption uses <L href={links.crypto.aesGcm}>AES-GCM and PBKDF2</L>{" "}
        with a salted 256-bit key. View the process in{" "}
        <L href={links.examples.typescript}>Typescript</L> or{" "}
        <L href={links.examples.python}>Python</L>.
      </>
    ),
    icon: FingerPrintIcon,
  },
];

function FaqLarge({ faqs, className }: { faqs: QnA[] } & CssClass) {
  return (
    <div className={className}>
      <h2 className="text-xl font-bold leading-10 tracking-tight text-gray-900">
        Frequently Asked Questions
      </h2>
      <dl>
        {faqs.map((faq, i) => (
          <div key={i}>
            <dt className="font-semibold text-slate-900">
              <div className="my-10 h-px bg-gradient-to-r from-slate-200/0 via-slate-200 to-slate-200/0" />
              {faq.question}
            </dt>
            <dd className="space-y-8 leading-8 mt-4">{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
