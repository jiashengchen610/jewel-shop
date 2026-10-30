// The backdrop behind the glass: three large, very soft spots of the chart colors over the brand gradient, so the
// glass has something to blur and tint. The colors are roles, so the spots follow the brand and flip with the mode.
// Like a screensaver, each spot roams slowly from one corner of the viewport to another on a loop of its own; they
// stand still at their first stop when the system asks for reduced motion.
//
// SPOTS is the part that belongs in a token (which roles, how large, how strong, how slow, which stops); the roaming
// itself is behavior and stays in code. Until Plinth has a backdrop token, this is the one place that holds those values.
import { useEffect, useRef, type CSSProperties } from "react";

/** Each spot's stops are viewport fractions (0,0 top left; 1,1 bottom right); it visits them in order and loops. */
const SPOTS = [
  { role: "--chart-1", size: 42, strength: 56, period: 52, stops: [[0.15, 0.2], [0.8, 0.25], [0.75, 0.85], [0.2, 0.8], [0.5, 0.5]] },
  { role: "--chart-3", size: 38, strength: 48, period: 64, stops: [[0.85, 0.3], [0.25, 0.85], [0.15, 0.25], [0.8, 0.8], [0.55, 0.15]] },
  { role: "--chart-6", size: 46, strength: 44, period: 58, stops: [[0.45, 0.9], [0.9, 0.6], [0.5, 0.15], [0.1, 0.55], [0.3, 0.4]] },
];
/** A stop as an offset from the viewport's center, in viewport units so a resize needs no recalculation. */
const at = ([x, y]: number[]) => `${((x - 0.5) * 100).toFixed(1)}vw ${((y - 0.5) * 100).toFixed(1)}vh`;

export function Backdrop() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const roams = [...el.querySelectorAll<HTMLElement>("[data-spot]")].map((spot, i) => {
      const s = SPOTS[i];
      const frames = [...s.stops, s.stops[0]].map((p) => ({ translate: at(p), easing: "ease-in-out" }));
      // A negative delay starts each spot partway along its loop, so they never set off together.
      return spot.animate(frames, { duration: s.period * 1000, iterations: Infinity, delay: -i * 9000 });
    });
    return () => roams.forEach((r) => r.cancel());
  }, []);
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {SPOTS.map((s) => (
        <div
          key={s.role}
          data-spot=""
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: `${s.size}vmax`,
            height: `${s.size}vmax`,
            translate: at(s.stops[0]),
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(closest-side, color-mix(in oklab, var(${s.role}) ${s.strength}%, transparent), transparent)`,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}
