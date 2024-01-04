/* eslint-disable @next/next/no-img-element */
"use client";

import useImageStore, { StoredImage } from "@/common/useImageStore";
import { Children } from "@/common/utils";
import Page from "@/components/Page";
import { QrcodeIcon } from "@heroicons/react/outline";
import { PrinterIcon, TrashIcon, XIcon } from "@heroicons/react/solid";

type ImageInfo = [string, StoredImage];

const CODES_PER_PAGE = 12;

export default function PrintPage() {
  const [images, _, deleteImage, clearImages] = useImageStore();

  const pageImages: (typeof images)[] = [];
  for (let i = 0; i < images.length; i += CODES_PER_PAGE) {
    pageImages.push(images.slice(i, i + CODES_PER_PAGE));
  }
  const hasImages = pageImages.length > 0;

  return (
    <Page title="Print QR codes">
      {hasImages ? (
        <>
          <section className="print:hidden flex justify-center items-center mx-auto w-full max-w-lg space-x-4 mb-6">
            <button
              className="flex justify-center items-center p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 bg-indigo-500 text-white disabled"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete all QR codes?"
                  )
                )
                  clearImages();
              }}
            >
              <TrashIcon className="w-5 h-5 mr-2" />
              <span>Clear data</span>
            </button>
            <button
              className="flex justify-center items-center p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 bg-indigo-500 text-white disabled"
              onClick={window.print}
            >
              <PrinterIcon className="w-5 h-5 mr-2" />
              <span>Print pages</span>
            </button>
          </section>
          <section className="flex flex-col items-center space-y-10 print:space-y-0">
            {pageImages.map((_images, page) => (
              <PdfPage key={page}>
                <div className="flex flex-wrap justify-start items-start content-start">
                  {_images.map(([key, image]) => (
                    <div
                      key={key}
                      className="relative bg-white border-gray-100 border rounded-lg p-4 m-4 w-52 h-52"
                    >
                      <button
                        className="print:hidden absolute -top-2 -right-2 bg-black rounded-full p-1"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this QR code?"
                            )
                          )
                            deleteImage(key);
                        }}
                      >
                        <XIcon className="w-4 h-4 text-white" />
                      </button>
                      <img src={image.src} alt="QR code" />
                    </div>
                  ))}
                </div>
              </PdfPage>
            ))}
          </section>
        </>
      ) : (
        <PdfPage>
          <section className="mx-auto p-4 text-center w-full max-w-lg flex flex-col items-center">
            <QrcodeIcon className="w-56 h-56 text-indigo-300" />
            <h2 className="font-bold text-lg my-2">No QR codes to print.</h2>
            <p>Encrpyt a QR code then click &apos;Save for print&apos;</p>
          </section>
        </PdfPage>
      )}
    </Page>
  );
}

function PdfPage(props: Children) {
  return (
    <section className="page relative bg-white rounded-lg shadow-lg print:rounded-none print:shadow-none p-8 mx-auto">
      {props.children}
    </section>
  );
}
