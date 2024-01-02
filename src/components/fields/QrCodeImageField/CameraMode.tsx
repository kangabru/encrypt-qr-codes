"use client";

import { getErrorMessage, join } from "@/common/utils";
import { VideoCameraIcon } from "@heroicons/react/outline";
import QrScanner from "qr-scanner";
import { useContext, useEffect, useRef, useState } from "react";
import { imageInputContext } from "./context";

export default function CameraMode() {
  const { setImageDetails } = useContext(imageInputContext);

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
          setImageDetails(
            {
              dataUrl,
              width: size,
              height: size,
              qrCodeData,
              fileName: "Scanned from camera",
            },
            "image"
          );
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
  }, [setImageDetails]);

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
