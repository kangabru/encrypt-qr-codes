import { Children } from "@/common/utils";

export function SplitPanelSection(props: { title: string } & Children) {
  return (
    <section className="max-w-screen-lg w-full grid grid-cols-2 gap-4 p-4">
      <h2 className="text-xl col-span-2">{props.title}</h2>
      {props.children}
    </section>
  );
}

export function Panel(props: { title: string } & Children) {
  return (
    <div className="bg-white rounded-lg border-t-4 border-blue-200 shadow p-4 flex flex-col">
      <h2 className="text-lg mb-4">{props.title}</h2>
      {props.children}
    </div>
  );
}
