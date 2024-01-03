import { ReactNode } from "react";

export function BulletPoints(props: { points: (string | ReactNode)[] }) {
  return (
    <ul className="list-disc pl-4">
      {props.points.map((a, i) => (
        <li key={i}>{a}</li>
      ))}
    </ul>
  );
}
