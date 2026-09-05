import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, toneOfStatus } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { InitiativeCard } from "@/components/initiatives/InitiativeCard";
import { ShareButtons } from "@/components/initiatives/ShareButtons";
import { initiatives, initiativesById } from "@/data/initiatives";
import { associationsById } from "@/data/associations";
import { needCategories } from "@/data/categories";
import { formatNumber } from "@/lib/needs";
import { cn } from "@/lib/cn";
import styles from "@/components/initiatives/InitiativeDetail.module.css";

const STEPS = ["إطلاق المبادرة", "حصر الحالات", "بدء التنفيذ", "قياس الأثر"];

export function generateStaticParams() {
  return initiatives.map((i) => ({ id: i.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = initiativesById.get(id);
  if (!item) return { title: "المبادرة غير موجودة" };
  return {
    title: item.title,
    description: `مبادرة ${item.statusLabel} في ${item.city} — ${needCategories[item.category]}.`,
  };
}

/** المرحلة التي بلغتها المبادرة، مشتقّة من حالتها ونسبة إنجازها. */
function reachedStep(status: string, progress: number) {
  if (status === "completed") return STEPS.length;
  if (status === "upcoming") return 1;
  return Math.max(2, Math.round(progress / 34) + 1);
}

export default async function InitiativePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const initiative = initiativesById.get(id);
  if (!initiative) notFound();

  const org = associationsById.get(initiative.associationId);
  const category = needCategories[initiative.category];
  const reached = reachedStep(initiative.status, initiative.progress);

  // الأقرب أولًا: نفس التصنيف ثم نفس المحافظة، ثم يُكمَّل العدد كي لا يبقى فراغ
  const others = initiatives.filter((x) => x.id !== initiative.id);
  const similar = [
    ...others.filter((x) => x.category === initiative.category),
    ...others.filter(
      (x) => x.category !== initiative.category && x.city === initiative.city,
    ),
    ...others.filter(
      (x) => x.category !== initiative.category && x.city !== initiative.city,
    ),
  ].slice(0, 3);

  return (
    <section className="section" aria-label={initiative.title}>
      <div className="wrap">
        <Link className="back-link" href="/initiatives">
          <span className="arrow" aria-hidden="true">
            →
          </span>
          كل المبادرات
        </Link>

        <div className={styles.split}>
          <div>
            <Badge tone={toneOfStatus[initiative.status]}>
              {initiative.statusLabel}
            </Badge>
            <h1
              style={{ marginTop: 12, fontSize: "clamp(1.7rem,3.4vw,2.4rem)" }}
            >
              {initiative.title}
            </h1>
            <div className={styles.meta}>
              <span>{initiative.city}</span>
              <span>{category}</span>
              <span>{initiative.startedAt}</span>
            </div>

            <div className="panel" style={{ marginTop: 22 }}>
              <h3>عن المبادرة</h3>
              <p>
                بُنيت هذه المبادرة على {formatNumber(initiative.target)}{" "}
                احتياجًا مسجّلًا في تصنيف «{category}» داخل {initiative.city}.
                تنفّذها {org?.name} ضمن نطاق تغطيتها المعتمَد، وتُقاس نتائجها
                على المستفيدين الفعليين لا على عدد الأنشطة.
              </p>
            </div>

            <div className="sec-title">
              <h2>مراحل التنفيذ</h2>
            </div>
            <div className="panel">
              <div className={styles.steps}>
                {STEPS.map((name, i) => (
                  <div
                    key={name}
                    className={cn(
                      styles.step,
                      i < reached - 1 && styles.done,
                      i === reached - 1 && styles.now,
                    )}
                  >
                    <span className={styles.knob} />
                    <div>
                      <b>{name}</b>
                      <span>{i < reached ? "اكتملت" : "لم تبدأ بعد"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sec-title">
              <h2>الاحتياج الذي بُنيت عليه</h2>
            </div>
            <div className="panel">
              <p style={{ fontSize: "0.88rem" }}>
                أرقام مجمّعة من الاحتياجات المسجّلة داخل نطاق المبادرة. لا تُعرض
                أي بيانات شخصية.
              </p>
              <div className={styles.basis}>
                <div className={styles.cell}>
                  <b className="tabular">{formatNumber(initiative.target)}</b>
                  <span>احتياج مسجّل في «{category}»</span>
                </div>
                <div className={styles.cell}>
                  <b className="tabular">
                    {formatNumber(Math.round(initiative.target * 0.34))}
                  </b>
                  <span>منها بأولوية عالية</span>
                </div>
                <div className={styles.cell}>
                  <b className="tabular">{initiative.places}</b>
                  <span>مدن وقرى يشملها النطاق</span>
                </div>
              </div>
            </div>
          </div>

          <aside className={styles.side}>
            <div className={styles.sideCard}>
              <h4>نسبة الإنجاز</h4>
              <div className={styles.progress}>
                <b>
                  <span className="mono">{initiative.progress}%</span>
                </b>
                <i>
                  <em style={{ width: `${initiative.progress}%` }} />
                </i>
              </div>
              <dl className={styles.kv}>
                <div>
                  <dt>الحالة</dt>
                  <dd>{initiative.statusLabel}</dd>
                </div>
                <div>
                  <dt>المستفيدون</dt>
                  <dd className="mono">
                    {formatNumber(initiative.beneficiaries)}
                  </dd>
                </div>
                <div>
                  <dt>احتياج مستهدف</dt>
                  <dd className="mono">{formatNumber(initiative.target)}</dd>
                </div>
                <div>
                  <dt>المدن والقرى</dt>
                  <dd className="mono">{initiative.places}</dd>
                </div>
              </dl>
            </div>

            <div className={styles.sideCard}>
              <h4>الجهة المنفّذة</h4>
              <div className={styles.org}>
                <span className={styles.orgLogo} aria-hidden="true">
                  {org?.initial}
                </span>
                <div>
                  <b>{org?.name}</b>
                  <span>{org?.place}</span>
                </div>
              </div>
              <Button
                href={`/associations/${initiative.associationId}`}
                variant="outline"
                withArrow
                className="mt-3.5 w-full"
              >
                صفحة الجمعية
              </Button>
            </div>

            <div className={styles.sideCard}>
              <h4>شارك المبادرة</h4>
              <ShareButtons title={initiative.title} />
            </div>
          </aside>
        </div>

        <div className="sec-title">
          <h2>مبادرات مشابهة</h2>
          <Link className="more" href="/initiatives">
            عرض الكل{" "}
            <span className="arrow" aria-hidden="true">
              ←
            </span>
          </Link>
        </div>
        <div className={styles.similar}>
          {similar.map((x) => (
            <InitiativeCard key={x.id} initiative={x} />
          ))}
        </div>

        <div className="join-bar">
          <div>
            <h3>هل تمثّل جمعية؟</h3>
            <p>
              ابنِ مبادرتك على أرقام الاحتياج داخل نطاق تغطيتك، لا على التقدير.
            </p>
          </div>
          <Button
            href="/register/association"
            variant="cta"
            size="lg"
            withArrow
          >
            انضم كجمعية
          </Button>
        </div>

        <p className="data-note">بيانات تجريبية للعرض.</p>
      </div>
    </section>
  );
}
