/* eslint-disable @next/next/no-img-element */
"use client";

import {
  ImageDetails,
  loadImageFromFile,
  useImageDrop,
  useImagePaste,
} from "@/common/use-image-load";
import { getErrorMessage, join } from "@/common/utils";
import {
  PhotographIcon,
  QrcodeIcon,
  VideoCameraIcon,
} from "@heroicons/react/solid";
import { useField, useFormikContext } from "formik";
import QrScanner from "qr-scanner";
import { useCallback, useEffect, useRef, useState } from "react";

export interface ImageFields {
  image: string;
  cameraQrCodeData?: string;
}

type Mode = "image" | "camera";

export default function QrCodeImageInput() {
  const [mode, setMode] = useState<Mode>("image");
  const [fileName, setFileName] = useState("");

  const { setFieldValue } = useFormikContext();
  const onImageInput: OnInputFunc = useCallback(
    (d) => {
      setMode("image");
      setFileName(d.fileName ?? "");
      setFieldValue("image", d.dataUrl);
      d.qrCodeData && setFieldValue("cameraQrCodeData", d.qrCodeData);
    },
    [setFieldValue]
  );

  // We keep these at this level to enable paste/drop in camera mode
  useImagePaste(onImageInput);
  const [isDropping] = useImageDrop(onImageInput);

  return (
    <div>
      <div className="grid grid-cols-2 mb-2 text-center text-sm font-medium text-gray-900">
        <button
          type="button"
          onClick={() => setMode("image")}
          className={join(
            "flex items-center justify-center p-3 hover:bg-gray-50",
            mode === "image" && "border-b-2 border-b-indigo-500"
          )}
        >
          <QrcodeIcon className="w-5 h-5 mr-1" />
          <span>Select image</span>
        </button>
        <button
          type="button"
          onClick={() => setMode("camera")}
          className={join(
            "flex items-center justify-center p-3 hover:bg-gray-50",
            mode === "camera" && "border-b-2 border-b-indigo-500"
          )}
        >
          <VideoCameraIcon className="w-5 h-5 mr-1" />
          <span>Scan camera</span>
        </button>
      </div>
      <div className="col-span-2">
        {mode === "image" && (
          <ImageMode
            isDropping={isDropping}
            onInput={onImageInput}
            fileName={fileName}
          />
        )}
        {mode === "camera" && <CameraMode onInput={onImageInput} />}
      </div>
    </div>
  );
}

type OnInputFunc = (d: ImageDetails) => void;

function ImageMode(props: {
  isDropping: boolean;
  onInput: OnInputFunc;
  fileName?: string;
}) {
  const [field, meta] = useField<string>("image");
  const { value: dataUrl, ...fieldVals } = field;

  return (
    <label
      className={join(
        "group flex flex-col items-center justify-center w-full h-40 rounded-lg cursor-pointer text-center p-2 border-dashed border-2",
        props.isDropping
          ? "border-indigo-400"
          : "border-gray-300 hover:border-indigo-400"
      )}
    >
      {dataUrl ? (
        <>
          <img src={dataUrl} alt="" className="h-full w-full object-contain" />
          {props.fileName && <span>{props.fileName}</span>}
        </>
      ) : (
        <>
          <PhotographIcon className="text-gray-300 w-12 h-12" />
          <span className="mt-4 text-sm leading-6 text-gray-600">
            <span className="inline font-semibold text-indigo-600 group-hover:underline">
              Select an image
            </span>
            , drag and drop, or paste
          </span>
        </>
      )}

      {meta.touched && meta.error && (
        <span className="text-red-500 text-sm">{meta.error}</span>
      )}

      <input
        hidden
        type="file"
        accept="image/*"
        {...fieldVals}
        onChange={async (e) => {
          const files = (e.target as HTMLInputElement)?.files;
          if (files) {
            const imageDetails = await loadImageFromFile(files[0]);
            props.onInput(imageDetails);
          }
        }}
      />
    </label>
  );
}

function CameraMode({ onInput }: { onInput: OnInputFunc }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrRef = useRef<QrScanner>(null);

  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string>();
  const [cams, setCams] = useState<QrScanner.Camera[]>([]);

  useEffect(() => {
    setError(undefined);
    setRunning(false);
    if (!videoRef.current) return;

    const qrScanner = new QrScanner(
      videoRef.current,
      ({ data: qrCodeData }) => {
        const video = videoRef.current;
        if (video) {
          console.info("Found QR code data:", qrCodeData);
          const [dataUrl, size] = extractSquareFromVideo(video);
          onInput({
            dataUrl,
            width: size,
            height: size,
            qrCodeData,
            fileName: "Scanned from camera",
          });
        }
      },
      {
        highlightScanRegion: true,
        returnDetailedScanResult: true,
      }
    );

    // @ts-ignore
    qrRef.current = qrScanner;
    qrScanner
      .start()
      .then(() => setRunning(true))
      .catch((error) => {
        setRunning(false);
        setError(getErrorMessage(error) || "Couldn't load camera");
      });

    return () => {
      setRunning(false);
      qrScanner.destroy();
    };
  }, [onInput]);

  useEffect(() => {
    setCams([]);
    QrScanner.listCameras(true).then((cams) => setCams(cams));
  }, []);

  return (
    <div
      className={join(
        "relative border-dashed border-2 rounded-lg p-1.5",
        error ? "border-red-400" : "border-indigo-400"
      )}
    >
      <div className="flex flex-col items-center">
        <video ref={videoRef} className="h-36 rounded-md" />

        {running && cams.length > 1 && (
          <select
            className="mt-2 text-xs rounded"
            onInput={(e) => qrRef.current?.setCamera(e.currentTarget.value)}
          >
            {cams.map((cam) => (
              <option
                key={cam.id}
                value={cam.id}
                onClick={() => qrRef.current?.setCamera(cam.id)}
              >
                {cam.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {!running && (
        <div className="absolute inset-0 p-2 flex flex-col items-center justify-center">
          <VideoCameraIcon className="text-gray-300 w-12 h-12" />
          <span
            className={join(
              "mt-3 flex text-sm leading-6",
              error ? "text-red-600" : "text-gray-600"
            )}
          >
            {error ?? "Starting camera..."}
          </span>
        </div>
      )}
    </div>
  );
}

function extractSquareFromVideo(video: HTMLVideoElement): [string, number] {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const size = Math.min(video.videoWidth, video.videoHeight);
  canvas.width = size;
  canvas.height = size;

  // Get middle square
  const x = Math.floor((video.videoWidth - size) * 0.5);
  const y = Math.floor((video.videoHeight - size) * 0.5);

  // Flip horizontal to match flipped camera view
  ctx.scale(-1, 1);
  ctx.translate(-canvas.width, 0);

  ctx.drawImage(video, x, y, size, size, 0, 0, size, size);
  return [canvas.toDataURL(), size];
}
