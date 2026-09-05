import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { NeedCycle } from "@/components/about/NeedCycle";
import { JourneyRail } from "@/components/about/JourneyRail";
import { StepArt, type StepArtKind } from "@/components/about/StepArt";
import {
  audiences,
  challengePairs,
  impactAreas,
  partners,
  platformTracks,
  visionTargets,
} from "@/data/about";
import { associations } from "@/data/associations";
import { needCategories } from "@/data/categories";
import { formatNumber, map, regionTotals } from "@/lib/needs";
import styles from "@/components/about/About.module.css";

export const metadata: Metadata = {
  title: "عن احتياج",
  description:
    "احتياج منصة رقمية تجعل الاحتياج نقطة البداية لكل مبادرة صحية: نرصد الاحتياج، نحلّل البيانات، نبني الحل، ونقيس الأثر.",
};

const AUDIENCE_ICONS: Record<string, React.ReactNode> = {
  person: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path
        d="M4.8 20c.6-3.6 3.6-5.6 7.2-5.6s6.6 2 7.2 5.6"
        strokeLinecap="round"
      />
    </>
  ),
  building: (
    <>
      <path d="M4 20V9.5L12 5l8 4.5V20" strokeLinejoin="round" />
      <path d="M9.5 20v-5h5v5" strokeLinejoin="round" />
    </>
  ),
  heart: (
    <path
      d="M12 20.5S4.5 15.6 4.5 10.2A3.9 3.9 0 0 1 12 8.3a3.9 3.9 0 0 1 7.5 1.9c0 5.4-7.5 10.3-7.5 10.3Z"
      strokeLinejoin="round"
    />
  ),
  gov: (
    <path
      d="M3.5 20h17M5.5 20V9.5M18.5 20V9.5M12 3.5 20 8H4l8-4.5Z"
      strokeLinejoin="round"
    />
  ),
  case: (
    <>
      <rect x="3.5" y="8" width="17" height="11.5" rx="2" />
      <path
        d="M9 8V6.2A2 2 0 0 1 11 4.2h2a2 2 0 0 1 2 2V8"
        strokeLinejoin="round"
      />
    </>
  ),
};

/** جدول التحدي مقابل ما تفعله المنصة. */
function ChallengeTable() {
  return (
    <div className={styles.pair}>
      <div className={styles.pairHead}>
        <span>التحدي القائم</span>
        <span />
        <span>ما تفعله احتياج</span>
      </div>
      {challengePairs.map(([bad, good]) => (
        <div key={bad} className={styles.pairRow}>
          <div className={styles.pairBad}>{bad}</div>
          <div className={styles.pairMid} aria-hidden="true">
            ←
          </div>
          <div className={styles.pairGood}>{good}</div>
        </div>
      ))}
    </div>
  );
}

/** كيف يصل الاحتياج إلى الجهة المناسبة. */
function MatchDiagram() {
  return (
    <div className={styles.match}>
      <div className={styles.matchBox}>
        <b>احتياج مسجّل</b>
        <div className={styles.tags}>
          <span className={styles.hit}>رفحاء</span>
          <span className={styles.hit}>دعم نفسي</span>
          <span>أولوية عالية</span>
          <span>مسجّل بواسطة مستفيد</span>
        </div>
      </div>
      <div className={styles.matchLink}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          aria-hidden="true"
        >
          <path d="M9.5 14.5 14.5 9.5" strokeLinecap="round" />
          <path
            d="M12.8 7.2 14.2 5.8a3.6 3.6 0 0 1 5.1 5.1l-1.4 1.4M11.2 16.8l-1.4 1.4a3.6 3.6 0 0 1-5.1-5.1l1.4-1.4"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className={styles.matchBox}>
        <b>نطاق تغطية جمعية</b>
        <div className={styles.tags}>
          <span className={styles.hit}>رفحاء</span>
          <span>لينة</span>
          <span className={styles.hit}>دعم نفسي</span>
          <span>توعية ووقاية</span>
        </div>
      </div>
    </div>
  );
}

/** من «مبادرات ثم البحث عن مستفيدين» إلى «احتياج ← … ← أثر». */
function ShiftDiagram() {
  return (
    <div className={styles.shift}>
      <div className={`${styles.shiftBox} ${styles.shiftBad}`}>
        <span className={styles.k}>الطريقة السائدة</span>
        <b>مبادرات… ثم البحث عن مستفيدين</b>
        <p>
          تُصمَّم المبادرة أولًا بناءً على التوقّع، ثم يُبحث عمّن يستفيد منها —
          فيتكرّر الجهد وتبقى احتياجات أخرى بلا استجابة.
        </p>
      </div>
      <div className={styles.shiftMid} aria-hidden="true">
        ←
      </div>
      <div className={`${styles.shiftBox} ${styles.shiftGood}`}>
        <span className={styles.k}>طريقة احتياج</span>
        <b>احتياج ← بيانات ← أولوية ← مبادرة ← موارد ← أثر</b>
        <p>
          يبدأ كل شيء من احتياج مسجّل فعليًا، فيصير الاستثمار في المبادرات
          الصحية أدقّ وأكفأ وأقبل للقياس.
        </p>
      </div>
    </div>
  );
}

