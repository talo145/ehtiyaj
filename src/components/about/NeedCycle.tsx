"use client";

import { useEffect, useState } from "react";
import { cycleStages } from "@/data/about";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";
import styles from "./NeedCycle.module.css";

const R = 196;
const CX = 300;
const CY = 300;
const STEP_MS = 2600;

/** إحداثيات المرحلة على الحلقة — عكس عقارب الساعة ليتبع اتجاه القراءة. */
function pointAt(i: number, radius: number) {
  const a = ((-90 - i * 45) * Math.PI) / 180;
  return { x: CX + radius * Math.cos(a), y: CY + radius * Math.sin(a) };
}

/** دورة مغلقة: الأثر يعود إلى البيانات، فالمنظومة تتعلّم من نفسها. */
export function NeedCycle() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || paused) return;
    const t = window.setInterval(
      () => setActive((i) => (i + 1) % cycleStages.length),
      STEP_MS,
    );
    return () => window.clearInterval(t);
  }, [reduced, paused]);

  return (
    <div
      className={styles.cycle}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <svg
        className={styles.svg}
        viewBox="0 0 600 600"
        role="img"
        aria-label="دورة العمل: من رصد الاحتياج إلى قياس الأثر ثم التحسين"
      >
        <circle className={styles.ring} cx={CX} cy={CY} r={R} />
        <circle className={styles.core} cx={CX} cy={CY} r={96} />
        <text className={styles.coreTitle} x={CX} y={294}>
          الاحتياج
        </text>
        <text className={styles.coreSub} x={CX} y={320}>
          نقطة البداية
        </text>

        {cycleStages.map((s, i) => {
          const dot = pointAt(i, R);
          const label = pointAt(i, R + 52);
          return (
            <g
              key={s.title}
              className={cn(styles.node, i === active && styles.on)}
              tabIndex={0}
              role="button"
              aria-label={s.title}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActive(i);
                }
              }}
            >
              <circle className={styles.dot} cx={dot.x} cy={dot.y} r={21} />
              <text className={styles.num} x={dot.x} y={dot.y + 4.6}>
                {i + 1}
              </text>
              <text className={styles.label} x={label.x} y={label.y + 5}>
                {s.title}
              </text>
            </g>
          );
        })}
      </svg>

      <div className={styles.side}>
        <b>دورة مغلقة لا خطًّا مستقيمًا</b>
        <p>
          ثماني مراحل تبدأ من رصد الاحتياج وتنتهي بالتحسين، ثم تعود القراءات إلى
          قاعدة البيانات — فتتعلّم المنظومة من كل دورة بدل أن تبدأ كل مبادرة من
          الصفر.
        </p>
        <div className={styles.now}>
          <span>
            المرحلة {active + 1} من {cycleStages.length}
          </span>
          <b>{cycleStages[active].title}</b>
          <p>{cycleStages[active].text}</p>
        </div>
      </div>
    </div>
  );
}
