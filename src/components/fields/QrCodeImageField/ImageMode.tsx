/* eslint-disable @next/next/no-img-element */
"use client"

import { readQrCode } from "@/common/qrcode.browser"
import {
  loadImageFromFile,
  useImageDrop,
  useImagePaste,
} from "@/common/useImage"
import { getErrorMessage, join } from "@/common/utils"
import { PhotographIcon } from "@heroicons/react/solid"
import { useField } from "formik"
import { useContext } from "react"
import ImageToggleDisplay from "./ImageToggleDisplay"
import { imageInputContext } from "./context"

export default function ImageMode() {
  // Context
  const { setImageDetails, setError, ...context } =
    useContext(imageInputContext)

  // Field
  const [field, meta] = useField<string>("image")
  const { value: dataUrl, ...fieldVals } = field

  // Paste & drop
  useImagePaste(
    (d) => setImageDetails(d, "image"),
    (err) => setError(err),
  )
  const [isDropping] = useImageDrop((d) => setImageDetails(d, "image"))

  const fieldError = meta.touched && meta.error
  const displayError = fieldError || context.error

  return (
    <ImageToggleDisplay>
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
          <ImageDisplay dataUrl={dataUrl} fileName={context.fileName} />
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
    </ImageToggleDisplay>
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
