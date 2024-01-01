import { downloadPng, downloadSvg } from "@/app/download";
import { EncryptedQRData } from "@/common/parser";
import { Panel } from "@/components/Panel";
import { QrcodeIcon } from "@heroicons/react/outline";

export interface QrCodeInfo {
  data: EncryptedQRData;
  html: string;
}

export default function DisplayPanel({
  title,
  qrCodeInfo,
  getFileName,
}: {
  title: string;
  qrCodeInfo: QrCodeInfo | null;
  getFileName: (i: EncryptedQRData) => string;
}) {
  return (
    <Panel title={title}>
      {qrCodeInfo ? (
        <div
          dangerouslySetInnerHTML={{ __html: qrCodeInfo.html }}
          className="w-full max-w-lg aspect-square"
        />
      ) : (
        <div className="grid place-items-center w-full h-full text-gray-200">
          <QrcodeIcon className="max-h-40" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <button
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 bg-blue-500 text-white disabled"
          disabled={!qrCodeInfo}
          onClick={() => {
            const { html, data } = qrCodeInfo!;
            downloadSvg(html, getFileName(data)).catch((e) =>
              console.error("Failed to download image", e)
            );
          }}
        >
          Download SVG
        </button>

        <button
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 bg-blue-500 text-white disabled"
          disabled={!qrCodeInfo}
          onClick={() => {
            const { html, data } = qrCodeInfo!;
            downloadPng(html, getFileName(data)).catch((e) =>
              console.error("Failed to download image", e)
            );
          }}
        >
          Download PNG
        </button>
      </div>
    </Panel>
  );
}
