/* eslint-disable @next/next/no-img-element */
"use client";

import { readQrCode } from "@/common/qrcode.browser";
import {
  ImageDetails,
  loadImageFromFile,
  useImageDrop,
  useImagePaste,
} from "@/common/use-image-load";
import { getErrorMessage, join } from "@/common/utils";
import { useField, useFormikContext } from "formik";
import { useCallback, useState } from "react";

export default function QrCodeImageInput() {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField<string>("image");

  const [fileName, setFileName] = useState("");
  const { value: dataUrl, ...fieldVals } = field;

  const onInput = useCallback(
    async (d: ImageDetails) => {
      setFileName(d.fileName ?? "");
      setFieldValue("image", d.dataUrl);
    },
    [setFieldValue]
  );

  useImagePaste(onInput);
  const [isDropping] = useImageDrop(onInput);

  return (
    <label
      className={join(
        "w-full h-40 rounded-lg grid place-items-center cursor-pointer",
        "bg-blue-50 p-2 border-dashed border-2",
        isDropping ? "border-red-500" : "border-blue-500"
      )}
    >
      {dataUrl ? (
        <>
          <img src={dataUrl} alt="" className="h-full w-full object-contain" />
          {fileName && <span>{fileName}</span>}
        </>
      ) : (
        <span>Select, paste, or drop image</span>
      )}

      {meta.touched && meta.error && (
        <span className="text-red-500 text-sm">{meta.error}</span>
      )}

      <input
        hidden
        type="file"
        accept="image/*"
        {...fieldVals}
        onChange={async (e) => {
          const files = (e.target as HTMLInputElement)?.files;
          if (files) {
            const imageDetails = await loadImageFromFile(files[0]);
            onInput(imageDetails);
          }
        }}
      />
    </label>
  );
}
