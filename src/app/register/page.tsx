import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import styles from "@/components/auth/ChooseAccount.module.css";

export const metadata: Metadata = {
  title: "إنشاء حساب",
  description:
    "اختر نوع الحساب في احتياج: حساب فرد لتسجيل احتياجك، أو حساب جهة لاستقبال الاحتياجات.",
};

const choices = [
  {
    href: "/register/beneficiary",
    title: "مستفيد",
    text: "سجّل احتياجك الصحي بنفسك، وتابع حالته حتى تصل الاستجابة.",
    points: [
      "أنت وحدك من يسجّل احتياجك",
      "بياناتك الصحية تُعامل كبيانات حسّاسة",
      "موافقة صريحة على المستندات قبل الإكمال",
    ],
    cta: "ابدأ كمستفيد",
    icon: (
      <>
        <circle cx="12" cy="8" r="3.6" />
        <path
          d="M4.8 20c.6-3.6 3.6-5.6 7.2-5.6s6.6 2 7.2 5.6"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    href: "/register/association",
    title: "جمعية",
    text: "احصل على صورة الاحتياج داخل نطاق تغطيتك، وابنِ مبادراتك عليها.",
    points: [
      "الطلب يمرّ بمراجعة إدارة المنصة",
      "تُطلب المستندات الرسمية في مرحلة التحقّق",
      "بعد الاعتماد تحدّدون نطاق التغطية",
    ],
    cta: "ابدأ كجمعية",
    icon: (
      <>
        <path d="M4 20V9.5L12 5l8 4.5V20" strokeLinejoin="round" />
        <path d="M9.5 20v-5h5v5" strokeLinejoin="round" />
      </>
    ),
  },
];

export default function RegisterPage() {
  return (
    <section className="section" aria-label="إنشاء حساب">
      <div className="wrap">
        <PageHeader
          crumb="إنشاء حساب"
          title="أنشئ حسابك في احتياج"
          subtitle="اختر نوع الحساب. لكل نوع مسار تسجيل ومسؤوليات مختلفة داخل المنصة."
        />

        <div className={styles.grid}>
          {choices.map((c) => (
            <Link key={c.href} className={styles.card} href={c.href}>
              <span className={styles.icon}>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  aria-hidden="true"
                >
                  {c.icon}
                </svg>
              </span>
              <h2>{c.title}</h2>
              <p>{c.text}</p>
              <ul>
                {c.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <span className={styles.go}>
                {c.cta}
                <span className="arrow" aria-hidden="true">
                  ←
                </span>
              </span>
            </Link>
          ))}
        </div>

        <p className={styles.foot}>
          لديك حساب؟ <Link href="/login">تسجيل الدخول</Link> ·{" "}
          <Link href="/login/association">دخول الجمعيات</Link>
        </p>
      </div>
    </section>
  );
}
