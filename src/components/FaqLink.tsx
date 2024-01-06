import { Children } from "@/common/utils"
import Link from "next/link"

export default function FaqLink(props: Children & { href: string }) {
  return <Link {...props} className="text-indigo-900 underline" />
}
