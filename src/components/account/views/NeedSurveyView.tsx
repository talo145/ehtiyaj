"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import {
  contactOptions,
  contactTimeOptions,
  followedOptions,
  labelOf,
  mobilityOptions,
  needCategoryOptions,
  recurrenceOptions,
  sinceOptions,
  urgencyOptions,
  type ContactMethodValue,
  type MobilityValue,
  type RecurrenceValue,
  type SinceValue,
  type UrgencyValue,
} from "@/data/need-categories";
import { placeCount, placesByGovernorate, regions } from "@/lib/places";
import { cn } from "@/lib/cn";
import { submitNeed } from "@/server/actions/needs";
import { useAccount } from "../AccountState";
import { ChoiceGroup, CitySelect } from "../ChoiceGroup";
import { categoryIcons } from "../icons";
import { ui } from "../pieces";
import form from "../AccountForm.module.css";

const titles = [
  "نوع الاحتياج",
  "تفاصيل الحاجة",
  "الموقع",
  "الوصف والإلحاح",
  "التواصل",
  "المراجعة والإرسال",
];

const MIN_DESCRIPTION = 20;

/** استبانة الاحتياج: ست خطوات، لا تُتجاوز خطوة قبل اكتمالها،
 *  وتنتهي بمراجعة وإقرار لأن الاحتياج لا يقبل التعديل بعد الإرسال. */
