import { KingdomMap } from "@/components/map/KingdomMap";
import { Button } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { regionTotals } from "@/lib/needs";
import styles from "./Hero.module.css";

const MAP_LABEL =
  "خريطة المملكة بحدود مناطقها الثلاث عشرة تظهر كاملة، ثم تقرّب على منطقة الحدود الشمالية " +
  "فتظهر محافظاتها الأربع: عرعر ورفحاء وطريف والعويقيلة";

export function Hero() {
  return (
    <section className={styles.hero} id="hero" aria-label="قسم البطل">
      <KingdomMap label={MAP_LABEL} />
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.copy}>
          <h1>
            نعرف الاحتياج… لنصنع الأثر.
            <span className={styles.line2}>
              <CountUp
                to={regionTotals.needs}
                prefix="+"
                className={styles.count}
              />{" "}
              احتياج مسجّل حتى الآن
            </span>
          </h1>

          <div className={styles.cta}>
            <Button href="/#needs-map" variant="cta" size="lg" withArrow>
              استكشف خريطة الاحتياج
            </Button>
            <Button href="/#about" variant="text">
              تعرّف على المنصة
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.hint} aria-hidden="true">
        <span>مرّر للأسفل</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 2v11M3.5 8.5L8 13l4.5-4.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
