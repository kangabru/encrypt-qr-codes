import { downloadPng, svgToDataUrl } from "@/app/download";
import { EncryptedQRData } from "@/common/parser";
import { addImageToStore } from "@/common/useImageStore";
import { Panel } from "@/components/Panel";
import { QrcodeIcon } from "@heroicons/react/outline";
import { CheckIcon, DownloadIcon, PrinterIcon } from "@heroicons/react/solid";
import { useState } from "react";

export interface QrCodeInfo {
  svgHtml: string;
  dataDecrypted: string;
  dataEncrypted: EncryptedQRData;
}

export default function DisplayPanel({
  title,
  decryptedTextLabel,
  qrCodeInfo,
  getFileName,
}: {
  title: string;
  decryptedTextLabel: string;
  qrCodeInfo: QrCodeInfo | null;
  getFileName: (i: EncryptedQRData) => string;
}) {
  const [savedImageForPrint, setSavedImageForPrint] = useState(false);
  return (
    <Panel title={title}>
      {qrCodeInfo ? (
        <>
          <div
            dangerouslySetInnerHTML={{ __html: qrCodeInfo.svgHtml }}
            className="w-full max-w-lg aspect-square rounded-md shadow-sm border border-gray-300"
          />
          <p className="mt-4 mb-1 text-sm">{decryptedTextLabel}</p>
          <div className="text-mono p-2 rounded-md text-sm shadow-sm bg-gray-50 border border-gray-300 break-words">
            {qrCodeInfo.dataDecrypted}
          </div>
        </>
      ) : (
        <div className="grid place-items-center w-full h-full text-gray-200">
          <QrcodeIcon className="max-h-40" />
        </div>
      )}

      <div className="flex-1" />

      <div className="grid grid-cols-2 gap-4 mt-4 text-sm sm:text-base">
        {/* <button
          className="p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 bg-indigo-500 text-white disabled"
          disabled={!qrCodeInfo}
          onClick={() => {
            const { svgHtml, dataEncrypted } = qrCodeInfo!;
            downloadSvg(svgHtml, getFileName(dataEncrypted)).catch((e) =>
              console.error("Failed to download image", e)
            );
          }}
        >
          Download SVG
        </button> */}

        <button
          className="flex items-center justify-center p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 bg-indigo-500 text-white disabled"
          disabled={!qrCodeInfo}
          onClick={() => {
            const { svgHtml, dataEncrypted } = qrCodeInfo!;
            downloadPng(svgHtml, getFileName(dataEncrypted)).catch((e) =>
              console.error("Failed to download image", e)
            );
          }}
        >
          <DownloadIcon className="w-5 h-5 mr-1" />
          <span>Download PNG</span>
        </button>

        <button
          className="flex justify-center items-center p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 bg-indigo-500 text-white disabled"
          disabled={!qrCodeInfo}
          onClick={() => {
            const {
              svgHtml,
              dataEncrypted: { hint, date },
            } = qrCodeInfo!;
            addImageToStore({ src: svgToDataUrl(svgHtml), hint, date });
            setSavedImageForPrint(true);
            setTimeout(() => setSavedImageForPrint(false), 1000);
          }}
        >
          {savedImageForPrint ? (
            <CheckIcon className="w-5 h-5 mr-1" />
          ) : (
            <>
              <PrinterIcon className="w-5 h-5 mr-1" />
              <span>Save for print</span>
            </>
          )}
        </button>
      </div>
    </Panel>
  );
}
