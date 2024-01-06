import { join } from "@/common/utils"
import { useField } from "formik"

interface Props {
  name: string
  label: string
  description: string
  minLength: number
  placeholder: string
  disabled?: boolean
  type?: "text" | "password"
}

export default function TextField(props: Props) {
  const [field, meta] = useField({
    ...props,
    validate: (val) =>
      val.length < props.minLength ? `${props.label} is too short` : undefined,
  })
  const { value } = field
  return (
    <label className="block">
      <div className="flex items-center justify-between">
        <span className="ml-2 text-gray-800">{props.label}</span>
        <span className="mr-2 text-xs">
          {value.length === 0
            ? "*"
            : value.length < props.minLength
              ? props.minLength - value.length
              : null}
        </span>
      </div>
      <span className="ml-2 text-xs text-gray-600">{props.description}</span>
      <input
        {...field}
        {...props}
        type={props.type ?? "text"}
        required
        className={join(
          "disabled mt-1 block w-full rounded-md border shadow-sm focus:ring",
          value.length > 0 && value.length < props.minLength
            ? "border-red-300 focus:border-red-300 focus:ring-red-200/50"
            : "border-gray-300 focus:border-indigo-300 focus:ring-indigo-200/50",
        )}
      />
      {meta.error && meta.touched ? (
        <div className="text-sm text-red-500">{meta.error}</div>
      ) : null}
    </label>
  )
}
