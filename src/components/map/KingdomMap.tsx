"use client";

import { useEffect, useRef } from "react";
import { map } from "@/lib/needs";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";
import styles from "./KingdomMap.module.css";

type Box = [number, number, number, number];

const NB_ISO = "SA-08";
const KINGDOM: Box = [0, 0, map.w, map.h];
const nbPath = map.regions.find((r) => r.iso === NB_ISO)?.d ?? "";

/** إطار يضمن ظهور الشكل كاملًا داخل الحاوية مع هامش، ومع إزاحة أفقية للتركيز. */
function frameFor(
  bounds: Box,
  aspect: number,
  focusX: number,
  pad: number,
): Box {
  const bw = bounds[2] - bounds[0];
  const bh = bounds[3] - bounds[1];
  let h = bh * (1 + pad * 2);
  let w = h * aspect;
  if (w < bw * (1 + pad * 2)) {
    w = bw * (1 + pad * 2);
    h = w / aspect;
  }
  // لا يخرج الشكل عن الإطار مهما كانت الإزاحة
  const minF = Math.min((bw / 2 + bw * 0.06) / w, 0.5);
  const fx = Math.min(Math.max(focusX, minF), 1 - minF);
  const cx = (bounds[0] + bounds[2]) / 2;
  const cy = (bounds[1] + bounds[3]) / 2;
  return [cx - w * fx, cy - h / 2, w, h];
}

function lerp(a: Box, b: Box, t: number): Box {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
    a[3] + (b[3] - a[3]) * t,
  ];
}

interface KingdomMapProps {
  /** وصف بديل للخريطة لمن لا يراها. */
  label: string;
}

export function KingdomMap({ label }: KingdomMapProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const lineRef = useRef<SVGPathElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    const svg = svgRef.current;
    const line = lineRef.current;
    if (!host || !svg || !line) return;

    let wide: Box = KINGDOM;
    let near: Box = KINGDOM;
    let raf = 0;
    const timers: number[] = [];

    const dimDots = svg.querySelectorAll<SVGCircleElement>(
      `.${styles.city}:not(.${styles.cityOn})`,
    );
    const onDots = svg.querySelectorAll<SVGCircleElement>(`.${styles.cityOn}`);
    const halos = svg.querySelectorAll<SVGCircleElement>(`.${styles.halo}`);

    const measure = () => {
      const aspect = (host.clientWidth || 1200) / (host.clientHeight || 640);
      const narrow = window.innerWidth <= 1000;
      wide = frameFor(
        KINGDOM,
        aspect,
        narrow ? 0.5 : 0.25,
        narrow ? 0.06 : 0.24,
      );
      near = frameFor(
        map.nbbox as Box,
        aspect,
        narrow ? 0.5 : 0.28,
        narrow ? 0.16 : 0.4,
      );
    };

    /** أنصاف أقطار النقاط تتبع مستوى التقريب كي تبقى بنفس الحجم البصري. */
    const setBox = (b: Box) => {
      svg.setAttribute("viewBox", b.map((v) => v.toFixed(1)).join(" "));
      const k = b[2] / (KINGDOM[2] * 1.15);
      dimDots.forEach((d) => d.setAttribute("r", (5.5 * k).toFixed(2)));
      onDots.forEach((d) => d.setAttribute("r", (8 * k).toFixed(2)));
      halos.forEach((d) => d.setAttribute("r", (26 * k).toFixed(2)));
      line.setAttribute("stroke-width", (2.6 * k).toFixed(2));
    };

    const settle = () => {
      host.classList.add(styles.zoomed);
      setBox(near);
      line.style.transition = "none";
      line.style.strokeDasharray = "none";
      line.style.strokeDashoffset = "0";
    };

    measure();
    setBox(wide);

    if (reduced) {
      settle();
    } else {
      const len = line.getTotalLength?.() ?? 0;
      if (len) {
        line.style.transition = "none";
        line.style.strokeDasharray = `${len} ${len}`;
        line.style.strokeDashoffset = String(len);
      }
      timers.push(
        window.setTimeout(() => {
          host.classList.add(styles.zoomed);
          if (len) {
            line.style.transition =
              "stroke-dashoffset 1.7s cubic-bezier(.4,0,.2,1) .3s, opacity .4s ease";
            line.style.strokeDashoffset = "0";
          }
          const dur = 2000;
          let t0: number | null = null;
          let done = false;
          const step = (ts: number) => {
            if (t0 === null) t0 = ts;
            const p = Math.min((ts - t0) / dur, 1);
            const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
            setBox(lerp(wide, near, e));
            if (p < 1) raf = requestAnimationFrame(step);
            else done = true;
          };
          raf = requestAnimationFrame(step);
          // شبكة أمان: لو توقّف الإطار لأي سبب، نستقر على الوضع النهائي
          timers.push(
            window.setTimeout(() => {
              if (!done) {
                cancelAnimationFrame(raf);
                settle();
              }
            }, dur + 900),
          );
        }, 1400),
      );
    }

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        measure();
        setBox(host.classList.contains(styles.zoomed) ? near : wide);
      }, 160);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(window.clearTimeout);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, [reduced]);

  return (
    <div ref={hostRef} className={styles.host} role="img" aria-label={label}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${map.w} ${map.h}`}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g>
          {map.regions.map((r) => (
            <path
              key={r.iso}
              className={cn(styles.region, r.iso === NB_ISO && styles.nb)}
              d={r.d}
            />
          ))}
        </g>
        <path className={styles.outline} d={map.adm0} />
        <g className={styles.govs}>
          {map.govs.map((g) => (
            <path key={g.name} className={styles.gov} d={g.d} />
          ))}
        </g>
        <path ref={lineRef} className={styles.nbLine} d={nbPath} />
        <g>
          {map.cities.map((c, i) =>
            c.a ? (
              <g key={`${c.n}-${i}`}>
                <circle className={styles.halo} cx={c.x} cy={c.y} r={26} />
                <circle
                  className={cn(styles.city, styles.cityOn)}
                  cx={c.x}
                  cy={c.y}
                  r={8}
                />
              </g>
            ) : (
              <circle
                key={`${c.n}-${i}`}
                className={styles.city}
                cx={c.x}
                cy={c.y}
                r={5.5}
              />
            ),
          )}
        </g>
      </svg>
    </div>
  );
}
