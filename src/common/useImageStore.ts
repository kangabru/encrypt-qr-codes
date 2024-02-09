import { clear, del, entries, set } from "idb-keyval"
import { useCallback, useEffect, useState } from "react"

export interface StoredImage {
  src: string
  hint: string
  date: string
  fileName: string
}

export default function useImageStore(): [
  [string, StoredImage][],
  (image: StoredImage) => void,
  (key: string) => void,
  () => void,
] {
  const [images, setImages] = useState<[string, StoredImage][]>([])
  const refreshImages = useCallback(
    () => entries<string, StoredImage>().then(setImages),
    [],
  )

  useEffect(() => void refreshImages(), [refreshImages])

  const addImage = useCallback(
    (image: StoredImage) => addImageToStore(image).then(refreshImages),
    [refreshImages],
  )

  const delImage = useCallback(
    (key: string) => delImageFromStore(key).then(refreshImages),
    [refreshImages],
  )

  const clear = useCallback(
    () => clearImages().then(refreshImages),
    [refreshImages],
  )

  return [images, addImage, delImage, clear]
}

export function addImageToStore(image: StoredImage) {
  const key = +new Date() + "-" + Math.random().toString(16).substr(2, 6)
  return set(key, image)
}

export function delImageFromStore(key: string) {
  return del(key)
}

export function clearImages() {
  return clear()
}
