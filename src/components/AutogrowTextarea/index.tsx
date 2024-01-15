"use client"

import { join } from "@/common/utils"
import "./index.css"

/** @see https://css-tricks.com/the-cleanest-trick-for-autogrowing-textareas/ */
export default function AutogrowTextarea(
  props: React.ComponentProps<"textarea">,
) {
  return (
    <div className="grow-wrap">
      <span
        className={join("invisible whitespace-pre-wrap", props.className)}
        aria-hidden
      >
        {/* The " " suffix is necessary for non-jumpy new lines */}
        {props.value}{" "}
      </span>
      <textarea {...props} />
    </div>
  )
}
