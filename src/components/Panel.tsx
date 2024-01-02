import { Children, join } from "@/common/utils";

export function SplitPanelSection(props: Children) {
  return (
    <section className="flex flex-col items-center md:items-stretch md:grid grid-cols-2 gap-4 mx-4">
      {props.children}
    </section>
  );
}

export function Panel(
  props: {
    title: string;
    hasError?: boolean;
    icon?: React.ReactNode;
  } & Children
) {
  return (
    <div
      className={join(
        "bg-white rounded-lg border-t-4 shadow p-4 flex flex-col w-full max-w-lg",
        props.hasError ? "border-red-200" : "border-indigo-200"
      )}
    >
      <div className="flex items-center mb-4">
        {props.icon}
        <h2 className="text-lg">{props.title}</h2>
      </div>
      {props.children}
    </div>
  );
}
