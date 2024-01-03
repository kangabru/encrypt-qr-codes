"use client";

import { hrefGithub } from "@/common/links";
import { Children, join } from "@/common/utils";
import { QrcodeIcon } from "@heroicons/react/outline";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GitHubIcon } from "./icons";

const navigation = [
  { name: "Encrypt", href: "/encrypt", icon: LockClosedIcon },
  { name: "Decrypt", href: "/decrypt", icon: LockOpenIcon },
];

export default function Page(props: { title: string } & Children) {
  const path = usePagePath();
  return (
    <div className="min-h-full bg-gray-100 pb-32">
      <div className="bg-indigo-600 pb-32">
        <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
          <div className="relative flex h-16 items-center justify-between lg:border-b lg:border-indigo-400 lg:border-opacity-25">
            <div className="flex items-center px-2 lg:px-0">
              <Link href="/" className="flex-shrink-0">
                <QrcodeIcon className="w-8 h-8 text-white" />
              </Link>
              <div className="block ml-10">
                <div className="flex items-center space-x-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={join(
                        "flex items-center rounded-md p-2 px-3 text-sm font-medium",
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
              </div>
            </div>
            <div className="block ml-4">
              <div className="flex items-center">
                <Link
                  href={hrefGithub}
                  className="flex items-center rounded-md py-2 px-3 text-sm font-medium text-white hover:bg-indigo-500 hover:bg-opacity-75"
                >
                  <span>Star</span>
                  <GitHubIcon className="h-5 w-5 ml-2" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <header className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="hidden text-xl font-bold tracking-tight text-white">
              {props.title}
            </h1>
          </div>
        </header>
      </div>

      <main className="-mt-32 mx-auto max-w-screen-lg w-full">
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
