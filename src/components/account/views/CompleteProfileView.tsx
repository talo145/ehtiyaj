"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { birthYears, genders } from "@/data/account-demo";
import { contactOptions } from "@/data/need-categories";
import { placeCount, placesByGovernorate, regions } from "@/lib/places";
import { cn } from "@/lib/cn";
import { useAccount } from "../AccountState";
import { CitySelect } from "../ChoiceGroup";
import { ui } from "../pieces";
import form from "../AccountForm.module.css";

const PHONE = /^05\d{8}$/;

/** إكمال البيانات: البوابة الأولى قبل تسجيل أي احتياج.
 *  أربع خطوات مطلوبة — الجوال المحقَّق، المدينة، سنة الميلاد، الجنس. */
export function CompleteProfileView() {
  const { profile, completeProfile, ready } = useAccount();
  const router = useRouter();

  const [phone, setPhone] = useState(profile.phone);
  const [verified, setVerified] = useState(profile.phoneVerified);
  const [code, setCode] = useState("");
  const [region, setRegion] = useState(profile.region);
  const [city, setCity] = useState(profile.city);
  const [birthYear, setBirthYear] = useState(profile.birthYear);
  const [gender, setGender] = useState(profile.gender);
  const [contactMethod, setContactMethod] = useState(profile.contactMethod);

  if (!ready) return null;

  const phoneOk = PHONE.test(phone);
  const filled = [verified, Boolean(region && city), Boolean(birthYear), Boolean(gender)];
  const done = filled.filter(Boolean).length;

  function save() {
    completeProfile({
      phone,
      phoneVerified: verified,
      region,
      city,
      birthYear,
      gender,
      contactMethod,
    });
    router.push("/account");
  }

  return (
    <div className={ui.narrow}>
      <div className={ui.head}>
        <h1>إكمال بياناتي</h1>
      </div>

      <div className={cn(ui.card, ui.warn)} style={{ marginBottom: 18 }}>
        <h2>لماذا نطلب هذه البيانات؟</h2>
        <p className={ui.text} style={{ marginTop: 8 }}>
          مدينتك تحدّد الجمعية التي يصلها احتياجك، ورقم جوالك هو وسيلة تواصلها
          معك. بدونهما لا يمكن توجيه احتياجك إلى أحد.
        </p>
      </div>

      <div className={ui.progress}>
        <i style={{ width: `${(done / 4) * 100}%` }} />
      </div>
      <p className={ui.sub} style={{ marginBottom: 20 }}>
        {done} من 4
      </p>

      <div className={ui.card}>
        <h2>رقم الجوال</h2>
        <p className={ui.sub}>يُستخدم للتواصل معك، ولا يظهر في الموقع العام.</p>

        <div className={form.field} style={{ marginTop: 14 }}>
          <label htmlFor="phone">رقم الجوال</label>
          <input
            id="phone"
            className={cn(form.input, form.ltr, "mono")}
            inputMode="numeric"
            autoComplete="tel"
            placeholder="05XXXXXXXX"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
              setVerified(false);
            }}
          />
          {phone && !phoneOk ? (
            <span className={form.hint}>
              الرقم يبدأ بـ 05 ويتكوّن من عشرة أرقام.
            </span>
          ) : null}
        </div>

        {verified ? (
          <span className={cn(ui.badge, ui.live)}>
            <i aria-hidden="true" />
            تم التحقق من الرقم
          </span>
        ) : phoneOk ? (
          <div className={form.field}>
            <label htmlFor="code">رمز التحقق</label>
            <input
              id="code"
              className={cn(form.input, form.ltr, "mono")}
              inputMode="numeric"
              placeholder="0000"
              maxLength={4}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            />
            <span className={form.hint}>
              أُرسل رمز مكوّن من أربعة أرقام إلى رقمك.
            </span>
            <Button
              variant="outline"
              className="mt-3 w-fit"
              disabled={code.length !== 4}
              onClick={() => setVerified(true)}
            >
              تأكيد الرمز
            </Button>
          </div>
        ) : null}
      </div>

      <div className={ui.card} style={{ marginTop: 16 }}>
        <h2>مكان إقامتك</h2>
        <p className={ui.sub}>يحدّد الجمعيات التي يصلها احتياجك.</p>

        <div className={form.pair} style={{ marginTop: 14 }}>
          <div className={form.field}>
            <label htmlFor="region">المنطقة</label>
            <select
              id="region"
              className={form.input}
              value={region}
              onChange={(e) => {
                setRegion(e.target.value);
                setCity("");
              }}
            >
              <option value="">اختر المنطقة</option>
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
              disabled={!region}
              groups={region ? placesByGovernorate : []}
              placeholder={region ? "اختر المدينة أو القرية" : "اختر المنطقة أولًا"}
            />
            <span className={form.hint}>
              القائمة تشمل {placeCount} مدينة وقرية وهجرة في الحدود الشمالية.
            </span>
          </div>
        </div>
      </div>

      <div className={ui.card} style={{ marginTop: 16 }}>
        <h2>بيانات أساسية</h2>
        <p className={ui.sub}>
          تُستخدم في التحليل المجمّع فقط — لا تُنشر ولا تُربط باسمك.
        </p>

        <div className={form.pair} style={{ marginTop: 14 }}>
          <div className={form.field}>
            <label htmlFor="birth">سنة الميلاد (هجري)</label>
            <select
              id="birth"
              className={form.input}
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
            >
              <option value="">اختر السنة</option>
              {birthYears.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className={form.field}>
            <label htmlFor="gender">الجنس</label>
            <select
              id="gender"
              className={form.input}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">اختر</option>
              {genders.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={form.field}>
          <label htmlFor="contact">وسيلة التواصل المفضّلة</label>
          <select
            id="contact"
            className={form.input}
            value={contactMethod}
            onChange={(e) => setContactMethod(e.target.value)}
          >
            {contactOptions.map((c) => (
              <option key={c.value}>{c.value}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={form.actions}>
        <Button variant="cta" withArrow disabled={done < 4} onClick={save}>
          حفظ وإكمال التسجيل
        </Button>
      </div>
    </div>
  );
}
