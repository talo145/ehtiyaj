"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { needCategoryOptions } from "@/data/need-categories";
import { cn } from "@/lib/cn";
import { useAccount } from "../AccountState";
import { useNewNeed } from "../AccountShell";
import { PlusIcon } from "../icons";
import {
  AssociationCard,
  HistoryRows,
  NeedTimeline,
  NotificationRows,
  StatusBadge,
  ui,
} from "../pieces";

/** الخطوات المطلوبة لاكتمال الملف. الترتيب هو ترتيب الظهور في شاشة الإكمال. */
const steps = [
  { label: "رقم الجوال والتحقق منه", done: (p: Ready) => p.phoneVerified },
  { label: "المنطقة والمدينة", done: (p: Ready) => Boolean(p.region && p.city) },
  { label: "سنة الميلاد", done: (p: Ready) => Boolean(p.birthYear) },
  { label: "الجنس", done: (p: Ready) => Boolean(p.gender) },
];

type Ready = {
  phoneVerified: boolean;
  region: string;
  city: string;
  birthYear: string;
  gender: string;
};

export function DashboardView() {
  const {
    profile,
    profileComplete,
    current,
    history,
    notifications,
    ready,
  } = useAccount();
  const requestNewNeed = useNewNeed();

  if (!ready) return null;

  const filled = steps.filter((s) => s.done(profile)).length;

  return (
    <>
      <div className={ui.head}>
        <h1>لوحتي</h1>
        {current ? (
          <StatusBadge status={current.status} label={current.statusLabel} />
        ) : null}
        {profileComplete && current ? (
          <div className={cn(ui.push, ui.wideOnly)}>
            <Button variant="cta" onClick={requestNewNeed}>
              <PlusIcon />
              سجّل احتياجًا
            </Button>
          </div>
        ) : null}
      </div>

      {!profileComplete ? (
        <>
          <div className={cn(ui.card, ui.warn)}>
            <span className={cn(ui.badge, ui.review)}>
              <i aria-hidden="true" />
              الملف غير مكتمل
            </span>
            <h2 style={{ marginTop: 12, fontSize: "1.08rem" }}>
              أكمل بياناتك لتتمكّن من تسجيل احتياجك
            </h2>
            <p className={ui.text} style={{ marginTop: 8 }}>
              حسابك مفعّل، لكن تسجيل الاحتياج يحتاج بياناتٍ أساسية حتى يصل
              احتياجك إلى الجمعية الصحيحة داخل نطاق مدينتك.
            </p>

            <div className={ui.progress} style={{ marginTop: 16 }}>
              <i style={{ width: `${(filled / steps.length) * 100}%` }} />
            </div>
            <p className={ui.sub}>
              {filled} من {steps.length} خطوات
            </p>

            <div className={ui.check}>
              {steps.map((s) => {
                const done = s.done(profile);
                return (
                  <div key={s.label}>
                    <span className={cn(ui.tick, done && ui.tickOn)}>
                      {done ? "✓" : ""}
                    </span>
                    {s.label}
                  </div>
                );
              })}
            </div>

            <Button
              href="/account/complete"
              variant="cta"
              withArrow
              className="mt-[18px] w-full"
            >
              أكمل بياناتي
            </Button>
          </div>

          <h2 className={ui.sectionTitle}>ماذا بعد الإكمال؟</h2>
          <div className={ui.card}>
            <p className={ui.text}>
              بعد إكمال بياناتك يفتح لك تسجيل الاحتياج. تسجّل احتياجًا واحدًا في
              كل مرة، وتتابع حالته من هذه الشاشة حتى يُغلق.
            </p>
          </div>
        </>
      ) : !current ? (
        <div className={ui.empty}>
          <span className={ui.emptyIcon} aria-hidden="true">
            <PlusIcon size={30} />
          </span>
          <h2>لا يوجد لديك احتياج قائم</h2>
          <p>
            سجّل احتياجك الصحي في استبانة قصيرة، وسيصل إلى الجمعية المختصة داخل
            نطاق مدينتك.
          </p>
          <Button variant="cta" size="lg" onClick={requestNewNeed}>
            <PlusIcon />
            سجّل احتياجًا
          </Button>
        </div>
      ) : (
        <>
          <div className={cn(ui.card, ui.accent)}>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={current.status} label={current.statusLabel} />
              <span className={cn(ui.badge, ui.push, "mono")}>{current.id}</span>
            </div>
            <h2 style={{ marginTop: 12, fontSize: "1.16rem" }}>
              {current.subcategory}
            </h2>
            <div className={ui.meta}>
              <span>{needCategoryOptions[current.category]?.name}</span>
              <span>{current.city}</span>
              <span>أُرسل في {current.submittedAt}</span>
            </div>

            <div style={{ marginTop: 18 }}>
              <NeedTimeline need={current} />
            </div>

            <Button
              href="/account/need"
              variant="outline"
              withArrow
              className="mt-[18px] w-full"
            >
              تفاصيل احتياجي
            </Button>
          </div>

          {current.association ? (
            <div style={{ marginTop: 14 }}>
              <AssociationCard need={current} />
            </div>
          ) : null}
        </>
      )}

      <h2 className={ui.sectionTitle}>آخر الإشعارات</h2>
      <NotificationRows items={notifications.slice(0, 2)} />

      {history.length ? (
        <>
          <h2 className={ui.sectionTitle}>من سجلّك</h2>
          <HistoryRows items={history.slice(0, 2)} />
          <p style={{ marginTop: 12 }}>
            <Link href="/account/history" className="back-link">
              عرض السجل كاملًا
              <span className="arrow" aria-hidden="true">
                ←
              </span>
            </Link>
          </p>
        </>
      ) : null}
    </>
  );
}
