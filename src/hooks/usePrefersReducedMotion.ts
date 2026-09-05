"use client";

import { useEffect, useState } from "react";

/** يقرأ تفضيل تقليل الحركة ويتابع تغيّره.
 *  يبدأ بـ false على الخادم ثم يصحّح نفسه بعد الترطيب. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
