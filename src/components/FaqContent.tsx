import links from "@/common/links"
import { Children } from "@/common/utils"
import { BulletPoints } from "@/components/BulletPoints"
import L from "@/components/FaqLink"
import { QrcodeIcon } from "@heroicons/react/outline"
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/solid"
import type { ReactNode } from "react"

export interface QnA {
  question: string | ReactNode
  answer: string | ReactNode
}

export const faqsCommon: QnA[] = [
  {
    question: "Who is this for?",
    answer:
      "Security concious people who want to backup their 2FA codes. You might already use a service like Authy but want extra redundancy and flexibility. The encrypted QR codes are just images that you can safely save in Whatsapp, a photo gallery, and even print them out.",
  },
  {
    question: "What is a QR code?",
    answer: (
      <p className="flex">
        <span>
          A QR (quick-response) code is a barcode that&apos;s easy to scan and
          contains useful data. They are blocky, black/white, square images
          which you usually scan when adding two-factor auth to an account.
        </span>
        <QrcodeIcon className="ml-2 h-28 w-28 flex-shrink-0 text-gray-700" />
      </p>
    ),
  },
  {
    question: "What is two-factor auth (2FA)?",
    answer: (
      <BulletPoints
        points={[
          "Two-factor authentication (2FA) helps protect your online accounts from being accessed by someone who has access to your password.",
          "You usually set up 2FA by scanning a QR code to link the service with an authenticator app on your phone. The app generates a random code every few seconds which you fill into the website when asked.",
          "By knowing your password and filling in the 2FA code, you verify two factors: something you know and something you have. This makes it much harder to hack an account even if someone knows your password.",
        ]}
      />
    ),
  },
  {
    question: "Why should I backup 2FA codes?",
    answer:
      "If you lose or break your 2FA device you could lose access to some accounts forever - even if you have the password. We often set up 2FA with our most important accounts so losing access could be a huge loss of data e.g. photos, emails, and documents. You should absolutely backup 2FA codes and in multiple places.",
  },
  {
    question: "What's wrong with Authy?",
    answer: (
      <BulletPoints
        points={[
          <>
            <L href={links.authy.home}>Authy</L> is a great authenticator app
            that can double as a backup by saving your 2FA codes for you.
            However, this is opt-in and you must now rely on a private service.
            If you lose access to Authy, you lose all of your 2FA codes.
          </>,
          <>
            One problem is that Authy is linked to your mobile phone number and{" "}
            <L href={links.authy.backup}>you must receive an sms</L> to gain
            access to your account. If you lose your phone & SIM then it&apos;s
            up to your phone provider to give you that number again, and that
            could take weeks.
          </>,
          "So definitely use a service like Authy, but it's a good idea to have extra backups. Encrypted QR codes are just images that you can safely save in Whatsapp, a photo gallery, and even print them out.",
        ]}
      />
    ),
  },
  {
    question: "What's wrong with 1Password?",
    answer: (
      <BulletPoints
        points={[
          "1Password is a great password manager that can double as a backup by saving your 2FA codes for you. This is convenient but in the (unlikely) event that your vault is compromised then your 2FA codes won't protect those accounts.",
          <>
            <L href={links._1Password.twoFactor}>They claim</L> that most hacks
            made are not by compromising your vault, but by guessing your
            password or finding it in a data breach. This is true but a vault is
            a high value target and even a breach on LastPass was{" "}
            <L href={links.lastPass.incidents}>made</L> by{" "}
            <L href={links.lastPass.hack}>hacking</L> the{" "}
            <L href={links.lastPass.hackExtra}>corporate vault</L>.
          </>,
          "So if you want to separate your 2FA codes from your password manager then encrypting and backing up your 2FA codes is a good solution.",
        ]}
      />
    ),
  },
  {
    question: "Can I rely on this website?",
    answer: (
      <>
        Yes but the great thing is, you don&apos;t have to! This website is
        fully open source so you can control how you use it.{" "}
        <L href={links.github.home}>Fork the code</L> and reuse it however you
        like, <L href={links.github.deploy}>self-host</L> it, or run the{" "}
        <L href={links.github.local}>site locally</L> for fully offline use.{" "}
        Decryption is language agnostic so you can always recover an encrypted
        QR code in future. Here are examples in both{" "}
        <L href={links.examples.typescript}>Typescript</L> and{" "}
        <L href={links.examples.python}>Python</L>.
      </>
    ),
  },
]

