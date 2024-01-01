import { Children, join } from "@/common/utils";

export function SplitPanelSection(props: { title: string } & Children) {
  return (
    <section className="max-w-screen-lg w-full flex flex-col md:grid grid-cols-2 gap-4 p-4">
      <h2 className="text-xl col-span-2">{props.title}</h2>
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
        "bg-white rounded-lg border-t-4 shadow p-4 flex flex-col",
        props.hasError ? "border-red-200" : "border-blue-200"
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
