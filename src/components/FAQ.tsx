"use client";

import { Q_A } from "@/components/Faqs";
import { Children, CssClass } from "@/common/utils";
import { MinusIcon, PlusIcon } from "@heroicons/react/outline";
import { useState } from "react";

export default function FAQ({ faqs }: { faqs: Q_A[] }) {
  return (
    <div className="mt-8 px-4 mx-auto max-w-2xl">
      <h2 className="text-xl font-bold leading-10 tracking-tight text-gray-900">
        FAQs
      </h2>
      <dl className="mt-5 divide-y divide-gray-900/10">
        {faqs.map((faq, i) => (
          <Disclosure key={i} {...faq} />
        ))}
      </dl>
    </div>
  );
}

function Disclosure(props: Children & CssClass & Q_A) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <dt>
        <button
          onClick={() => setOpen((o) => !o)}
          className="py-4 flex w-full items-start justify-between text-left text-gray-900"
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
  );
}
