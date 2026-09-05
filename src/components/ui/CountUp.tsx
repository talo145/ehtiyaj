"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { formatNumber } from "@/lib/needs";
import { cn } from "@/lib/cn";

interface CountUpProps {
  to: number;
  /** يبدأ العدّ عند تحوّلها إلى true — عادةً عند دخول القسم للشاشة. */
  start?: boolean;
  duration?: number;
  prefix?: string;
  className?: string;
}

/** عدّاد يعدّ من قيمته الحالية إلى الهدف، فينتقل بسلاسة عند تغيّر المحافظة المختارة.
 *  يعرض الرقم النهائي فورًا عند تفضيل تقليل الحركة، ويُصيَّر على الخادم كرقم كامل. */
export function CountUp({
  to,
  start = true,
  duration = 1500,
  prefix = "",
  className,
}: CountUpProps) {
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(to);
  const fromRef = useRef(to);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!start) return;
    if (reduced) {
      fromRef.current = to;
      setValue(to);
      return;
    }
    // أول تشغيل يبدأ من الصفر؛ التغييرات اللاحقة تبدأ من الرقم المعروض
    const from = hasRun.current ? fromRef.current : 0;
    hasRun.current = true;
    let raf = 0;
    let t0: number | null = null;

    const step = (ts: number) => {
      if (t0 === null) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = Math.round(from + (to - from) * eased);
      setValue(next);
      fromRef.current = next;
      if (p < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, start, duration, reduced]);

  return (
    <span className={cn("tabular", className)}>
      {prefix}
      {formatNumber(value)}
    </span>
  );
}
