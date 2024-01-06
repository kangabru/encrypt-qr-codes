import { CssClass, join } from "@/common/utils"
import { ReactNode } from "react"

export function BulletPoints(
  props: { points: (string | ReactNode)[] } & CssClass,
) {
  return (
    <ul className={join("list-disc pl-4", props.className)}>
      {props.points.map((a, i) => (
        <li key={i}>{a}</li>
      ))}
    </ul>
  )
}
