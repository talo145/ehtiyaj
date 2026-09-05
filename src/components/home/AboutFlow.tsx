"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { flowStages } from "@/data/flow";
import { flowIllustrations } from "@/data/illustrations";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";
import styles from "./AboutFlow.module.css";

/** كل 3.6 ثانية ينتقل المسار للمرحلة التالية؛ واختيار المستخدم يوقفه 5 ثوانٍ ليقرأ. */
const STEP_MS = 3600;
const HOLD_MS = 5000;

const facts = [
  {
    title: "المشكلة",
    text: "مبادرات تُبنى على التوقّع، وجهود تتكرّر بين الجهات، وصعوبة في الوصول إلى المتطوعين المناسبين.",
  },
  {
    title: "الحل",
    text: "نرصد الاحتياج من مصدره، نحلّل البيانات، نبني الحل، ونقيس الأثر.",
  },
  {
    title: "الميزة",
    text: "لا نضيف منصة أخرى للمبادرات، بل نجعل الاحتياج نقطة البداية لكل مبادرة.",
  },
];

const pad2 = (n: number) => String(n).padStart(2, "0");

export function AboutFlow() {
  const reduced = usePrefersReducedMotion();
  const { ref: sectionRef, seen } = useInView<HTMLElement>(0.3);

  const [step, setStep] = useState(0);
  const [fading, setFading] = useState(false);
  const [shown, setShown] = useState(0);
  const [paused, setPaused] = useState(false);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLSpanElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const knobRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const holdRef = useRef(0);

  /** الشريط يبدأ وينتهي عند مركزَي أول نقطة وآخرها، لا عند حافتَي القسم. */
  const measure = useCallback(() => {
    const track = trackRef.current;
    const line = lineRef.current;
    const fill = fillRef.current;
    const first = knobRefs.current[0];
    const last = knobRefs.current[knobRefs.current.length - 1];
    if (!track || !line || !fill || !first || !last || !track.offsetWidth)
      return;

    const tr = track.getBoundingClientRect();
    const fr = first.getBoundingClientRect();
    const lr = last.getBoundingClientRect();
    const start = tr.right - (fr.left + fr.width / 2);
    const span = fr.left + fr.width / 2 - (lr.left + lr.width / 2);

    line.style.right = `${start}px`;
    line.style.width = `${span}px`;
    fill.style.right = `${start}px`;
  }, []);

  const paintFill = useCallback((i: number, instant: boolean) => {
    const fill = fillRef.current;
    const first = knobRefs.current[0];
    const target = knobRefs.current[i];
    if (!fill || !first || !target) return;
    const fr = first.getBoundingClientRect();
    const kr = target.getBoundingClientRect();
    const w = fr.left + fr.width / 2 - (kr.left + kr.width / 2);
    if (instant) fill.style.transition = "none";
    fill.style.width = `${Math.max(0, w)}px`;
    if (instant) {
      void fill.offsetWidth;
      fill.style.transition = "";
    }
  }, []);

  useLayoutEffect(() => {
    measure();
    paintFill(step, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onResize = () => {
      measure();
      paintFill(step, true);
    };
    window.addEventListener("resize", onResize);
    if (document.fonts?.ready) void document.fonts.ready.then(onResize);
    const t = window.setTimeout(onResize, 400);
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(t);
    };
  }, [measure, paintFill, step]);

  // الرجوع للخلف يعيد الشريط فورًا بدل أن ينكمش ببطء
  useEffect(() => {
    paintFill(step, step < shown);
  }, [step, shown, paintFill]);

  /** تبديل النص بتلاشٍ قصير كي لا يقفز السطر فجأة. */
  useEffect(() => {
    if (reduced) {
      setShown(step);
      return;
    }
    setFading(true);
    const t = window.setTimeout(() => {
      setShown(step);
      setFading(false);
    }, 250);
    return () => window.clearTimeout(t);
  }, [step, reduced]);

  // العرض التلقائي لا يبدأ إلا عند وصول القسم للشاشة
  useEffect(() => {
    if (!seen || reduced || paused) return;
    const timer = window.setInterval(
      () => setStep((s) => (s + 1) % flowStages.length),
      STEP_MS,
    );
    return () => window.clearInterval(timer);
  }, [seen, reduced, paused]);

  useEffect(() => () => window.clearTimeout(holdRef.current), []);

  /** اختيار المستخدم لمرحلة يوقف العرض خمس ثوانٍ ليقرأها، ثم يستأنف. */
  const pick = (i: number) => {
    setStep(i);
    setPaused(true);
    window.clearTimeout(holdRef.current);
    holdRef.current = window.setTimeout(() => setPaused(false), HOLD_MS);
  };

  const active = flowStages[shown];

  return (
    <section
      ref={sectionRef}
      className={styles.about}
      id="about"
      aria-label="عن احتياج"
    >
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.copy}>
            <p className="eyebrow">عن المنصة</p>
            <h2>احتياج</h2>
            <p className={styles.lead}>
              منصة رقمية تربط المستفيدين وأفراد المجتمع بالمتطوعين والجمعيات
              الصحية وغير الربحية والجهات الحكومية والقطاع الخاص، لرصد
              الاحتياجات الفعلية وتحليلها وتحويلها إلى مبادرات قابلة للتنفيذ
              والقياس.
            </p>
            <div className={styles.facts}>
              {facts.map((f) => (
                <div key={f.title} className={styles.fact}>
                  <b>{f.title}</b>
                  <p>{f.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.art} aria-hidden="true">
            {flowIllustrations.map((svg, i) => (
              <figure
                key={i}
                className={cn(i === step && styles.on)}
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            ))}
            <span className={cn(styles.artTag, "mono")}>
              {pad2(step + 1)} / {pad2(flowStages.length)}
            </span>
          </div>
        </div>

        <div className={styles.flow}>
          <p className={styles.flowLabel}>من الاحتياج إلى الأثر</p>

          <div ref={trackRef} className={styles.track}>
            <span ref={lineRef} className={styles.line} aria-hidden="true" />
            <span ref={fillRef} className={styles.fill} aria-hidden="true" />
            <ol
              className={styles.steps}
              role="tablist"
              aria-label="مراحل المسار"
            >
              {flowStages.map((s, i) => (
                <li key={s.name}>
                  <button
                    type="button"
                    role="tab"
                    aria-current={i === step ? "true" : "false"}
                    data-done={i < step ? "true" : "false"}
                    onClick={() => pick(i)}
                  >
                    <span
                      ref={(el) => {
                        knobRefs.current[i] = el;
                      }}
                      className={styles.knob}
                    />
                    <span className={styles.name}>{s.name}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div
            className={cn(styles.caption, fading && styles.out)}
            aria-live="polite"
          >
            <span className={cn(styles.idx, "mono")}>{pad2(shown + 1)}</span>
            <div>
              <b>{active.title}</b>
              <p>{active.text}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
