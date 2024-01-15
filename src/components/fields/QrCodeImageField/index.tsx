"use client"

import { join } from "@/common/utils"
import { IconElement } from "@/components/icons"
import {
  AnnotationIcon,
  BeakerIcon,
  QrcodeIcon,
  VideoCameraIcon,
} from "@heroicons/react/solid"
import { useContext } from "react"
import CameraMode from "./CameraMode"
import DemoMode from "./DemoMode"
import ImageMode from "./ImageMode"
import TypeMode from "./TypeMode"
import { Mode, WithImageInputContext, imageInputContext } from "./context"

interface Props {
  showTypeMode?: boolean
  demoSrc: string
  demoDescription: string
}

export default function QrCodeImageInput(props: Props) {
  return (
    <WithImageInputContext>
      <QrCodeImageInputCore {...props} />
    </WithImageInputContext>
  )
}

function QrCodeImageInputCore(props: Props) {
  const { mode } = useContext(imageInputContext)
  return (
    <div>
      <div
        className={join(
          "mb-2 grid text-center text-sm font-medium text-gray-900",
          props.showTypeMode ? "grid-cols-4" : "grid-cols-3",
        )}
      >
        <ModeButton mode="image" text="Select" icon={QrcodeIcon} />
        <ModeButton mode="camera" text="Scan" icon={VideoCameraIcon} />
        {props.showTypeMode && (
          <ModeButton mode="type" text="Text" icon={AnnotationIcon} />
        )}
        <ModeButton mode="demo" text="Demo" icon={BeakerIcon} />
      </div>
      {mode === "image" && <ImageMode />}
      {mode === "camera" && <CameraMode />}
      {mode === "type" && <TypeMode />}
      {mode === "demo" && (
        <DemoMode
          imageSrc={props.demoSrc}
          description={props.demoDescription}
        />
      )}
    </div>
  )
}

function ModeButton(props: { mode: Mode; text: string; icon: IconElement }) {
  const { mode, setMode } = useContext(imageInputContext)
  return (
    <button
      type="button"
      onClick={() => setMode(props.mode)}
      className={join(
        "focus-ring flex items-center justify-center p-3 hover:rounded hover:bg-gray-50 focus:rounded",
        mode === props.mode && "border-b-2 border-b-indigo-500",
      )}
    >
      <props.icon className="mr-1 h-5 w-5 flex-shrink-0" />
      <span>{props.text}</span>
    </button>
  )
}
