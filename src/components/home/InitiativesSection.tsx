"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Badge, toneOfStatus } from "@/components/ui/Badge";
import { initiatives } from "@/data/initiatives";
import { associationsById } from "@/data/associations";
import { needCategories } from "@/data/categories";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";
import type { Initiative } from "@/types";
import styles from "./InitiativesSection.module.css";

/** إيقاع الخطو، وزمن التوقّف بعد تدخّل المستخدم. */
const STEP_MS = 2500;
const HOLD_MS = 5000;

const n = initiatives.length;

function ShareButtons({ title }: { title: string }) {
  return (
    <div className={styles.share}>
      <button
        type="button"
        aria-label={`مشاركة «${title}» على واتساب`}
        title="مشاركة (تجريبي)"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-2.9.8.8-2.8-.2-.3A8.2 8.2 0 1 1 12 20.2Z" />
        </svg>
      </button>
      <button
        type="button"
        aria-label={`نسخ رابط «${title}»`}
        title="نسخ الرابط (تجريبي)"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M6.5 9.5a3 3 0 0 0 4.2 0l2-2a3 3 0 0 0-4.2-4.2l-.7.7" />
          <path d="M9.5 6.5a3 3 0 0 0-4.2 0l-2 2a3 3 0 0 0 4.2 4.2l.7-.7" />
        </svg>
      </button>
    </div>
  );
}

function InitiativeCard({
  item,
  active,
}: {
  item: Initiative;
  active: boolean;
}) {
  return (
    <article className={cn(styles.card, active && styles.active)}>
      <Badge tone={toneOfStatus[item.status]}>{item.statusLabel}</Badge>
      <h3>{item.title}</h3>
      <span className={styles.org}>
        {associationsById.get(item.associationId)?.name}
      </span>
      <div className={styles.meta}>
        <span>{item.city}</span>
        <span>{needCategories[item.category]}</span>
      </div>
      <div className={styles.foot}>
        <Link className={styles.link} href={`/initiatives/${item.id}`}>
          تفاصيل المبادرة
        </Link>
        <ShareButtons title={item.title} />
      </div>
    </article>
  );
}

export function InitiativesSection() {
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const holdRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  /** يقفز فورًا بلا حركة عند الالتفاف من آخر بطاقة إلى أولها. */
  const [instant, setInstant] = useState(true);

  const cardStep = useCallback(() => {
    const track = trackRef.current;
    const first = track?.children[0] as HTMLElement | undefined;
    if (!track || !first) return 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 16;
    return first.getBoundingClientRect().width + gap;
  }, []);

  // اتجاه RTL: الإزاحة الموجبة تسحب الشريط لليمين فتصل البطاقة النشطة للحافة
  const [offset, setOffset] = useState(0);
  const reposition = useCallback(
    () => setOffset(index * cardStep()),
    [index, cardStep],
  );

  useEffect(() => {
    reposition();
    window.addEventListener("resize", reposition);
    return () => window.removeEventListener("resize", reposition);
  }, [reposition]);

  const indexRef = useRef(0);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    if (reduced || paused) return;
    const t = window.setInterval(() => {
      const next = indexRef.current + 1;
      // العودة من آخر بطاقة إلى الأولى تقفز بلا حركة كي لا يظهر الشريط راجعًا
      setInstant(next >= n);
      setIndex(next >= n ? 0 : next);
    }, STEP_MS);
    return () => window.clearInterval(t);
  }, [reduced, paused]);

  useEffect(() => () => window.clearTimeout(holdRef.current), []);

  const seek = (i: number) => {
    setInstant(false);
    setIndex(i);
    setPaused(true);
    window.clearTimeout(holdRef.current);
    holdRef.current = window.setTimeout(() => setPaused(false), HOLD_MS);
  };

  return (
    <section className="section" id="initiatives" aria-label="المبادرات">
      <div className="wrap">
        <SectionHeading
          title="المبادرات"
          subtitle="كل مبادرة هنا بدأت من احتياج مسجّل داخل المنطقة، لا من تقدير."
          action={
            <Button href="/initiatives" variant="outline" size="lg" withArrow>
              كل المبادرات
            </Button>
          }
        />

        {n === 0 ? (
          <EmptyState
            title="لا توجد مبادرات في هذه المنطقة حاليًا"
            hint="تُبنى المبادرات على الاحتياجات المسجّلة، وستظهر هنا فور إطلاق أولها."
          />
        ) : (
          <>
            <div
              className={styles.viewport}
              aria-label="عرض متحرك للمبادرات"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
            >
              <div
                ref={trackRef}
                className={styles.track}
                style={{
                  transform: `translateX(${offset}px)`,
                  transition: instant ? "none" : undefined,
                }}
              >
                {/* نسختان من القائمة كي لا تفرغ الحافة أثناء الخطو */}
                {[...initiatives, ...initiatives].map((item, i) => (
                  <InitiativeCard
                    key={`${item.id}-${i}`}
                    item={item}
                    active={i % n === index}
                  />
                ))}
              </div>
            </div>

            <div
              className={styles.segbar}
              role="tablist"
              aria-label="التنقل بين المبادرات"
            >
              {initiatives.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-label={`المبادرة ${i + 1}: ${item.title}`}
                  aria-current={i === index ? "true" : "false"}
                  className={i < index ? styles.done : undefined}
                  onClick={() => seek(i)}
                />
              ))}
            </div>

            <p className={styles.hint}>
              ينتقل إلى المبادرة التالية كل ثانيتين ونصف — قف عليه بالمؤشر
              ليتوقف، أو اضغط أي مقطع للانتقال.
            </p>
          </>
        )}

        <p className="data-note">{n} مبادرة — بيانات تجريبية للعرض.</p>
      </div>
    </section>
  );
}
