"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { landmarks } from "@/data/landmarks";
import { map, places } from "@/lib/needs";
import { cn } from "@/lib/cn";
import styles from "./NorthernBordersMap.module.css";

const NB_ISO = "SA-08";
const nbPath = map.regions.find((r) => r.iso === NB_ISO)?.d ?? "";

/** الأماكن الكبيرة تأخذ نقطة أوضح من القرى الصغيرة. */
const isMajor = (kind: string) =>
  kind === "city" || kind === "town" || kind === "suburb";

interface NorthernBordersMapProps {
  /** المحافظة المختارة، أو null لعرض المنطقة كاملة. */
  selected: string | null;
  onSelect: (name: string | null) => void;
}

export function NorthernBordersMap({
  selected,
  onSelect,
}: NorthernBordersMapProps) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [viewBox, setViewBox] = useState<[number, number, number, number]>([
    0,
    0,
    map.w,
    map.h,
  ]);
  const [tagPos, setTagPos] = useState<{ left: number; top: number } | null>(
    null,
  );

  /** إطار يملأ الحاوية بمنطقة الحدود الشمالية، مرفوعًا قليلًا ليتسع أسفلها للأرقام. */
  const computeFrame = useCallback((): [number, number, number, number] => {
    const box = boxRef.current;
    const w = box?.clientWidth || 1000;
    const h = box?.clientHeight || 380;
    const aspect = w / h;
    const pad = 0.1;
    const [x0, y0, x1, y1] = map.nbbox;
    const bw = x1 - x0;
    const bh = y1 - y0;
    let vh = bh * (1 + pad * 2);
    let vw = vh * aspect;
    if (vw < bw * (1 + pad * 2)) {
      vw = bw * (1 + pad * 2);
      vh = vw / aspect;
    }
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    return [cx - vw / 2, cy - vh * 0.44, vw, vh];
  }, []);

  useEffect(() => {
    const update = () => setViewBox(computeFrame());
    update();
    let t = 0;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(update, 160);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, [computeFrame]);

  /** موضع البطاقة يُحسب من مركز المحافظة بعد إسقاط viewBox على البكسلات. */
  useEffect(() => {
    const box = boxRef.current;
    if (!box || !selected) {
      setTagPos(null);
      return;
    }
    const gov = map.govs.find((g) => g.name === selected);
    if (!gov) return;
    const w = box.clientWidth;
    const h = box.clientHeight;
    const scale = Math.min(w / viewBox[2], h / viewBox[3]);
    const ox = (w - viewBox[2] * scale) / 2;
    const oy = (h - viewBox[3] * scale) / 2;
    setTagPos({
      left: ox + (gov.cx - viewBox[0]) * scale,
      top: oy + (gov.cy - viewBox[1]) * scale,
    });
  }, [selected, viewBox]);

  const selectedGov = selected
    ? map.govs.find((g) => g.name === selected)
    : undefined;
  const landmark = selected ? landmarks[selected] : undefined;

  return (
    <div
      ref={boxRef}
      className={styles.box}
      role="application"
      aria-label="خريطة منطقة الحدود الشمالية — اضغط أي محافظة لعرض أرقامها"
    >
      <svg
        ref={svgRef}
        viewBox={viewBox.join(" ")}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        onClick={(e) => {
          // الضغط خارج أي محافظة يلغي الاختيار ويعيد أرقام المنطقة
          if (!(e.target as SVGElement).closest(`.${styles.gv}`))
            onSelect(null);
        }}
      >
        <defs>
          {map.govs.map((g, i) => {
            const lm = landmarks[g.name];
            if (!lm) return null;
            return (
              <pattern
                key={g.name}
                id={`nb-photo-${i}`}
                patternUnits="objectBoundingBox"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <image
                  href={lm.src}
                  x="0"
                  y="0"
                  width="1"
                  height="1"
                  preserveAspectRatio="xMidYMid slice"
                />
              </pattern>
            );
          })}
          <clipPath id="nb-clip">
            <path d={nbPath} />
          </clipPath>
        </defs>

        <g clipPath="url(#nb-clip)">
          {map.govs.map((g, i) =>
            landmarks[g.name] ? (
              <path
                key={`photo-${g.name}`}
                className={cn(
                  styles.photo,
                  selected === g.name && styles.photoOn,
                )}
                d={g.d}
                fill={`url(#nb-photo-${i})`}
              />
            ) : null,
          )}

          <path
            className={styles.tint}
            d={selectedGov?.d ?? ""}
            opacity={selected && landmark ? 1 : 0}
          />

          {map.govs.map((g, i) => (
            <path
              key={g.name}
              className={cn(
                styles.gv,
                selected === g.name && styles.sel,
                selected && selected !== g.name && styles.dim,
              )}
              data-i={i}
              d={g.d}
              tabIndex={0}
              role="button"
              aria-pressed={selected === g.name}
              aria-label={`محافظة ${g.name}`}
              onClick={() => onSelect(selected === g.name ? null : g.name)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(selected === g.name ? null : g.name);
                }
              }}
            />
          ))}
        </g>

        {/* نقاط الاحتياج تظهر وتختفي على المدن والقرى */}
        <g clipPath="url(#nb-clip)">
          {places.map((p, i) => {
            const big = isMajor(p.k);
            const delay = `${((i * 137) % 400) / 100}s`;
            const origin = {
              transformOrigin: `${p.x}px ${p.y}px`,
              animationDelay: delay,
            };
            return (
              <g key={`${p.n}-${i}`}>
                <circle
                  className={styles.pulse}
                  cx={p.x}
                  cy={p.y}
                  r={3}
                  style={origin}
                />
                <circle
                  className={cn(styles.dot, !big && styles.dotSmall)}
                  cx={p.x}
                  cy={p.y}
                  r={big ? 2.6 : 1.8}
                  style={origin}
                />
              </g>
            );
          })}
        </g>

        <path className={styles.edge} d={nbPath} />
      </svg>

      <div
        className={cn(styles.tag, selected && tagPos && styles.tagOn)}
        style={tagPos ? { left: tagPos.left, top: tagPos.top } : undefined}
      >
        <span className={styles.tagText}>
          <b>{selected ? `محافظة ${selected}` : ""}</b>
          <small>
            {landmark ? `${landmark.caption} · ${landmark.credit}` : ""}
          </small>
        </span>
        <Link href="/needs-map">
          تصفّح{" "}
          <span className="arrow" aria-hidden="true">
            ←
          </span>
        </Link>
      </div>
    </div>
  );
}