function Quote({ text, by }: { text: string; by: string }) {
  return (
    <blockquote className={styles.quote}>
      <p>{text}</p>
      <span>{by}</span>
    </blockquote>
  );
}

function ImpactGrid() {
  return (
    <div className={styles.grid2}>
      {impactAreas.map((a) => (
        <div key={a.title} className={styles.impact}>
          <h3>
            <i />
            {a.title}
          </h3>
          <ul>
            {a.items.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

interface Step {
  n: string;
  stop: string;
  title: string;
  lead: string;
  art: StepArtKind;
  body: React.ReactNode;
}

const steps: Step[] = [
  {
    n: "01",
    stop: "احتياج",
    title: "يبدأ كل شيء من احتياج مسجّل",
    lead: "يسجّل المستفيد الاحتياج الصحي بنفسه في نموذج منظّم. لا تستطيع جمعية التسجيل نيابةً عنه — لتبقى البيانات صادقة من مصدرها. وبعد الإرسال لا يُعدَّل السجل، بل يُسجَّل احتياج جديد، حفاظًا على دقة التحليلات.",
    art: "need",
    body: <ChallengeTable />,
  },
  {
    n: "02",
    stop: "بيانات",
    title: "من نصّ متفرّق إلى سجل قابل للتحليل",
    lead: "تُصنَّف الاحتياجات حسب الموقع والفئة المستهدفة ونوع الاحتياج والأولوية، فتتحوّل من كلام متفرّق إلى قاعدة بيانات صحية قابلة للتجميع والقياس والعرض الجغرافي.",
    art: "data",
    body: (
      <div className={styles.grid3}>
        {platformTracks.map((t) => (
          <div key={t.title} className={styles.card}>
            <h3>{t.title}</h3>
            <p>{t.text}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    n: "03",
    stop: "أولوية",
    title: "الأكثر إلحاحًا أولًا",
    lead: "تساعد تقنيات الذكاء الاصطناعي في إبراز الاحتياجات الأعلى أولوية وأثرًا، ويبقى القرار النهائي بمراجعة بشرية — فالأولوية حكم على حالة إنسان لا ناتج خوارزمية.",
    art: "priority",
    body: (
      <Quote
        text="توجيه الموارد نحو الاحتياجات الأعلى أولوية، وتقليل ازدواجية وتكرار المبادرات."
        by="القيمة المضافة · ملف المشروع"
      />
    ),
  },
  {
    n: "04",
    stop: "مبادرة",
    title: "مبادرة مبنية على أرقام لا على تقدير",
    lead: "يتحوّل الاحتياج إلى مبادرة صحية متكاملة قابلة للتنفيذ، تبنيها الجمعية داخل نطاق تغطيتها الجغرافي والتصنيفي المعتمَد.",
    art: "initiative",
    body: (
      <>
        <MatchDiagram />
        <ShiftDiagram />
      </>
    ),
  },
  {
    n: "05",
    stop: "موارد",
    title: "المتطوع المناسب والداعم المناسب",
    lead: "تُربط المبادرة بالمتطوعين والمتخصصين والجهات الصحية والداعمين والقطاع الخاص، فيصل الدعم إلى حيث يلزم فعلًا لا حيث يسهل الوصول.",
    art: "resources",
    body: (
      <div className={styles.grid3}>
        {partners.map((p) => (
          <div key={p.title} className={styles.card}>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    n: "06",
    stop: "أثر",
    title: "نقيس الأثر لا حجم النشاط",
    lead: "تُقاس النتائج والأثر الصحي والاجتماعي، وتعود القراءات إلى قاعدة البيانات لتحسين الدورة التالية — وهنا تُغلق الدورة وتبدأ من جديد أدقّ مما كانت.",
    art: "impact",
    body: (
      <>
        <ImpactGrid />
        <NeedCycle />
      </>
    ),
  },
];

export default function AboutPage() {
  const stats = [
    { value: formatNumber(regionTotals.needs), label: "احتياج مسجّل" },
    { value: formatNumber(regionTotals.places), label: "مدينة وقرية" },
    { value: String(associations.length), label: "جمعية معتمَدة" },
    { value: String(needCategories.length), label: "تصنيفات احتياج" },
  ];
  void map;

  return (
    <>
      <section className={styles.hero} aria-label="عن احتياج">
        <div className={styles.heroArt} aria-hidden="true">
          <svg viewBox="0 0 1400 620" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="about-hero" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#16B3A0" stopOpacity=".22" />
                <stop offset="1" stopColor="#0E2B45" stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect width="1400" height="620" fill="url(#about-hero)" />
            <circle
              cx="1130"
              cy="180"
              r="210"
              fill="none"
              stroke="#16B3A0"
              strokeWidth="1.1"
              opacity=".28"
            />
            <circle
              cx="1130"
              cy="180"
              r="132"
              fill="none"
              stroke="#16B3A0"
              strokeWidth="1.1"
              opacity=".4"
            />
            <circle cx="1130" cy="180" r="58" fill="#16B3A0" opacity=".16" />
            <circle cx="1130" cy="180" r="9" fill="#16B3A0" />
            <path
              d="M-20 520 L200 452 L420 486 L640 392 L860 428 L1080 318 L1420 356"
              fill="none"
              stroke="#EAF2F5"
              strokeWidth="1.6"
              opacity=".16"
            />
            {[200, 420, 640, 860, 1080].map((x, i) => (
              <circle
                key={x}
                cx={x}
                cy={[452, 486, 392, 428, 318][i]}
                r="5"
                fill="#16B3A0"
                opacity=".55"
              />
            ))}
          </svg>
        </div>

        <div className={`wrap ${styles.heroIn}`}>
          <span className={styles.eyebrow}>عن المنصة</span>
          <h1>
            من الاحتياج
            <br />
            إلى الأثر.
          </h1>
          <p className={styles.sub}>
            ستّ محطات تصنع دورة واحدة. هذه الصفحة مبنية على المسار نفسه: كل قسم
            محطة، والشريط في الأعلى يخبرك أين أنت منها.
          </p>
          <div className={styles.ctaRow}>
            <Button href="/needs-map" variant="cta" size="lg" withArrow>
              تصفّح خريطة الاحتياج
            </Button>
            <Button href="/register/association" variant="outline" size="lg">
              انضم كجمعية
            </Button>
          </div>

          <div className={styles.heroNums}>
            {stats.map((s) => (
              <div key={s.label}>
                <b className="tabular">{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <JourneyRail stops={steps.map((s) => s.stop)} />

      <div className="wrap">
        {steps.map((s, i) => (
          <section
            key={s.n}
            className={styles.step}
            id={`step-${i}`}
            aria-label={s.title}
          >
            <div className={styles.stepHead}>
              <span className={`${styles.stepNum} mono`}>{s.n}</span>
              <div className={styles.stepBody}>
                <span className={styles.eyebrow}>{s.stop}</span>
                <h2>{s.title}</h2>
                <p className={styles.lead}>{s.lead}</p>
              </div>
              <div className={styles.stepArt}>
                <StepArt kind={s.art} />
              </div>
            </div>
            {s.body}
          </section>
        ))}

        <section className="section" aria-label="الفئات المستفيدة">
          <span className={styles.eyebrow}>الفئات المستفيدة</span>
          <h2
            style={{
              fontSize: "clamp(1.7rem,3.4vw,2.6rem)",
              letterSpacing: "-0.03em",
              marginTop: 16,
            }}
          >
            من الذي تخدمه المنصة؟
          </h2>
          <div className={styles.grid3}>
            {audiences.map((a) => (
              <div key={a.title} className={styles.aud}>
                <span className={styles.audIcon}>
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    aria-hidden="true"
                  >
                    {AUDIENCE_ICONS[a.icon]}
                  </svg>
                </span>
                <b>{a.title}</b>
                <p>{a.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section" aria-label="رؤية السعودية 2030">
          <div className={styles.vision}>
            <span className={styles.eyebrow}>رؤية السعودية 2030</span>
            <h2
              style={{
                fontSize: "clamp(1.7rem,3.4vw,2.6rem)",
                letterSpacing: "-0.03em",
                marginTop: 16,
              }}
            >
              ارتباط المشروع بمستهدفات الرؤية
            </h2>
            <div className={styles.chips}>
              {visionTargets.map((t) => (
                <span key={t} className={styles.chip}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="section" aria-label="ابدأ من الاحتياج">
          <div className={styles.closing}>
            <h2>لأن أفضل مبادرة صحية تبدأ من معرفة ما يحتاجه المجتمع فعلًا.</h2>
            <p>
              نرصد الاحتياج، نحلّل البيانات، نبني الحل، ونقيس الأثر — نحو منظومة
              صحية ومجتمعية أكثر تكاملًا وكفاءة واستدامة.
            </p>
            <div className={styles.ctaRow}>
              <Button
                href="/register/beneficiary"
                variant="cta"
                size="lg"
                withArrow
              >
                سجّل احتياجك
              </Button>
              <Button href="/register/association" variant="outline" size="lg">
                انضم كجمعية
              </Button>
            </div>
          </div>
          <p className="data-note">
            الأرقام المعروضة تجريبية للعرض في هذه المرحلة.
          </p>
        </section>
      </div>
    </>
  );
}
