/* eslint-disable @next/next/no-img-element */
"use client"

import { ImageDetails } from "@/common/useImage"
import { Children } from "@/common/utils"
import { useFormikContext } from "formik"
import { createContext, useCallback, useEffect, useState } from "react"
import { ImageFields } from "./types"

export type Mode = "image" | "camera" | "type" | "demo"

export interface ImageInputContext {
  mode: Mode
  setMode: (m: Mode) => void
  fileName: string
  error: string
  setError: (e: string) => void
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
      setFieldValue("qrCodeData", details.qrCodeData ?? "")
      if (mode) setMode(mode)
    },
    [setFieldValue],
  )

  const resetImageDetails: ImageInputContext["resetImageDetails"] =
    useCallback(() => {
      setError("")
      setFileName("")
      setFieldValue("image", "")
      setFieldValue("qrCodeData", "")
    }, [setFieldValue])

  // Reset image details whening leaving image mode
  useEffect(() => {
    setError("")
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
      }}
    >
      {props.children}
    </imageInputContext.Provider>
  )
}
