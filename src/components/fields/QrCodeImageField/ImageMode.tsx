/* eslint-disable @next/next/no-img-element */
"use client"

import { loadImageFromFile } from "@/common/use-image-load"
import { join } from "@/common/utils"
import { PhotographIcon } from "@heroicons/react/solid"
import { useField } from "formik"
import { useContext, useEffect } from "react"
import { imageInputContext } from "./context"

export default function ImageMode() {
  const [field, meta] = useField<string>("image")
  const { value: dataUrl, ...fieldVals } = field

  const { fileName, isDropping, setImageDetails, resetImageDetails } =
    useContext(imageInputContext)

  useEffect(() => resetImageDetails, [resetImageDetails]) // reset on exit

  return (
    <label
      tabIndex={0}
      className={join(
        "focus-ring group flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-2 text-center focus:ring-indigo-400/50",
        isDropping
          ? "border-indigo-400"
          : "border-gray-300 hover:border-indigo-400",
      )}
    >
      {dataUrl ? (
        <>
          <img src={dataUrl} alt="" className="h-full w-full object-contain" />
          {fileName && <span>{fileName}</span>}
        </>
      ) : (
        <>
          <PhotographIcon className="h-12 w-12 text-gray-300" />
          <span className="mt-4 text-sm leading-6 text-gray-600">
            <span className="inline font-semibold text-indigo-600 group-hover:underline">
              Select an image
            </span>
            , drag and drop, or paste
          </span>
        </>
      )}

      {meta.touched && meta.error && (
        <span className="text-sm text-red-500">{meta.error}</span>
      )}

      <input
        className="invisible h-0 w-0"
        type="file"
        accept="image/*"
        {...fieldVals}
        onChange={async (e) => {
          const files = (e.target as HTMLInputElement)?.files
          if (files) {
            const imageDetails = await loadImageFromFile(files[0])
            setImageDetails(imageDetails, "image")
          }
        }}
      />
    </label>
  )
}
