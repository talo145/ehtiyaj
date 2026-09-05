"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { associations } from "@/data/associations";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { formatNumber } from "@/lib/needs";
import type { Association } from "@/types";
import styles from "./AssociationsSection.module.css";

const COLUMNS = 3;
/** سرعات مختلفة قليلًا لكل عمود كي لا يبدو الانسياب كتلة واحدة. */
const SPEEDS = [1, 0.78, 1.18];

function AssociationCard({ a }: { a: Association }) {
  return (
    <article className={styles.card}>
      <span className={styles.logo} aria-hidden="true">
        {a.initial}
      </span>
      <b className={styles.title}>{a.name}</b>
      <span className={styles.city}>{a.place}</span>
      <div className={styles.stats}>
        <div>
          <b className="tabular">{formatNumber(a.initiatives)}</b>
          <span>مبادرة</span>
        </div>
        <div>
          <b className="tabular">{formatNumber(a.needs)}</b>
          <span>احتياج</span>
        </div>
      </div>
      <Link className={styles.cardBtn} href={`/associations/${a.id}`}>
        عرض الجمعية
        <span className="arrow" aria-hidden="true">
          ←
        </span>
      </Link>
    </article>
  );
}

export function AssociationsSection() {
  const reduced = usePrefersReducedMotion();
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const colRefs = useRef<Array<HTMLDivElement | null>>([]);
  /** التوقّف مرجع لا حالة، كي لا تُعاد تهيئة حلقة الرسم عند كل مرور بالمؤشر. */
  const pausedRef = useRef(false);

  /** كل عمود يأخذ نصيبه من الجمعيات، ثم يُكرَّر مرة ليكون الالتفاف غير مرئي. */
  const columns = useMemo(() => {
    const cols: Association[][] = Array.from({ length: COLUMNS }, () => []);
    associations.forEach((a, i) => cols[i % COLUMNS].push(a));
    return cols;
  }, []);

  useEffect(() => {
    if (reduced) return;
    const els = colRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!els.length) return;

    const state = els.map((el, i) => ({
      el,
      off: 0,
      half: 0,
      speed: SPEEDS[i] ?? 1,
    }));

    const measure = () => {
      for (const s of state) {
        s.half = s.el.scrollHeight / 2;
        s.off = s.half;
        s.el.style.transform = `translateY(${-s.off}px)`;
      }
    };

    measure();
    const t = window.setTimeout(measure, 600);
    window.addEventListener("resize", measure);

    let raf = 0;
    let last = 0;
    const tick = (ts: number) => {
      if (!last) last = ts;
      const dt = Math.min(48, ts - last);
      last = ts;
      if (!pausedRef.current) {
        for (const s of state) {
          s.off -= dt * 0.026 * s.speed;
          if (s.off <= 0) s.off += s.half;
          s.el.style.transform = `translateY(${-s.off}px)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, [reduced]);

  const setPaused = (v: boolean) => {
    pausedRef.current = v;
  };

  return (
    <section
      className="section"
      id="associations"
      aria-label="الجمعيات المسجّلة"
    >
      <div className="wrap">
        <SectionHeading
          title="جمعيات مسجّلة في احتياج"
          subtitle="لكل جمعية نطاق تغطية جغرافي وتصنيفي، فلا تصلها إلا الاحتياجات التي تخصّها فعلًا."
          action={
            <Button href="/associations" variant="outline" size="lg" withArrow>
              كل الجمعيات
            </Button>
          }
        />

        {associations.length === 0 ? (
          <EmptyState
            title="لا توجد جمعيات مسجّلة بعد"
            hint="ستظهر هنا الجمعيات فور اعتماد تسجيلها داخل نطاق التغطية."
          />
        ) : (
          <div
            ref={viewportRef}
            className={styles.viewport}
            aria-label="عرض متحرك للجمعيات"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            {columns.map((col, i) => (
              <div
                key={i}
                ref={(el) => {
                  colRefs.current[i] = el;
                }}
                className={styles.col}
              >
                {[...col, ...col].map((a, k) => (
                  <AssociationCard key={`${a.id}-${k}`} a={a} />
                ))}
              </div>
            ))}
          </div>
        )}

        <p className="data-note">
          {associations.length} جمعية مسجّلة — بيانات تجريبية للعرض.
        </p>
      </div>
    </section>
  );
}
