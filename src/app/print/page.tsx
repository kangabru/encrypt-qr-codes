/* eslint-disable @next/next/no-img-element */
"use client"

import useImageStore from "@/common/useImageStore"
import Page from "@/components/Page"
import { QrcodeIcon } from "@heroicons/react/outline"
import {
  DownloadIcon,
  PrinterIcon,
  TrashIcon,
  XIcon,
} from "@heroicons/react/solid"
import useMeasure from "react-use-measure"
import { downloadPng, svgToPngDataUrl } from "../download"

const CODES_PER_PAGE = 12

export default function PrintPage() {
  const [images, _, deleteImage, clearImages] = useImageStore()

  const pageImages: (typeof images)[] = []
  for (let i = 0; i < images.length; i += CODES_PER_PAGE) {
    pageImages.push(images.slice(i, i + CODES_PER_PAGE))
  }
  const hasImages = pageImages.length > 0

  const [ref, { width }] = useMeasure()
  const scale = Math.min(1, width / 793.7) // A4 width = 210mm = 793.7px @ 96 DPI

  return (
    <Page title="Print QR codes" className="px-2">
      <div ref={ref}>
        {hasImages ? (
          <>
            <section className="mx-auto mb-6 flex w-full max-w-sm space-x-2 text-sm print:hidden sm:text-base">
              <button className="action-button flex-1" onClick={window.print}>
                <PrinterIcon className="mr-2 h-5 w-5" />
                <span>Print pages</span>
              </button>
              <button
                className="action-button px-3"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete all QR codes?",
                    )
                  )
                    clearImages()
                }}
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </section>
            <section
              className="flex origin-top-left flex-col items-center space-y-10 print:!transform-none print:space-y-0"
              style={{ transform: `scale(${scale})` }}
            >
              {pageImages.map((_images, page) => (
                <div
                  key={page}
                  className="page relative mx-auto rounded-lg bg-white p-8 shadow-lg print:rounded-none print:shadow-none"
                >
                  <div className="flex flex-wrap content-start items-start justify-start">
                    {_images.map(([key, image]) => (
                      <div
                        key={key}
                        className="relative m-4 h-52 w-52 rounded-lg border border-gray-100 bg-white p-4"
                      >
                        <button
                          className="absolute -top-2 right-5 rounded-full bg-black p-1 hover:scale-105 print:hidden"
                          onClick={async () =>
                            downloadPng(
                              await svgToPngDataUrl(image.src),
                              image.fileName ??
                                `qr-${image.date}-${image.hint}`,
                            ).catch((e) =>
                              console.error("Failed to download image", e),
                            )
                          }
                        >
                          <DownloadIcon className="h-4 w-4 text-white" />
                        </button>
                        <button
                          className="absolute -right-2 -top-2 rounded-full bg-black p-1 hover:scale-105 print:hidden"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this QR code?",
                              )
                            )
                              deleteImage(key)
                          }}
                        >
                          <XIcon className="h-4 w-4 text-white" />
                        </button>
                        <img
                          src={image.src}
                          alt="QR code"
                          className="pointer-events-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          </>
        ) : (
          <section className="relative mx-auto flex w-full max-w-[210mm] flex-col items-center rounded-lg bg-white p-8 pb-12 text-center shadow-lg print:rounded-none print:shadow-none">
            <QrcodeIcon className="aspect-square w-40 text-indigo-300 sm:w-56" />
            <h2 className="my-2 text-lg font-bold">No QR codes to print.</h2>
            <p>Encrpyt a QR code then click &apos;Save for print&apos;</p>
          </section>
        )}
      </div>
    </Page>
  )
}
