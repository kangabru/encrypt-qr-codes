"use client"

import { QnA } from "@/components/FaqContent"
import { Children, CssClass } from "@/common/utils"
import { MinusIcon, PlusIcon } from "@heroicons/react/outline"
import { useState } from "react"

export default function FaqList({ faqs }: { faqs: QnA[] }) {
  return (
    <section className="mx-auto mt-8 max-w-3xl px-4">
      <h2 className="text-xl font-bold leading-10 tracking-tight text-gray-900">
        FAQs
      </h2>
      <dl className="mt-5 divide-y divide-gray-900/10">
        {faqs.map((faq, i) => (
          <Disclosure key={i} {...faq} />
        ))}
      </dl>
    </section>
  )
}

function Disclosure(props: Children & CssClass & QnA) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <dt>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-start justify-between rounded-md px-2 py-4 text-left text-gray-900 hover:underline focus:underline focus:outline-none"
        >
          <span className="text-base font-semibold leading-7">
            {props.question}
          </span>
          <span className="ml-6 flex h-7 items-center">
            {open ? (
              <MinusIcon className="h-6 w-6" aria-hidden="true" />
            ) : (
              <PlusIcon className="h-6 w-6" aria-hidden="true" />
            )}
          </span>
        </button>
      </dt>
      {open && (
        <dd className="-mt-2 mb-4 pr-12 text-base leading-7 text-gray-600">
          {props.answer}
        </dd>
      )}
    </div>
  )
}
