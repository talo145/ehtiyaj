"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useAccount } from "../AccountState";
import { useNewNeed } from "../AccountShell";
import { DocIcon, PlusIcon } from "../icons";
import {
  AssociationCard,
  NeedFacts,
  NeedTimeline,
  StatusBadge,
  ui,
} from "../pieces";
import shell from "../AccountShell.module.css";

export function NeedView() {
  const { current, profileComplete, withdrawNeed } = useAccount();
  const requestNewNeed = useNewNeed();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!current) {
    return (
      <>
        <div className={ui.head}>
          <h1>احتياجي</h1>
        </div>
        <div className={ui.empty}>
          <span className={ui.emptyIcon} aria-hidden="true">
            <DocIcon size={28} />
          </span>
          <h2>لا يوجد احتياج قائم</h2>
          <p>
            حين تسجّل احتياجًا ستجد هنا حالته ومساره والجمعية التي تعالجه.
          </p>
          {profileComplete ? (
            <Button variant="cta" size="lg" onClick={requestNewNeed}>
              <PlusIcon />
              سجّل احتياجًا
            </Button>
          ) : (
            <Button href="/account/complete" variant="cta" size="lg" withArrow>
              أكمل بياناتي
            </Button>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <div className={ui.head}>
        <h1>احتياجي</h1>
        <StatusBadge status={current.status} />
        <span className={cn(ui.badge, ui.push, "mono")}>
          {current.reference}
        </span>
      </div>

      <div className={ui.cols}>
        <div className={ui.stack}>
          <div className={ui.card}>
            <h2 style={{ fontSize: "1.2rem" }}>{current.subcategory}</h2>
            <p className={ui.text} style={{ marginTop: 10 }}>
              {current.description}
            </p>
          </div>

          <div className={ui.card}>
            <h2>مسار احتياجك</h2>
            <div style={{ marginTop: 14 }}>
              <NeedTimeline need={current} />
            </div>
          </div>

          <div className={cn(ui.card, current.status === "review" && ui.danger)}>
            <h2>سحب الاحتياج</h2>
            {current.status === "review" ? (
              <>
                <p className={ui.text} style={{ marginTop: 8 }}>
                  يمكنك سحب احتياجك ما دام لم تبدأ أي جمعية بمعالجته. بعد السحب
                  يبقى السجل في «مغلق — سحبته»، ويفتح لك تسجيل احتياج جديد.
                </p>
                <Button
                  variant="outline"
                  className="mt-[14px] !border-[rgba(227,121,107,0.4)] !text-[#E3796B]"
                  onClick={() => setConfirming(true)}
                >
                  سحب الاحتياج
                </Button>
              </>
            ) : (
              <p className={ui.text} style={{ marginTop: 8 }}>
                بدأت الجمعية العمل على احتياجك، فلم يعد السحب متاحًا من التطبيق.
                إن تغيّر وضعك تواصل مع الجمعية مباشرة.
              </p>
            )}
          </div>
        </div>

        <div className={ui.stack}>
          <div className={ui.card}>
            <h2>تفاصيل الاحتياج</h2>
            <div style={{ marginTop: 10 }}>
              <NeedFacts need={current} />
            </div>
          </div>

          <AssociationCard need={current} />

          <div className={ui.card}>
            <h2>لماذا لا يمكن التعديل؟</h2>
            <p className={ui.text} style={{ marginTop: 8 }}>
              الاحتياج بعد إرساله سجلٌّ ثابت، حفاظًا على دقة البيانات
              والتحليلات. إن تغيّر وضعك يُسجَّل احتياج جديد بعد إغلاق هذا.
            </p>
          </div>
        </div>
      </div>

      {confirming ? (
        <div
          className={shell.scrim}
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirming(false);
          }}
        >
          <div className={shell.modal} role="dialog" aria-modal="true">
            <h2>سحب الاحتياج؟</h2>
            <p>
              سيُغلق احتياجك بحالة «مغلق — سحبته»، ويبقى في سجلّك ولا يُحذف. بعد
              السحب يمكنك تسجيل احتياج جديد.
            </p>
            <div className={shell.modalActions}>
              <Button
                variant="outline"
                className="!border-[rgba(227,121,107,0.4)] !text-[#E3796B]"
                onClick={async () => {
                  const err = await withdrawNeed();
                  setConfirming(false);
                  setError(err);
                }}
              >
                نعم، اسحب الاحتياج
              </Button>
              <Button variant="ghost" onClick={() => setConfirming(false)}>
                تراجع
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {error ? (
        <p
          role="alert"
          style={{
            marginTop: 16,
            color: "#E3796B",
            fontSize: ".88rem",
            border: "1px solid rgba(227,121,107,.35)",
            background: "rgba(227,121,107,.08)",
            borderRadius: 12,
            padding: "11px 14px",
          }}
        >
          {error}
        </p>
      ) : null}
    </>
  );
}
