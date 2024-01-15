"use client"

import useToggle from "@/common/useToggle"
import { Children } from "@/common/utils"
import { AnnotationIcon, QrcodeIcon } from "@heroicons/react/solid"
import { useField } from "formik"

export default function ImageToggleDisplay(props: Children) {
  const imageData = useField<string>("qrCodeData")[1].value
  const [isViewingImageData, toggleIsViewingImageData] = useToggle(false)

  return (
    <div className="relative">
      {isViewingImageData ? (
        <ImageDataDisplay data={imageData} toggle={toggleIsViewingImageData} />
      ) : (
        props.children
      )}

      {imageData && (
        <ToggleImageDataButton
          isShowingImageData={isViewingImageData}
          toggle={toggleIsViewingImageData}
        />
      )}
    </div>
  )
}

function ImageDataDisplay(props: { data: string; toggle: () => void }) {
  return (
    <div className="text-mono relative min-h-[10rem] break-words rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm">
      {props.data}
    </div>
  )
}

function ToggleImageDataButton(props: {
  isShowingImageData: boolean
  toggle: () => void
}) {
  const Icon = props.isShowingImageData ? QrcodeIcon : AnnotationIcon
  return (
    <button
      type="button"
      className="absolute right-2 top-2 z-10 rounded bg-white p-1 shadow hover:bg-gray-50"
      onClick={props.toggle}
    >
      <Icon className="h-5 w-5" />
    </button>
  )
}