const _faqsEncrypt: QnA[] = [
  {
    question: (
      <IconTitle icon={LockClosedIcon}>How are codes encrypted?</IconTitle>
    ),
    answer: (
      <BulletPoints
        points={[
          "Note: Encryption/decryption is done on your device and no data is collected about you.",
          "A QR Code is scanned to decode its plaintext content.",
          <>
            The plaintext is encrypted into ciphertext as follows:
            <BulletPoints
              key={0}
              className="ml-2"
              points={[
                <>
                  <L href={links.crypto.pbkdf2}>PBKDF2</L> derives a 256 bit key
                  from the password and random salt.
                </>,
                <>
                  <L href={links.crypto.aesGcm}>AES-GCM</L> with random init
                  values (IV) encrypts the data.
                </>,
                <>
                  Cryptographically strong random data is provided by{" "}
                  <L href={links.crypto.randomValues}>Crypto</L>.
                </>,
              ]}
            />
          </>,
          <div key={0} className="sm:flex">
            <p className="mr-2 flex-1">
              The ciphertext, salt, and IV are encoded into a text format and
              saved as a JSON object. The data is encoded into a new encrypted
              QR code.{" "}
              <L href={links.examples.typescript}>View the process here</L>.
            </p>
            <p
              key={0}
              className="text-mono whitespace-pre-wrap rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow"
            >
              {[
                "{",
                '  "iv":"5a7e0a...",',
                '  "salt":"74c98...",',
                '  "cipherText":"0e50b...",',
                '  "hint":"Google Account",',
                '  "date":"2024-01-01"',
                "}",
              ].join("\n")}
            </p>
          </div>,
        ]}
      />
    ),
  },
  {
    question: (
      <IconTitle icon={LockClosedIcon}>How do I encrypt a 2FA code?</IconTitle>
    ),
    answer: (
      <BulletPoints
        points={[
          "Log into an account and follow their instructions to set up 2FA. Stop when they present you with a QR code.",
          "Before you scan the QR code with your auth app, first encrypt a copy of the QR code with this website.",
          "Either screenshot, copy/paste, or scan the QR code with a camera and encrypt it. The following Q&A has more details.",
          "Download the encrypted QR code and save or print the image in multiple places as a backup.",
          "Continue setting up 2FA with the original QR code as normal with your authenticator app.",
        ]}
      />
    ),
  },
  {
    question: (
      <IconTitle icon={LockClosedIcon}>How do I encrypt a QR code?</IconTitle>
    ),
    answer: (
      <BulletPoints
        points={[
          <>
            Scan a QR code by selecting a file, copy & paste, drag & drop, or
            scanning it via camera. E.g:
            <BulletPoints
              key={0}
              className="ml-2"
              points={[
                "Scan a QR code on your phone via your laptop webcam.",
                "Scan a printed QR code with your mobile camera.",
                "Screenshot the QR code, save, then select the image file.",
                "Right click and copy the QR code, then 'Ctrl+V' to paste here.",
              ]}
            />
          </>,
          "Type an unencrypted hint to remember what the QR code is for.",
          "Type a secure password to encrypt the QR code with. You MUST remember the password to unlock it again - this is unrecoverable if you forget it. Ideally use a unique password for each QR code.",
          "Download the encrypted QR code and save or print the image in multiple places as a backup.",
        ]}
      />
    ),
  },
  {
    question: (
      <IconTitle icon={LockClosedIcon}>
        How do I choose and store a password?
      </IconTitle>
    ),
    answer: (
      <BulletPoints
        points={[
          <>
            1Password has good tips <L href={links._1Password.password}>here</L>{" "}
            and <L href={links._1Password.passwordCost}>here</L> for choosing a
            password:
            <BulletPoints
              key={0}
              className="ml-2"
              points={[
                "Make it long (16+ characters). Each character makes it exponentially harder to crack.",
                <>
                  Make it random. We&apos;re not as random as we think so you
                  should use a password{" "}
                  <L href={links._1Password.generator}>generator</L> (turn the
                  &apos;memorable&apos; option on).
                </>,
                "Make it memorable: 5 random words is much easier to remember but still harder to crack than 16+ random characters.",
              ]}
            />
          </>,
          "The solution? Generate 5 random words like this `passion-ken-omit-verso-tortoise` - it's long, random, and memorable. Write it down and practice it regularly until you commit it to memory.",
          "If you plan to keep your 2FA codes separate from your password manager then create a new password (not your master password) and commit it to memory - don't store it in your vault.",
          "Ideally use a unique password for each QR code. Using the same one for all codes should be fine if they're accessed rarely and stored safely in the same place - akin to a using password manager.",
        ]}
      />
    ),
  },
]

const _faqsDecrypt: QnA[] = [
  {
    question: (
      <IconTitle icon={LockOpenIcon}>How do I decrypt a QR code?</IconTitle>
    ),
    answer: (
      <BulletPoints
        points={[
          "Note: Encryption/decryption is done on your device and no data is collected about you.",
          "Select/paste/drop/scan an encrypted QR code into the decrypt page. You can use your phone camera to scan a printed code for example.",
          "Type in the original password to unlock the code. There is no way to recover a password if you have lost or forgotten it.",
          "You can scan the decrypted code as a normal 2FA QR code.",
          <>
            Advanced users can decrypt codes using{" "}
            <L href={links.examples.typescript}>Typescript</L> or{" "}
            <L href={links.examples.python}>Python</L>.
          </>,
        ]}
      />
    ),
  },
]

export const faqsEncrypt: QnA[] = [..._faqsEncrypt]
export const faqsDecrypt: QnA[] = [..._faqsDecrypt]
export const faqsHome: QnA[] = [...faqsCommon, ..._faqsEncrypt, ..._faqsDecrypt]

function IconTitle(
  props: Children & {
    icon: (props: React.ComponentProps<"svg">) => JSX.Element
  },
) {
  return (
    <span className="flex items-center">
      <props.icon className="-mt-0.5 mr-2 h-5 w-5" />
      {props.children}
    </span>
  )
}
