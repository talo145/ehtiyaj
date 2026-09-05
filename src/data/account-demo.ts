/** بيانات عرض لحساب المستفيد إلى أن يُربط بالخادم.
 *  الحساب يبدأ كما يبدأ في الواقع: مسجَّل، والملف غير مكتمل، ولا احتياج بعد. */

import type {
  BeneficiaryNotification,
  BeneficiaryProfile,
  NeedRecord,
  NeedStatus,
} from "@/types";

export const emptyProfile: BeneficiaryProfile = {
  name: "عبدالله السالم",
  email: "a.salem@example.com",
  phone: "",
  phoneVerified: false,
  region: "",
  city: "",
  birthYear: "",
  gender: "",
  contactMethod: "اتصال هاتفي",
};

/** المراحل الأربع التي يراها المستفيد في مسار احتياجه. */
export const needStages: { status: NeedStatus; title: string; hint: string }[] =
  [
    { status: "new", title: "أرسلت احتياجك", hint: "وصل الاحتياج إلى المنصة" },
    {
      status: "review",
      title: "قيد المراجعة",
      hint: "تُراجَع البيانات وتُحدَّد الأولوية",
    },
    {
      status: "processing",
      title: "جمعية تعالج احتياجك",
      hint: "جمعية داخل نطاقك بدأت المعالجة",
    },
    {
      status: "responded",
      title: "تمت الاستجابة",
      hint: "وصلتك الخدمة وأُغلق الاحتياج",
    },
  ];

export const statusLabels: Record<NeedStatus, string> = {
  new: "جديد",
  review: "قيد المراجعة",
  processing: "قيد المعالجة",
  responded: "تمت الاستجابة",
  withdrawn: "مغلق — سحبته",
  closed: "مغلق",
};

/** سجل سابق لحساب قائم — يُستبدل بسجل الخادم عند الربط. */
export const seedHistory: NeedRecord[] = [];

export const seedNotifications: BeneficiaryNotification[] = [
  {
    id: "nt-welcome",
    title: "أهلًا بك في احتياج",
    body: "أكمل بياناتك لتتمكّن من تسجيل احتياجك.",
    at: "قبل دقائق",
    unread: true,
  },
];

/** الجمعية التي تلتقط الاحتياج في العرض. مصدرها لاحقًا محرّك التوجيه. */
export const demoAssociation = {
  name: "جمعية رفحاء الخيرية",
  initial: "ر",
  city: "رفحاء",
};

/** سنوات الميلاد المعروضة في إكمال البيانات — هجريًا. */
export const birthYears: string[] = Array.from(
  { length: 91 },
  (_, i) => String(1450 - i),
);

export const genders = ["ذكر", "أنثى"] as const;
