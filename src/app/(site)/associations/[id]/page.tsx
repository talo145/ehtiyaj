import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { InitiativeCard } from "@/components/initiatives/InitiativeCard";
import { ContactChannels } from "@/components/associations/ContactChannels";
import { LocationMap } from "@/components/associations/LocationMap";
import { associations, associationsById } from "@/data/associations";
import { initiatives } from "@/data/initiatives";
import { needCategories } from "@/data/categories";
import { formatNumber } from "@/lib/needs";
import styles from "@/components/associations/AssociationProfile.module.css";

export function generateStaticParams() {
  return associations.map((a) => ({ id: a.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const a = associationsById.get(id);
  if (!a) return { title: "الجمعية غير موجودة" };
  return { title: a.name, description: a.scope };
}

export default async function AssociationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const association = associationsById.get(id);
  if (!association) notFound();

  const own = initiatives.filter((i) => i.associationId === association.id);

  return (
    <section className="section" aria-label={association.name}>
      <div className="wrap">
        <Link className="back-link" href="/associations">
          <span className="arrow" aria-hidden="true">
            →
          </span>
          كل الجمعيات
        </Link>

        <div className={styles.hero}>
          <div className={styles.main}>
            <h1>{association.name}</h1>
            <p className={styles.place}>
              {association.place} · محافظة {association.governorate} · منطقة
              الحدود الشمالية
            </p>
            <div className={styles.tags}>
              {association.categories.map((c) => (
                <span key={c} className={styles.tag}>
                  {needCategories[c]}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.verified} title="اعتمدتها إدارة المنصة">
            <svg
              width="58"
              height="58"
              viewBox="0 0 58 58"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="29" cy="29" r="24" fill="rgba(22,179,160,.1)" />
              {/* ثلثا دائرة: فجوة بمقدار الثلث */}
              <circle
                cx="29"
                cy="29"
                r="24"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="100.5 50.3"
                transform="rotate(-58 29 29)"
              />
              <path
                d="M20 29.6l6.2 6.2L38.4 23.6"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="3.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>جمعية معتمَدة</span>
          </div>

          <span className={styles.logo} aria-hidden="true">
            {association.initial}
          </span>
        </div>

        <div className={`stat-bar ${styles.stats}`}>
          <div>
            <b className="tabular">{formatNumber(association.initiatives)}</b>
            <span>مبادرة قائمة</span>
          </div>
          <div>
            <b className="tabular">{formatNumber(association.needs)}</b>
            <span>احتياج ضمن نطاقها</span>
          </div>
          <div>
            <b className="tabular">{association.categories.length}</b>
            <span>تصنيفات تعمل عليها</span>
          </div>
        </div>

        <div className={styles.cols}>
          <div className="panel">
            <h3>نبذة عن الجمعية</h3>
            <p>
              {association.scope} تبني الجمعية مبادراتها على الاحتياجات المسجّلة
              داخل نطاقها في المنصة، لا على التقدير.
            </p>
            <h3 style={{ marginTop: 22 }}>نطاق التغطية</h3>
            <p>
              تصلها الاحتياجات المطابقة لنطاقها فقط: الموقع الذي تعمل فيه،
              والتصنيفات المعتمَدة لها من إدارة المنصة.
            </p>
            <div className={styles.tags}>
              {association.categories.map((c) => (
                <span key={c} className={styles.tag}>
                  {needCategories[c]}
                </span>
              ))}
            </div>
          </div>

          <div className="panel">
            <h3>بيانات التسجيل</h3>
            <dl className={styles.kv}>
              <div>
                <dt>رقم التسجيل</dt>
                <dd className="mono">7001-{association.id.replace("a", "")}</dd>
              </div>
              <div>
                <dt>تاريخ الاعتماد</dt>
                <dd>محرم 1447</dd>
              </div>
              <div>
                <dt>الموقع</dt>
                <dd>{association.place}</dd>
              </div>
              <div>
                <dt>المحافظة</dt>
                <dd>{association.governorate}</dd>
              </div>
              <div>
                <dt>الحالة</dt>
                <dd style={{ color: "var(--accent)" }}>نشطة</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="sec-title">
          <h2>مبادرات الجمعية</h2>
          <span className="cnt">
            <span className="mono">{own.length}</span> مبادرة
          </span>
          <Link className="more" href="/initiatives">
            عرض الكل{" "}
            <span className="arrow" aria-hidden="true">
              ←
            </span>
          </Link>
        </div>

        {own.length ? (
          <div className={styles.initiativesGrid}>
            {own.map((i) => (
              <InitiativeCard key={i.id} initiative={i} />
            ))}
          </div>
        ) : (
          <div className="panel">
            <p>لم تُطلق هذه الجمعية مبادرة على المنصة بعد.</p>
          </div>
        )}

        <div className="sec-title">
          <h2>قنوات التواصل</h2>
        </div>
        <div className="panel">
          <p style={{ fontSize: "0.88rem" }}>
            للتواصل مع الجمعية مباشرة خارج المنصة. احتياج لا يمرّر أي بيانات
            مستفيدين عبر هذه القنوات.
          </p>
          <ContactChannels />
        </div>

        <div className="sec-title">
          <h2>موقع الجمعية</h2>
        </div>
        <div className={styles.mapRow}>
          <p>
            طريق الملك عبدالعزيز، {association.place} · محافظة{" "}
            {association.governorate}
          </p>
          <Button href="#" variant="outline" withArrow>
            فتح في الخرائط
          </Button>
        </div>
        <LocationMap
          label={association.name}
          seed={association.name.length * 7 + own.length}
        />

        <p className="data-note">بيانات تجريبية للعرض.</p>
      </div>
    </section>
  );
}
