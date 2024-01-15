import { useCallback, useState } from "react"

export default function useToggle(
  defaultValue: boolean,
): [boolean, () => void, (_: boolean) => void] {
  const [val, setVal] = useState(defaultValue)
  const toggleVal = useCallback(() => setVal((s) => !s), [])
  return [val, toggleVal, setVal]
}
