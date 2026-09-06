"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { beneficiaryDocuments } from "@/data/legal";
import { cn } from "@/lib/cn";
import { ui } from "../pieces";
import shell from "../AccountShell.module.css";

/** وقت الموافقة يأتي من الخادم عند الربط؛ الآن يُعرض وقت إنشاء الحساب. */
const consentAt = "عند إنشاء الحساب";

export function PrivacyView() {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className={cn(ui.narrow, ui.stack)}>
      <div className={ui.head}>
        <h1>بياناتي وخصوصيتي</h1>
      </div>

      <div className={ui.card}>
        <h2>من يرى بياناتك؟</h2>
        <dl className={ui.kv} style={{ marginTop: 10 }}>
          <div>
            <dt>الجمعية داخل نطاقك</dt>
            <dd>اسمك، وسيلة تواصلك، وصف احتياجك وأولويته — فقط.</dd>
          </div>
          <div>
            <dt>الموقع العام</dt>
            <dd>
              أعداد مجمّعة على مستوى المدينة، بلا اسم ولا رقم ولا موقع دقيق.
            </dd>
          </div>
          <div>
            <dt>إدارة المنصة</dt>
            <dd>بالقدر اللازم للمراجعة، ووفق سجل تدقيق.</dd>
          </div>
        </dl>
      </div>

      <div className={ui.card}>
        <h2>الموافقات المسجّلة</h2>
        <p className={ui.sub}>
          تُسجَّل كل موافقة بإصدارها وتاريخها ووقتها لأغراض الامتثال.
        </p>
        <div className={ui.stack} style={{ marginTop: 14 }}>
          {beneficiaryDocuments.map((doc) => (
            <div key={doc.id} className={ui.row}>
              <div>
                <b>{doc.title}</b>
                <div className={ui.meta}>
                  <span>{doc.meta}</span>
                  <span>{consentAt}</span>
                </div>
              </div>
              <span className={cn(ui.badge, ui.live, ui.rowBadge)}>
                <i aria-hidden="true" />
                موافق
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={ui.card}>
        <h2>نسخة من بياناتي</h2>
        <p className={ui.text} style={{ marginTop: 8 }}>
          اطلب ملفًا يحوي بيانات حسابك وسجل احتياجاتك. يصلك على بريدك خلال ثلاثة
          أيام عمل.
        </p>
        <Button variant="outline" className="mt-[14px]">
          طلب نسخة
        </Button>
      </div>

      <div className={cn(ui.card, ui.danger)}>
        <h2>حذف الحساب</h2>
        <p className={ui.text} style={{ marginTop: 8 }}>
          يُحذف حسابك وبياناتك الشخصية نهائيًا. أما سجلات الاحتياج فتبقى{" "}
          <b>مجرَّدة من الهوية</b> — بلا اسمك ولا رقمك — حفاظًا على دقة
          الإحصاءات المنشورة.
        </p>
        <Button
          variant="outline"
          className="mt-[14px] !border-[rgba(227,121,107,0.4)] !text-[#E3796B]"
          onClick={() => setConfirming(true)}
        >
          حذف حسابي
        </Button>
      </div>

      {confirming ? (
        <div
          className={shell.scrim}
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirming(false);
          }}
        >
          <div className={shell.modal} role="dialog" aria-modal="true">
            <h2>حذف الحساب؟</h2>
            <p>
              يُحذف حسابك وبياناتك الشخصية نهائيًا ولا يمكن استرجاعها. سجلات
              احتياجاتك تبقى مجهولة الهوية لأغراض الإحصاء فقط.
            </p>
            <div className={shell.modalActions}>
              <Button
                variant="outline"
                className="!border-[rgba(227,121,107,0.4)] !text-[#E3796B]"
                onClick={() => setConfirming(false)}
              >
                حذف نهائي
              </Button>
              <Button variant="ghost" onClick={() => setConfirming(false)}>
                تراجع
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
