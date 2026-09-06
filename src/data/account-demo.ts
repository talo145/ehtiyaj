/** ثوابت عرض حساب المستفيد. لا بيانات مستخدمين هنا — تلك في قاعدة البيانات. */

import type { NeedStatusValue } from "@/server/view-types";

/** المراحل الأربع التي يراها المستفيد في مسار احتياجه. */
export const needStages: {
  status: NeedStatusValue;
  title: string;
  hint: string;
}[] = [
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

export const statusLabels: Record<NeedStatusValue, string> = {
  new: "جديد",
  review: "قيد المراجعة",
  processing: "قيد المعالجة",
  responded: "تمت الاستجابة",
  withdrawn: "مغلق — سحبته",
  closed: "مغلق",
};

/** سنوات الميلاد المعروضة في إكمال البيانات — هجريًا. */
export const birthYears: string[] = Array.from({ length: 91 }, (_, i) =>
  String(1450 - i),
);
