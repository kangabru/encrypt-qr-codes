/* eslint-disable @next/next/no-img-element */
"use client"

import { readQrCode } from "@/common/qrcode.browser"
import { getErrorMessage } from "@/common/utils"
import { useContext, useEffect } from "react"
import ImageToggleDisplay from "./ImageToggleDisplay"
import { imageInputContext } from "./context"

interface DemoProps {
  imageSrc: string
  description: string
}

export default function DemoMode({ imageSrc, description }: DemoProps) {
  const { setImageDetails, resetImageDetails, setError } =
    useContext(imageInputContext)

  useEffect(() => {
    setImageDetails({
      dataUrl: imageSrc,
      width: 500,
      height: 500,
      fileName: "Demo QR Code",
      qrCodeData: "",
    })

    readQrCode(imageSrc)
      .then((qrCodeData) => {
        setImageDetails({
          dataUrl: imageSrc,
          qrCodeData,
          width: 500,
          height: 500,
          fileName: "Demo QR Code",
        })
      })
      .catch((e) => {
        setError(getErrorMessage(e))
      })

    return resetImageDetails
  }, [imageSrc, setImageDetails, resetImageDetails, setError])

  return (
    <ImageToggleDisplay>
      <div className="flex h-40 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-2 text-center">
        <div className="w-full flex-1 overflow-hidden">
          <img src={imageSrc} alt="" className="h-full w-full object-contain" />
        </div>
        <span>{description}</span>
      </div>
    </ImageToggleDisplay>
  )
}
