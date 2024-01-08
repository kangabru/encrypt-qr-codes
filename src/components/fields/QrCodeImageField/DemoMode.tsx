/* eslint-disable @next/next/no-img-element */
"use client"

import { join } from "@/common/utils"
import { useContext, useEffect } from "react"
import { imageInputContext } from "./context"

interface DemoProps {
  imageSrc: string
  description: string
}

export default function DemoMode({ imageSrc, description }: DemoProps) {
  const { isDropping, setImageDetails, resetImageDetails } =
    useContext(imageInputContext)

  useEffect(() => {
    setImageDetails({
      dataUrl: imageSrc,
      width: 500,
      height: 500,
      fileName: "Demo QR Code",
    })
    return resetImageDetails
  }, [imageSrc, setImageDetails, resetImageDetails])

  return (
    <div
      className={join(
        "flex h-40 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-2 text-center",
        isDropping ? "border-indigo-400" : "border-gray-300",
      )}
    >
      <div className="w-full flex-1 overflow-hidden">
        <img src={imageSrc} alt="" className="h-full w-full object-contain" />
      </div>
      <span>{description}</span>
    </div>
  )
}
