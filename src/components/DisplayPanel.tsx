import { downloadPng, svgToDataUrl, svgToPngDataUrl } from "@/app/download"
import { EncryptedQRData } from "@/common/parser"
import { addImageToStore } from "@/common/useImageStore"
import { Panel } from "@/components/Panel"
import { QrcodeIcon } from "@heroicons/react/outline"
import { CheckIcon, DownloadIcon, PrinterIcon } from "@heroicons/react/solid"
import { useState } from "react"
import { LoadingIcon } from "./icons"

export interface QrCodeInfo {
  svgHtml: string
  dataDecrypted: string
  dataEncrypted: EncryptedQRData
}

export default function DisplayPanel({
  title,
  isLoading,
  extraInfo,
  qrCodeInfo,
  getFileName,
}: {
  title: string
  isLoading: boolean
  extraInfo?: JSX.Element
  qrCodeInfo: QrCodeInfo | null
  getFileName: (i: EncryptedQRData) => string
}) {
  const [savedImageForPrint, setSavedImageForPrint] = useState(false)
  return (
    <Panel title={title}>
      {qrCodeInfo ? (
        <>
          <div
            dangerouslySetInnerHTML={{
              // In-app generated SVG. Comes from the output of the QR code parser so isn't injectable from a QR code.
              __html: qrCodeInfo.svgHtml,
            }}
            className="aspect-square w-full max-w-lg rounded-md border border-gray-300 shadow-sm"
          />
          {extraInfo}
        </>
      ) : (
        <div className="grid h-full w-full place-items-center">
          {isLoading ? (
            <LoadingIcon className="h-8 w-8 text-indigo-600" />
          ) : (
            <QrcodeIcon className="max-h-40 text-gray-200" />
          )}
        </div>
      )}

      <div className="flex-1" />

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:text-base">
        {/* <button
          className="action-button"
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
          className="action-button"
          disabled={!qrCodeInfo}
          onClick={async () => {
            const dataUrlSvg = svgToDataUrl(qrCodeInfo!.svgHtml)
            const dataUrlPng = await svgToPngDataUrl(dataUrlSvg)
            downloadPng(
              dataUrlPng,
              getFileName(qrCodeInfo!.dataEncrypted),
            ).catch((e) => console.error("Failed to download image", e))
          }}
        >
          <DownloadIcon className="mr-1 h-5 w-5" />
          <span>Download PNG</span>
        </button>

        <button
          className="action-button"
          disabled={!qrCodeInfo}
          onClick={() => {
            const { svgHtml, dataEncrypted } = qrCodeInfo!
            const { hint, date } = dataEncrypted
            addImageToStore({
              src: svgToDataUrl(svgHtml),
              hint,
              date,
              fileName: getFileName(dataEncrypted),
            })
            setSavedImageForPrint(true)
            setTimeout(() => setSavedImageForPrint(false), 1000)
          }}
        >
          {savedImageForPrint ? (
            <CheckIcon className="mr-1 h-5 w-5" />
          ) : (
            <>
              <PrinterIcon className="mr-1 h-5 w-5" />
              <span>Save for print</span>
            </>
          )}
        </button>
      </div>
    </Panel>
  )
}
