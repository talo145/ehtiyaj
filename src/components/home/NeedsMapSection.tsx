"use client";

import { useState } from "react";
import { NorthernBordersMap } from "@/components/map/NorthernBordersMap";
import { Button } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { useInView } from "@/hooks/useInView";
import { map, regionTotals, totalsByGovernorate } from "@/lib/needs";
import styles from "./NeedsMapSection.module.css";

export function NeedsMapSection() {
  const [selected, setSelected] = useState<string | null>(null);
  const { ref, seen } = useInView<HTMLElement>(0.25);

  // الأرقام تتبع المحافظة المختارة، فإن لم تُختر واحدة فهي أرقام المنطقة كاملة
  const totals = (selected && totalsByGovernorate[selected]) || regionTotals;

  const cells = [
    { value: totals.needs, label: "احتياج مسجّل" },
    { value: totals.beneficiaries, label: "مستفيد" },
    { value: totals.places, label: "مدينة وقرية" },
    { value: totals.highPriority, label: "أولوية عالية" },
  ];

  return (
    <section
      ref={ref}
      className={styles.section}
      id="needs-map"
      aria-label="خريطة الاحتياج"
    >
      <div className={styles.head}>
        <h2>أين يتركز الاحتياج؟</h2>
        <p>
          الحدود الشمالية أولًا: {map.govs.length} محافظات و
          {regionTotals.places} مدينة وقرية، بأرقام تتحدث مع كل محافظة تختارها.
        </p>
      </div>

      <NorthernBordersMap selected={selected} onSelect={setSelected} />

      <div className={styles.foot}>
        <div className={styles.nums}>
          {cells.map((c) => (
            <div key={c.label} className={styles.num}>
              <b>
                <CountUp to={c.value} start={seen} duration={800} />
              </b>
              <span>{c.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.cta}>
          <Button href="/needs-map" variant="cta" size="lg" withArrow>
            تصفّح الخريطة
          </Button>
        </div>

        <p className="data-note">
          بيانات تجريبية للعرض — الأرقام مجمّعة على مستوى المدينة ولا تكشف أي
          بيان شخصي.
        </p>
      </div>
    </section>
  );
}
