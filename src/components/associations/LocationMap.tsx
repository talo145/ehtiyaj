import styles from "./LocationMap.module.css";

/** مولّد عشوائي ثابت البذرة، فتبقى الخريطة نفسها لكل جمعية بين كل عرض وآخر. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const W = 1000;
const H = 560;

const MAIN_ROADS = [
  "M0 210 L1000 186",
  "M0 402 L1000 430",
  "M300 0 L268 560",
  "M690 0 L724 560",
];
const SIDE_ROADS = [
  "M0 100 L1000 88",
  "M0 300 L1000 312",
  "M0 500 L1000 494",
  "M140 0 L128 560",
  "M470 0 L452 560",
  "M860 0 L878 560",
];

interface LocationMapProps {
  /** اسم يظهر على المؤشّر. */
  label: string;
  /** يحدّد توزيع المباني، فتختلف الخريطة بين جهة وأخرى. */
  seed: number;
}

/** خريطة توضيحية لموقع الجهة.
 *  تُستبدل عند الربط بمُضمَّن خرائط جوجل على الإحداثيات الفعلية —
 *  الحاوية والمقاسات جاهزة لذلك. */
export function LocationMap({ label, seed }: LocationMapProps) {
  const rnd = seeded(seed);
  const blocks = Array.from({ length: 46 }, () => {
    const x = rnd() * (W - 90);
    const y = rnd() * (H - 70);
    return {
      x: Math.round(x),
      y: Math.round(y),
      w: Math.round(46 + rnd() * 96),
      h: Math.round(34 + rnd() * 62),
      o: Number((0.55 + rnd() * 0.4).toFixed(2)),
    };
  });

  const px = 470;
  const py = 300;

  return (
    <div className={styles.box}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={`خريطة توضيحية لموقع ${label}`}
      >
        <rect width={W} height={H} fill="#0E1B23" />

        {blocks.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx="3"
            fill="#14252F"
            opacity={b.o}
          />
        ))}

        <rect
          x="86"
          y="360"
          width="210"
          height="140"
          rx="14"
          fill="#123A32"
          opacity=".85"
        />
        <text x="191" y="436" fill="#2E6E5F" fontSize="17" textAnchor="middle">
          حديقة عامة
        </text>
        <path
          d="M760 40 q70 60 40 130 q-30 70 40 120 l160 0 0 -250 Z"
          fill="#123043"
          opacity=".9"
        />

        {SIDE_ROADS.map((d) => (
          <path key={d} d={d} stroke="#1D323D" strokeWidth="10" fill="none" />
        ))}
        {MAIN_ROADS.map((d) => (
          <path key={d} d={d} stroke="#2A4756" strokeWidth="20" fill="none" />
        ))}
        {MAIN_ROADS.map((d) => (
          <path
            key={`dash-${d}`}
            d={d}
            stroke="#33566A"
            strokeWidth="2"
            fill="none"
            strokeDasharray="12 14"
            opacity=".8"
          />
        ))}

        <text x="500" y="180" fill="#6E8898" fontSize="15" textAnchor="middle">
          طريق الملك عبدالعزيز
        </text>
        <text x="500" y="452" fill="#6E8898" fontSize="15" textAnchor="middle">
          طريق الأمير عبدالإله
        </text>

        <circle cx={px} cy={py} r="46" fill="#16B3A0" opacity=".14" />
        <circle cx={px} cy={py} r="26" fill="#16B3A0" opacity=".2" />
        <path
          d={`M${px} ${py - 44} a17 17 0 0 1 17 17 c0 12 -17 31 -17 31 s-17 -19 -17 -31 a17 17 0 0 1 17 -17 Z`}
          fill="#16B3A0"
        />
        <circle cx={px} cy={py - 27} r="6" fill="#04070A" />
        <rect
          x={px - 132}
          y={py + 16}
          width="264"
          height="46"
          rx="12"
          fill="#061118"
          stroke="rgba(22,179,160,.45)"
        />
        <text
          x={px}
          y={py + 45}
          fill="#EAF2F5"
          fontSize="17"
          fontWeight="600"
          textAnchor="middle"
        >
          {label}
        </text>
      </svg>

      <div className={styles.controls}>
        <button type="button" aria-label="تكبير">
          +
        </button>
        <button type="button" aria-label="تصغير">
          −
        </button>
      </div>
      <span className={styles.note}>
        خريطة توضيحية — تُستبدل بخرائط جوجل عند الربط
      </span>
    </div>
  );
}
