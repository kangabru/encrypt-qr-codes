"use client"

import links from "@/common/links"
import { Children, CssClass, join } from "@/common/utils"
import { QrcodeIcon } from "@heroicons/react/outline"
import {
  LockClosedIcon,
  LockOpenIcon,
  PrinterIcon,
} from "@heroicons/react/solid"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { GitHubIcon } from "./icons"

const navigation = [
  { name: "Encrypt", href: "/encrypt", icon: LockClosedIcon },
  { name: "Decrypt", href: "/decrypt", icon: LockOpenIcon },
  { name: "Print", href: "/print", icon: PrinterIcon },
]

export default function Page(props: { title: string } & Children & CssClass) {
  const path = usePathname()
  return (
    <div className="min-h-screen bg-gray-100 pb-32 print:pb-0">
      <header className="bg-indigo-600 pb-32 text-white print:hidden md:pb-48">
        <div className="lg:border-b lg:border-indigo-400 lg:border-opacity-25">
          <div className="relative mx-auto flex h-16 max-w-screen-lg items-center justify-between px-4 lg:px-8">
            <Link
              href="/"
              title="Home"
              className="focus-ring flex-shrink-0 rounded-md focus:ring-indigo-200/50"
            >
              <QrcodeIcon className="h-8 w-8" />
            </Link>
            <div className="flex flex-1 flex-wrap items-center justify-end space-x-4 sm:ml-10 sm:justify-start">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={join(
                    "focus-ring flex items-center rounded-md px-2 py-1 text-xs font-medium focus:ring-indigo-200/50 sm:px-3 sm:py-2 sm:text-sm",
                    item.href === path
                      ? "bg-indigo-700 text-white"
                      : "text-white hover:bg-indigo-500 hover:bg-opacity-75",
                  )}
                >
                  <item.icon
                    className="-ml-1 mr-1 h-5 w-5 text-white"
                    aria-hidden="true"
                  />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
            <Link
              href={links.github.home}
              className="focus-ring hidden items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-indigo-500 hover:bg-opacity-75 focus:ring-indigo-200/50 sm:flex"
            >
              <span>Star</span>
              <GitHubIcon className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <h1 className="hidden">{props.title}</h1>
      </header>

      <main
        className={join(
          "mx-auto -mt-32 w-full max-w-screen-lg print:mt-0",
          props.className,
        )}
      >
        {props.children}
      </main>
    </div>
  )
}
