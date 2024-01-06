import { Children, join } from "@/common/utils"

export function SplitPanelSection(props: Children) {
  return (
    <section className="mx-4 flex grid-cols-2 flex-col items-center gap-4 md:grid md:items-stretch">
      {props.children}
    </section>
  )
}

export function Panel(
  props: {
    title: string
    hasError?: boolean
    icon?: React.ReactNode
  } & Children,
) {
  return (
    <div
      className={join(
        "flex w-full max-w-lg flex-col rounded-lg border-t-4 bg-white p-4 shadow",
        props.hasError ? "border-red-200" : "border-indigo-200",
      )}
    >
      <div className="mb-4 flex items-center">
        {props.icon}
        <h2 className="text-lg">{props.title}</h2>
      </div>
      {props.children}
    </div>
  )
}
