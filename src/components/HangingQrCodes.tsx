import { Children } from "@/common/utils";
import { QrcodeIcon } from "@heroicons/react/outline";
import { ReactNode, useMemo } from "react";

export default function HangingQrCodes() {
  return (
    <section className="absolute top-0 left-1/2 -translate-x-1/2 opacity-80 hidden md:block w-full max-w-screen-2xl">
      <QrHang left={10} counts={[5, 15, 10, 5, 15, 10, 15]}>
        <QrcodeIcon className="w-20 h-20 p-2 scale-90 rotate-6 rounded-lg bg-red-200 text-red-800" />
      </QrHang>
      <QrHang left={25} counts={[15, 5, 20]}>
        <QrcodeIcon className="w-20 h-20 p-2 -rotate-2 rounded-lg bg-blue-200 text-blue-800" />
      </QrHang>
      <QrHang left={75} counts={[25, 5, 15, 15]}>
        <QrcodeIcon className="w-20 h-20 p-2 scale-100 rotate-3 rounded-lg bg-orange-200 text-orange-800" />
      </QrHang>
      <QrHang left={90} counts={[5, 5, 15, 10, 15, 20, 5, 10]}>
        <QrcodeIcon className="w-20 h-20 p-2 scale-95 -rotate-3 rounded-lg bg-pink-200 text-pink-800" />
      </QrHang>
    </section>
  );
}

function QrHang(props: { left: number; counts: number[] } & Children) {
  const [lines, h]: [ReactNode[], number] = useMemo(() => {
    const _lines: ReactNode[] = [];

    const gap = 10;
    let y0 = 5;
    for (const count of props.counts) {
      const y1 = y0 + count;
      const op =
        (Math.sin(y1 * 213423 + count * 123242) * 0.5 + 0.5) * 0.8 + 0.2;
      _lines.push(<line key={y0} x1="5" y1={y0} x2="5" y2={y1} opacity={op} />);
      y0 = y1 + gap;
    }

    return [_lines, y0];
  }, [props.counts]);

  return (
    <div
      className="absolute top-0 -translate-x-1/2 flex flex-col items-center text-indigo-500"
      style={{
        left: `${props.left}%`,
      }}
    >
      <svg viewBox={`0 0 10 ${h}`} height={h}>
        <g stroke="currentColor" strokeLinecap="round" strokeWidth={6}>
          {lines}
        </g>
      </svg>
      {props.children}
    </div>
  );
}