export function NeedSurveyView() {
  const { profile } = useAccount();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [ack, setAck] = useState(false);

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [subcategory, setSubcategory] = useState("");
  const [since, setSince] = useState<SinceValue | "">("");
  const [recurrence, setRecurrence] = useState<RecurrenceValue | "">("");
  const [region, setRegion] = useState(profile.region || regions[0]);
  const [city, setCity] = useState(profile.city);
  const [mobility, setMobility] = useState<MobilityValue | "">("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState<UrgencyValue | "">("");
  const [followed, setFollowed] = useState<"yes" | "no" | "">("");
  const [contactMethod, setContactMethod] = useState<ContactMethodValue | "">(
    (profile.contactMethod as ContactMethodValue) || "call",
  );
  const [contactTime, setContactTime] = useState("");

  const complete = [
    categoryId !== null && Boolean(subcategory),
    Boolean(since && recurrence),
    Boolean(region && city && mobility),
    description.trim().length >= MIN_DESCRIPTION &&
      Boolean(urgency && followed),
    Boolean(contactMethod && contactTime),
    ack,
  ];

  const category = categoryId !== null ? needCategoryOptions[categoryId] : null;

  function send() {
    if (categoryId === null) return;
    setError(null);
    startTransition(async () => {
      const res = await submitNeed({
        categoryId,
        subcategory,
        region,
        city,
        since: since as SinceValue,
        recurrence: recurrence as RecurrenceValue,
        mobility: mobility as MobilityValue,
        urgency: urgency as UrgencyValue,
        followedByProvider: followed as "yes" | "no",
        description: description.trim(),
        contactMethod: contactMethod as ContactMethodValue,
        contactTime: contactTime as "morning" | "noon" | "evening" | "any",
        acknowledged: true,
      });

      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push("/account/need");
      router.refresh();
    });
  }

  return (
    <div className={ui.narrow}>
      <div className={form.steps} aria-hidden="true">
        {titles.map((t, i) => (
          <i key={t} className={cn(i <= step && form.stepOn)} />
        ))}
      </div>

      <span className={form.stepNo}>
        الخطوة {step + 1} من {titles.length}
      </span>
      <h1 style={{ fontSize: "1.32rem", margin: "4px 0 18px" }}>
        {titles[step]}
      </h1>

      {step === 0 ? (
        <>
          <p className={ui.text} style={{ marginBottom: 16 }}>
            اختر التصنيف الأقرب لاحتياجك، ثم حدّد نوعه بدقة.
          </p>

          <div className={form.options}>
            {needCategoryOptions.map((c) => (
              <button
                key={c.name}
                type="button"
                aria-pressed={categoryId === c.index}
                onClick={() => {
                  setCategoryId(c.index);
                  setSubcategory("");
                }}
                className={cn(form.option, categoryId === c.index && form.on)}
              >
                <span className={form.mark} aria-hidden="true">
                  {categoryIcons[c.icon]}
                </span>
                <span>
                  <b>{c.name}</b>
                  <span className={form.optionHint}>
                    {c.subcategories.length} أنواع
                  </span>
                </span>
              </button>
            ))}
          </div>

          {category ? (
            <>
              <h2 className={ui.sectionTitle}>ما نوع الاحتياج تحديدًا؟</h2>
              <div className={form.chips}>
                {category.subcategories.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={subcategory === s}
                    onClick={() => setSubcategory(s)}
                    className={cn(form.chip, subcategory === s && form.chipOn)}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className={form.hint} style={{ marginTop: 12 }}>
                لم تجد ما يطابق حاجتك؟ اختر الأقرب واشرح التفاصيل في خطوة الوصف.
              </p>
            </>
          ) : null}
        </>
      ) : null}

      {step === 1 ? (
        <>
          <div className={cn(ui.card, ui.warn)} style={{ marginBottom: 20 }}>
            <h2>هذا الاحتياج لك أنت</h2>
            <p className={ui.text} style={{ marginTop: 8 }}>
              لا يمكن تسجيل احتياج نيابةً عن شخص آخر. إن كنت تساعد أحد أفراد
              أسرتك — والدك أو والدتك مثلًا — فليكن التسجيل من حسابه هو، لا من
              حسابك.
            </p>
          </div>

          <ChoiceGroup
            label="منذ متى وأنت تحتاج هذا؟"
            options={sinceOptions}
            value={since}
            onChange={setSince}
          />

          <div style={{ marginTop: 22 }}>
            <ChoiceGroup
              label="هل الحاجة لمرة واحدة أم متكررة؟"
              options={recurrenceOptions}
              value={recurrence}
              onChange={setRecurrence}
              columns={2}
            />
          </div>
        </>
      ) : null}

      {step === 2 ? (
        <>
          <p className={ui.text} style={{ marginBottom: 16 }}>
            الموقع يحدّد الجمعية التي يصلها احتياجك. عُبِّئ من ملفك، وتستطيع
            تغييره إن كنت تحتاج الخدمة في مكان آخر.
          </p>

          <div className={form.pair}>
            <div className={form.field}>
              <label htmlFor="need-region">المنطقة</label>
              <select
                id="need-region"
                className={form.input}
                value={region}
                onChange={(e) => {
                  setRegion(e.target.value);
                  setCity("");
                }}
              >
                {regions.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className={form.field}>
              <label>المدينة أو القرية</label>
              <CitySelect
                value={city}
                onChange={setCity}
                groups={placesByGovernorate}
                placeholder="اختر المدينة أو القرية"
              />
              <span className={form.hint}>
                {placeCount} موقعًا في الحدود الشمالية — اختر الأقرب لك.
              </span>
            </div>
          </div>

          <div style={{ marginTop: 6 }}>
            <ChoiceGroup
              label="هل تستطيع الانتقال لموعد خارج المنزل؟"
              options={mobilityOptions}
              value={mobility}
              onChange={setMobility}
            />
          </div>
        </>
      ) : null}

      {step === 3 ? (
        <>
          <div className={form.field}>
            <label htmlFor="desc">اشرح احتياجك بكلماتك</label>
            <textarea
              id="desc"
              className={form.input}
              placeholder="اكتب ما تحتاجه ولماذا، وأي تفصيل يساعد الجمعية على فهم حالتك."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <span className={form.hint}>
              {description.trim().length < MIN_DESCRIPTION
                ? `اكتب ${MIN_DESCRIPTION} حرفًا على الأقل — كلما وضح الوصف كان التوجيه أدق.`
                : `وصف كافٍ (${description.trim().length} حرفًا).`}
            </span>
          </div>

          <div className={ui.card} style={{ margin: "6px 0 20px" }}>
            <p className={ui.text}>
              لا تكتب رقم هويتك أو أرقام حساباتك أو أي بيانات لا علاقة لها
              بالاحتياج.
            </p>
          </div>

          <ChoiceGroup
            label="ما مدى إلحاح احتياجك؟"
            options={urgencyOptions}
            value={urgency}
            onChange={setUrgency}
          />
          <p className={form.hint} style={{ marginTop: 10 }}>
            هذا تقديرك أنت. الأولوية النهائية تُحدَّد بعد مراجعة الاحتياج.
          </p>

          <div style={{ marginTop: 22 }}>
            <ChoiceGroup
              label="هل تتابع حالتك جهة صحية حاليًا؟"
              options={followedOptions}
              value={followed}
              onChange={setFollowed}
              columns={2}
            />
          </div>
        </>
      ) : null}

      {step === 4 ? (
        <>
          <p className={ui.text} style={{ marginBottom: 16 }}>
            تتواصل معك الجمعية عبر الوسيلة التي تختارها، على رقم جوالك المسجّل.
          </p>

          <ChoiceGroup
            label="وسيلة التواصل المفضّلة"
            options={contactOptions}
            value={contactMethod}
            onChange={setContactMethod}
          />

          <div style={{ marginTop: 22 }}>
            <ChoiceGroup
              label="الأوقات المناسبة للتواصل"
              options={contactTimeOptions}
              value={contactTime}
              onChange={setContactTime}
              columns={2}
            />
          </div>
        </>
      ) : null}

      {step === 5 ? (
        <>
          <div className={ui.card}>
            <h2>راجع احتياجك قبل الإرسال</h2>
            <p className={ui.sub}>بعد الإرسال لا يمكن تعديل الاحتياج.</p>

            <dl className={ui.kv} style={{ marginTop: 12 }}>
              {(
                [
                  ["التصنيف", category?.name],
                  ["النوع", subcategory],
                  ["منذ متى", labelOf(sinceOptions, since)],
                  ["طبيعة الحاجة", labelOf(recurrenceOptions, recurrence)],
                  ["الموقع", `${city} · ${region}`],
                  ["التنقّل", labelOf(mobilityOptions, mobility)],
                  ["مدى الإلحاح", labelOf(urgencyOptions, urgency)],
                  ["جهة تتابع حالتك", labelOf(followedOptions, followed)],
                  ["وسيلة التواصل", labelOf(contactOptions, contactMethod)],
                  ["وقت التواصل", labelOf(contactTimeOptions, contactTime)],
                ] as [string, string | undefined][]
              ).map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v || "—"}</dd>
                </div>
              ))}
            </dl>

            <div className={form.field} style={{ marginTop: 14 }}>
              <label>الوصف</label>
              <p
                className={ui.text}
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: 12,
                  padding: 13,
                  background: "rgba(4,9,15,.4)",
                }}
              >
                {description || "—"}
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-pressed={ack}
            onClick={() => setAck((v) => !v)}
            className={cn(form.ack, ack && form.on)}
            style={{ marginTop: 16 }}
          >
            <span className={form.box} aria-hidden="true">
              {ack ? "✓" : ""}
            </span>
            <p>
              أقرّ بأن هذا الاحتياج يخصّني أنا، وأن البيانات صحيحة، وأنه لا يمكن
              تعديل الاحتياج بعد إرساله.
            </p>
          </button>

          {error ? (
            <p className={form.error} role="alert" style={{ marginTop: 14 }}>
              {error}
            </p>
          ) : null}
        </>
      ) : null}

      <div className={form.actions}>
        {step > 0 ? (
          <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
            السابق
          </Button>
        ) : (
          <Button href="/account" variant="ghost">
            إلغاء
          </Button>
        )}

        {step === titles.length - 1 ? (
          <Button
            variant="cta"
            withArrow
            disabled={!complete[step] || pending}
            loading={pending}
            onClick={send}
          >
            إرسال الاحتياج
          </Button>
        ) : (
          <Button
            variant="cta"
            withArrow
            disabled={!complete[step]}
            onClick={() => setStep((s) => s + 1)}
          >
            التالي
          </Button>
        )}
      </div>
    </div>
  );
}
