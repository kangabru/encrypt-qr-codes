/* eslint-disable @next/next/no-img-element */
"use client"

import { ImageDetails, useImageDrop, useImagePaste } from "@/common/useImage"
import { Children } from "@/common/utils"
import { useFormikContext } from "formik"
import { createContext, useCallback, useEffect, useState } from "react"
import { ImageFields } from "./types"

export type Mode = "image" | "camera" | "demo"

export interface ImageInputContext {
  mode: Mode
  setMode: (m: Mode) => void
  fileName: string
  error: string
  setError: (e: string) => void
  isDropping: boolean
  setImageDetails: (d: ImageDetails, m?: Mode) => void
  resetImageDetails: () => void
}

export const imageInputContext = createContext<ImageInputContext>({} as any)

type FieldSetter = <K extends keyof ImageFields>(
  k: K,
  v: ImageFields[K],
) => void

export function WithImageInputContext(props: Children) {
  const [mode, setMode] = useState<Mode>("image")
  const [fileName, setFileName] = useState("")
  const [error, setError] = useState("")

  const setFieldValue = useFormikContext().setFieldValue as FieldSetter
  const setImageDetails: ImageInputContext["setImageDetails"] = useCallback(
    (details, mode) => {
      setError("")
      setFileName(details.fileName ?? "")
      setFieldValue("image", details.dataUrl)
      setFieldValue("cameraQrCodeData", details.qrCodeData ?? "")
      if (mode) setMode(mode)
    },
    [setFieldValue],
  )

  const resetImageDetails: ImageInputContext["resetImageDetails"] =
    useCallback(() => {
      setError("")
      setFileName("")
      setFieldValue("image", "")
      setFieldValue("cameraQrCodeData", "")
    }, [setFieldValue])

  // We keep these at this level to enable paste/drop in camera mode
  useImagePaste(
    (d) => setImageDetails(d, "image"),
    (err) => {
      setMode("image")
      setError(err)
    },
  )
  const [isDropping] = useImageDrop((d) => setImageDetails(d, "image"))

  // Reset image details whening leaving image mode
  useEffect(() => {
    if (mode === "image") return resetImageDetails
  }, [mode, resetImageDetails])

  return (
    <imageInputContext.Provider
      value={{
        mode,
        setMode,
        setImageDetails,
        resetImageDetails,
        fileName,
        error,
        setError,
        isDropping,
      }}
    >
      {props.children}
    </imageInputContext.Provider>
  )
}
