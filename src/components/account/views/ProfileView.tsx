"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useAccount } from "../AccountState";
import { ui } from "../pieces";

export function ProfileView() {
  const { profile, profileComplete, ready } = useAccount();
  if (!ready) return null;

  const fields: [string, string, string?][] = [
    ["الاسم الكامل", profile.name, "يظهر للجمعية التي تعالج احتياجك فقط."],
    ["البريد الإلكتروني", profile.email, "لتسجيل الدخول."],
    [
      "رقم الجوال",
      profile.phone || "—",
      profile.phoneVerified
        ? "محقّق ✓ — وسيلة تواصل الجمعية معك."
        : "لم يُحقَّق بعد.",
    ],
    ["المنطقة", profile.region || "—"],
    [
      "المدينة أو القرية",
      profile.city || "—",
      "تحدّد الجمعيات التي يصلها احتياجك.",
    ],
    ["سنة الميلاد", profile.birthYear || "—", "هجري."],
    ["الجنس", profile.gender || "—"],
    ["وسيلة التواصل المفضّلة", profile.contactMethod],
  ];

  return (
    <div className={ui.narrow}>
      <div className={ui.head}>
        <h1>الملف الشخصي</h1>
      </div>

      <div className={ui.card} style={{ marginBottom: 16 }}>
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <h2 style={{ fontSize: "1.15rem" }}>{profile.name}</h2>
            <p className={ui.sub}>
              حساب مستفيد{profile.city ? ` · ${profile.city}` : ""}
            </p>
          </div>
          <span
            className={cn(
              ui.badge,
              ui.push,
              profileComplete ? ui.live : ui.review,
            )}
          >
            <i aria-hidden="true" />
            {profileComplete ? "مكتمل" : "غير مكتمل"}
          </span>
        </div>
      </div>

      <div className={ui.card}>
        <h2>بيانات الحساب</h2>
        <p className={ui.sub}>
          عدّل ما تغيّر لديك — تغيير المدينة يغيّر الجمعيات التي يصلها احتياجك
          القادم.
        </p>

        <dl className={ui.kv} style={{ marginTop: 12 }}>
          {fields.map(([label, value, hint]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>
                {value}
                {hint ? (
                  <span
                    style={{
                      display: "block",
                      color: "var(--dim)",
                      fontSize: ".77rem",
                      marginTop: 2,
                    }}
                  >
                    {hint}
                  </span>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button href="/account/complete" variant="cta" withArrow>
            {profileComplete ? "تعديل البيانات" : "إكمال البيانات"}
          </Button>
          <Button variant="outline">تغيير كلمة المرور</Button>
        </div>
      </div>

      <div className={ui.card} style={{ marginTop: 16 }}>
        <h2>لا تُطلب منك صورة شخصية</h2>
        <p className={ui.text} style={{ marginTop: 8 }}>
          حسابك يُعرَّف باسمك فقط. المنصة لا تجمع صورًا شخصية ولا وثائق هوية.
        </p>
      </div>
    </div>
  );
}
