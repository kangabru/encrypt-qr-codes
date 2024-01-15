/* eslint-disable @next/next/no-img-element */
"use client"

import { readQrCode } from "@/common/qrcode.browser"
import { loadImageFromFile } from "@/common/useImage"
import useToggle from "@/common/useToggle"
import { getErrorMessage, join } from "@/common/utils"
import {
  AnnotationIcon,
  PhotographIcon,
  QrcodeIcon,
} from "@heroicons/react/solid"
import { useField } from "formik"
import { useContext } from "react"
import { imageInputContext } from "./context"

export default function ImageMode() {
  const [field, meta] = useField<string>("image")
  const { value: dataUrl, ...fieldVals } = field

  const {
    fileName,
    error: otherError,
    isDropping,
    setImageDetails,
    setError,
  } = useContext(imageInputContext)

  const imageData = useField<string>("cameraQrCodeData")[1].value
  const [isViewingImageData, toggleIsViewingImageData] = useToggle(false)

  const fieldError = meta.touched && meta.error
  const displayError = fieldError || otherError

  return (
    <div className="relative">
      {isViewingImageData ? (
        <ImageDataDisplay data={imageData} toggle={toggleIsViewingImageData} />
      ) : (
        <label
          tabIndex={0}
          className={join(
            "focus-ring group relative flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-2 text-center focus:ring-indigo-300/50",
            isDropping
              ? "border-indigo-400"
              : "border-gray-300 hover:border-indigo-400",
          )}
        >
          {dataUrl ? (
            <ImageDisplay {...{ fileName, dataUrl }} />
          ) : (
            <ImageSelectPlaceHolder />
          )}

          {displayError && (
            <span className="text-sm text-red-500">{displayError}</span>
          )}

          <input
            className="invisible h-0 w-0"
            type="file"
            accept="image/*"
            {...fieldVals}
            onChange={async (e) => {
              const files = (e.target as HTMLInputElement)?.files
              if (files) {
                try {
                  const imageDetails = await loadImageFromFile(files[0])

                  // Allow any image but show any scan errors before they submit the form
                  let qrCodeErrorMessage = ""
                  try {
                    imageDetails.qrCodeData = await readQrCode(
                      imageDetails.dataUrl,
                    )
                  } catch (error) {
                    qrCodeErrorMessage = getErrorMessage(error)
                  }

                  setImageDetails(imageDetails, "image")
                  qrCodeErrorMessage && setError(qrCodeErrorMessage)
                } catch (e) {
                  setError(getErrorMessage(e))
                }
              }
            }}
          />
        </label>
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

function ImageDisplay(props: { fileName: string; dataUrl: string }) {
  return (
    <>
      <div className="w-full flex-1 overflow-hidden">
        <img
          src={props.dataUrl}
          alt=""
          className="h-full w-full object-contain"
        />
      </div>
      {props.fileName && <span>{props.fileName}</span>}
    </>
  )
}

function ImageDataDisplay(props: { data: string; toggle: () => void }) {
  return (
    <div className="text-mono relative break-words rounded-md border border-gray-300 bg-gray-50 p-2 text-sm shadow-sm">
      {props.data}
    </div>
  )
}

function ImageSelectPlaceHolder() {
  return (
    <>
      <PhotographIcon className="h-12 w-12 text-gray-300" />
      <span className="mt-4 text-sm leading-6 text-gray-600">
        <span className="inline font-semibold text-indigo-600 group-hover:underline">
          Select an image
        </span>
        , drag and drop, or paste
      </span>
    </>
  )
}
