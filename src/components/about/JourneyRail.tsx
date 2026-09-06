"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import styles from "./About.module.css";

interface JourneyRailProps {
  /** أسماء المحطات بالترتيب — معرّف كل قسم هو `step-{index}`. */
  stops: string[];
}

/** شريط لاصق يُظهر المحطة الحالية، وتحته خط يمتلئ مع التمرير. */
export function JourneyRail({ stops }: JourneyRailProps) {
  const [active, setActive] = useState(0);
  const barRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const sections = stops
      .map((_, i) => document.getElementById(`step-${i}`))
      .filter(Boolean);
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = Number((e.target as HTMLElement).id.replace("step-", ""));
          setActive(i);
        }
      },
      { rootMargin: "-160px 0px -60% 0px" },
    );
    sections.forEach((s) => io.observe(s as Element));

    const onScroll = () => {
      const first = sections[0] as HTMLElement;
      const last = sections[sections.length - 1] as HTMLElement;
      const start = first.getBoundingClientRect().top + window.scrollY;
      const end =
        last.getBoundingClientRect().top + window.scrollY + last.offsetHeight;
      const p =
        (window.scrollY + window.innerHeight * 0.5 - start) / (end - start);
      if (barRef.current)
        barRef.current.style.width = `${Math.max(0, Math.min(1, p)) * 100}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [stops]);

  return (
    <div className={styles.rail}>
      <div className={styles.railIn}>
        {stops.map((s, i) => (
          <span key={s} style={{ display: "contents" }}>
            {i ? (
              <span className={styles.railSep} aria-hidden="true">
                ←
              </span>
            ) : null}
            <button
              type="button"
              className={cn(styles.railItem, i === active && styles.on)}
              onClick={() =>
                document
                  .getElementById(`step-${i}`)
                  ?.scrollIntoView({ block: "start" })
              }
            >
              <i />
              {s}
            </button>
          </span>
        ))}
      </div>
      <div className={styles.railBar}>
        <em ref={barRef} />
      </div>
    </div>
  );
}
