"use client";

import { join } from "@/common/utils";
import {
  BeakerIcon,
  QrcodeIcon,
  VideoCameraIcon,
} from "@heroicons/react/solid";
import { useContext } from "react";
import CameraMode from "./CameraMode";
import DemoMode from "./DemoMode";
import ImageMode from "./ImageMode";
import { WithImageInputContext, imageInputContext } from "./context";

interface DemoProps {
  demoSrc: string;
  demoDescription: string;
}

export default function QrCodeImageInput(props: DemoProps) {
  return (
    <WithImageInputContext>
      <QrCodeImageInputCore {...props} />
    </WithImageInputContext>
  );
}

function QrCodeImageInputCore(props: DemoProps) {
  const { mode, setMode } = useContext(imageInputContext);
  return (
    <div>
      <div className="grid grid-cols-3 mb-2 text-center text-sm font-medium text-gray-900">
        <button
          type="button"
          onClick={() => setMode("image")}
          className={join(
            "flex items-center justify-center p-3 hover:bg-gray-50 focus-ring hover:rounded focus:rounded",
            mode === "image" && "border-b-2 border-b-indigo-500"
          )}
        >
          <QrcodeIcon className="w-5 h-5 mr-1 flex-shrink-0" />
          <span>Select image</span>
        </button>
        <button
          type="button"
          onClick={() => setMode("camera")}
          className={join(
            "flex items-center justify-center p-3 hover:bg-gray-50 focus-ring hover:rounded focus:rounded",
            mode === "camera" && "border-b-2 border-b-indigo-500"
          )}
        >
          <VideoCameraIcon className="w-5 h-5 mr-1 flex-shrink-0" />
          <span>Scan camera</span>
        </button>
        <button
          type="button"
          onClick={() => setMode("demo")}
          className={join(
            "flex items-center justify-center p-3 hover:bg-gray-50 focus-ring hover:rounded focus:rounded",
            mode === "demo" && "border-b-2 border-b-indigo-500"
          )}
        >
          <BeakerIcon className="w-5 h-5 mr-1 flex-shrink-0" />
          <span>Demo QR code</span>
        </button>
      </div>
      <div>
        {mode === "image" && <ImageMode />}
        {mode === "camera" && <CameraMode />}
        {mode === "demo" && (
          <DemoMode
            imageSrc={props.demoSrc}
            description={props.demoDescription}
          />
        )}
      </div>
    </div>
  );
}
