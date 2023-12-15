import {
  ChangeEvent,
  Ref,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type Event = ChangeEvent<HTMLInputElement>;

export type ImageDetails = {
  dataUrl: string;
  width: number;
  height: number;
  fileName?: string;
};
export type SetImageDetails = (_: ImageDetails) => void;

/** Imports an image by pasting from clipboard */
export function useImagePaste(setDataUrl: SetImageDetails) {
  useEffect(() => {
    const onPaste = (e: LocalClipboardEvent) =>
      loadImageOnPaste(e).then(setDataUrl);
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, [setDataUrl]);
}

/** Imports an image by dragging and dropping from the file system. */
export function useImageDrop<T extends HTMLElement>(
  setDataUrl: SetImageDetails
): [Ref<T>, boolean, boolean] {
  const dropZone = useRef<T>();
  const [isDropping, setIsDropping] = useState(false);
  const [isError, setIsError] = useState(false);

  const onFileOver = (e: DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer && (e.dataTransfer.dropEffect = "copy");
    setIsDropping(true);
  };
  const onFileLeave = (e: DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer && (e.dataTransfer.dropEffect = "none");
    setIsDropping(false);
  };
  const onFileDrop = useCallback(
    (e: DragEvent) => {
      e.stopPropagation();
      e.preventDefault();
      loadImageOnDrop(e)
        .then((dataUrl) => {
          setIsError(false);
          setIsDropping(false);
          setDataUrl(dataUrl);
        })
        .catch((_) => {
          setIsDropping(false);
          setIsError(true);
        });
    },
    [setDataUrl]
  );

  useLayoutEffect(() => {
    var zone = dropZone.current;
    if (!zone) return;
    zone.addEventListener("dragover", onFileOver);
    zone.addEventListener("dragleave", onFileLeave);
    zone.addEventListener("drop", onFileDrop);
    return () => {
      zone?.removeEventListener("dragover", onFileOver);
      zone?.removeEventListener("dragleave", onFileLeave);
      zone?.removeEventListener("drop", onFileDrop);
    };
  }, [onFileDrop]);

  return [dropZone as any, isDropping, isError];
}

/** Imports an image from a file input. */
export function loadImageFromFile(
  file: File | null | undefined
): Promise<ImageDetails> {
  return new Promise((accept, reject) => {
    if (file?.type.match("image.*")) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onerror = () => reject("Error reading file");
      reader.onload = (evt) =>
        loadImageFromDataUrl(evt.target?.result as string, file.name ?? "Hello")
          .then(accept)
          .catch(reject);
    } else if (file) reject("File is not an image");
    else reject("No data given");
  });
}

/** Loads an image data and dimensions */
export function loadImageFromDataUrl(
  dataUrl: string | undefined,
  fileName?: string
): Promise<ImageDetails> {
  return new Promise((accept, reject) => {
    if (!dataUrl) return reject();
    const image = new Image();
    image.onerror = reject;
    image.onload = (_) => {
      const width = image.naturalWidth;
      const height = image.naturalHeight;
      accept({ dataUrl, fileName, width, height });
    };
    image.src = dataUrl;
  });
}

/** Wrapper for input 'onChange' events to load the image then perform a callback. */
export function onInputChange(setDataUrl: SetImageDetails) {
  return (e: Event) => loadImageOnChange(e).then(setDataUrl);
}

function loadImageOnChange(e: Event): Promise<ImageDetails> {
  return new Promise((accept, reject) => {
    var files = (e.target as HTMLInputElement)?.files;
    if (files) loadImageFromFile(files[0]).then(accept).catch(reject);
    else reject("No data given");
  });
}

// Chrome specific type
type LocalClipboardEvent = ClipboardEvent & {
  originalEvent?: ClipboardEvent;
};

/** @see https://stackoverflow.com/a/15369753/3801481 */
function loadImageOnPaste(e: LocalClipboardEvent): Promise<ImageDetails> {
  return new Promise((accept, reject) => {
    const clipboardData = e.clipboardData || e.originalEvent?.clipboardData;
    if (!clipboardData) return reject("No clipboard data");

    const items = clipboardData.items;
    let file: File | null = null;
    for (var i = 0; i < items.length; i++)
      if (items[i].type.indexOf("image") === 0) file = items[i].getAsFile();

    loadImageFromFile(file).then(accept).catch(reject);
  });
}

/** @see https://stackoverflow.com/a/15369753/3801481 */
function loadImageOnDrop(e: DragEvent): Promise<ImageDetails> {
  return new Promise((accept, reject) => {
    var files = e.dataTransfer?.files;
    if (files) loadImageFromFile(files[0]).then(accept).catch(reject);
    else reject("No data given");
  });
}
