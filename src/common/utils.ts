import { PropsWithChildren } from "react"

type ClassProp = string | boolean | undefined | null
export function join(...classes: ClassProp[]): string {
  return classes.filter((x) => !!x).join(" ")
}

export type Children = PropsWithChildren
export type CssClass = { className?: string }

export function getDate() {
  return new Date().toISOString().split("T")[0]
}

export function getErrorMessage(e: any) {
  return e.message ?? e.toString()
}
