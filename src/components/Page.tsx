"use client";

import links from "@/common/links";
import { Children, join } from "@/common/utils";
import { QrcodeIcon } from "@heroicons/react/outline";
import {
  LockClosedIcon,
  LockOpenIcon,
  PrinterIcon,
} from "@heroicons/react/solid";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GitHubIcon } from "./icons";

const navigation = [
  { name: "Encrypt", href: "/encrypt", icon: LockClosedIcon },
  { name: "Decrypt", href: "/decrypt", icon: LockOpenIcon },
  { name: "Print", href: "/print", icon: PrinterIcon },
];

export default function Page(props: { title: string } & Children) {
  const path = usePagePath();
  return (
    <div className="min-h-screen bg-gray-100 pb-32 print:pb-0">
      <header className="bg-indigo-600 text-white pb-32 md:pb-48 print:hidden">
        <div className="lg:border-b lg:border-indigo-400 lg:border-opacity-25">
          <div className="relative flex items-center justify-between h-16 mx-auto max-w-screen-lg px-4 lg:px-8">
            <Link href="/" className="flex-shrink-0">
              <QrcodeIcon className="w-8 h-8" />
            </Link>
            <div className="flex-1 flex flex-wrap justify-end sm:justify-start items-center space-x-4 sm:ml-10">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={join(
                    "flex items-center rounded-md py-1 px-2 sm:py-2 sm:px-3 text-xs sm:text-sm font-medium",
                    item.href === path
                      ? "bg-indigo-700 text-white"
                      : "text-white hover:bg-indigo-500 hover:bg-opacity-75"
                  )}
                >
                  <item.icon
                    className="h-5 w-5 mr-1 -ml-1 text-white"
                    aria-hidden="true"
                  />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
            <Link
              href={links.github.home}
              className="hidden sm:flex items-center rounded-md py-2 px-3 text-sm font-medium  hover:bg-indigo-500 hover:bg-opacity-75"
            >
              <span>Star</span>
              <GitHubIcon className="h-5 w-5 ml-2" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <h1 className="hidden">{props.title}</h1>
      </header>

      <main className="-mt-32 print:mt-0 mx-auto max-w-screen-lg w-full">
        {props.children}
      </main>
    </div>
  );
}

function usePagePath() {
  const [path, setPath] = useState(getPath());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleLocationChange = () => setPath(getPath());

    window.addEventListener("popstate", handleLocationChange);
    handleLocationChange();
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  return path;
}

function getPath() {
  return typeof window === "undefined" ? "" : window.location.pathname;
}
