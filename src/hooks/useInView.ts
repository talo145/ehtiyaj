"use client";

import { useEffect, useRef, useState } from "react";

/** يُرجع مرجعًا وعلامة تصير true عند أول ظهور للعنصر ثم تبقى.
 *  تُستعمل لتشغيل العدّادات والحركة عند وصول القسم لا عند تحميل الصفحة. */
export function useInView<T extends HTMLElement>(threshold = 0.4) {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, seen } as const;
}
