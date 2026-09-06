/** تصنيفات الاحتياج وخيارات الاستبانة.
 *
 *  كل خيار له قيمة ثابتة تُخزَّن في قاعدة البيانات، ونصّ عربي يُعرض فقط.
 *  فصلهما يعني أن تعديل الصياغة لا يفسد بيانات محفوظة. */

import { needCategories } from "./categories";

export type CategoryIcon =
  | "device"
  | "pill"
  | "search"
  | "home"
  | "mind"
  | "speak";

export interface NeedCategoryOption {
  /** فهرس التصنيف داخل `needCategories` — نفسه المستخدم في خريطة الاحتياج. */
  index: number;
  name: string;
  icon: CategoryIcon;
  subcategories: string[];
}

const subcategories: { icon: CategoryIcon; items: string[] }[] = [
  {
    icon: "device",
    items: [
      "كرسي متحرك أو مشّاية",
      "سرير طبي وتجهيزاته",
      "جهاز أكسجين أو تنفس منزلي",
      "جهاز قياس سكر أو ضغط",
      "مستلزمات استعمال يومي (حفائظ، قسطرة، ضمادات)",
      "طرف صناعي أو جهاز تعويضي",
      "سمّاعة طبية للأذن أو نظارة",
    ],
  },
  {
    icon: "pill",
    items: [
      "تكاليف عملية جراحية",
      "أدوية غير متوفرة أو غير مغطّاة",
      "جلسات علاج طبيعي",
      "علاج وظيفي",
      "تخاطب ونطق",
      "تأهيل بعد إصابة أو جلطة",
      "علاج أسنان",
    ],
  },
  {
    icon: "search",
    items: [
      "فحص السكري والضغط",
      "الكشف المبكر عن الأورام",
      "فحص النظر والسمع",
      "تحاليل مخبرية",
      "أشعة وتصوير",
      "الفحص الدوري الشامل",
    ],
  },
  {
    icon: "home",
    items: [
      "زيارة طبيب أو ممرض للمنزل",
      "العناية بالجروح وقرح الفراش",
      "رعاية مريض مقعد أو كبير سن",
      "تدريب الأسرة على العناية بالمريض",
      "نقل المريض إلى المواعيد الطبية",
      "تغذية علاجية",
    ],
  },
  {
    icon: "mind",
    items: [
      "استشارة نفسية",
      "جلسات علاج نفسي",
      "دعم أسري بعد فقد أو مرض",
      "دعم للأطفال وذوي الإعاقة",
      "دعم لمقدّم الرعاية",
      "إرشاد للتعامل مع القلق أو الاكتئاب",
    ],
  },
  {
    icon: "speak",
    items: [
      "التوعية بمرض مزمن (سكري أو ضغط)",
      "صحة الأم والطفل",
      "التغذية والنشاط البدني",
      "الإسعافات الأولية",
      "صحة الفم والأسنان",
      "التوعية بالصحة النفسية",
    ],
  },
];

export const needCategoryOptions: NeedCategoryOption[] = needCategories.map(
  (name, index) => ({
    index,
    name,
    icon: subcategories[index]?.icon ?? "device",
    subcategories: subcategories[index]?.items ?? [],
  }),
);

/** خيار في الاستبانة: قيمة تُخزَّن، ونصّ يُعرض، وشرح اختياري. */
export interface SurveyChoice<V extends string = string> {
  value: V;
  label: string;
  hint?: string;
}

export type SinceValue = "under_month" | "one_to_three" | "over_three" | "years";
export type RecurrenceValue = "once" | "recurring";
export type MobilityValue = "yes" | "hard" | "no";
export type UrgencyValue = "days" | "weeks" | "none";
export type ContactMethodValue = "call" | "sms" | "whatsapp";
export type GenderValue = "male" | "female";

export const sinceOptions: SurveyChoice<SinceValue>[] = [
  { value: "under_month", label: "أقل من شهر" },
  { value: "one_to_three", label: "من شهر إلى ثلاثة أشهر" },
  { value: "over_three", label: "أكثر من ثلاثة أشهر" },
  { value: "years", label: "حاجة مستمرة منذ سنوات" },
];

export const recurrenceOptions: SurveyChoice<RecurrenceValue>[] = [
  { value: "once", label: "لمرة واحدة", hint: "جهاز أو إجراء يكفي مرة واحدة" },
  { value: "recurring", label: "متكررة", hint: "تحتاجها بشكل دوري أو مستمر" },
];

export const mobilityOptions: SurveyChoice<MobilityValue>[] = [
  { value: "yes", label: "نعم", hint: "أستطيع الوصول بنفسي" },
  { value: "hard", label: "بصعوبة", hint: "أحتاج مرافقًا أو وسيلة نقل" },
  { value: "no", label: "لا", hint: "الخدمة يجب أن تصلني في المنزل" },
];

export const urgencyOptions: SurveyChoice<UrgencyValue>[] = [
  { value: "days", label: "عاجل — خلال أيام", hint: "تأخّره يضر بحالتك" },
  { value: "weeks", label: "خلال أسابيع", hint: "مهم لكن يحتمل الانتظار" },
  { value: "none", label: "غير عاجل", hint: "تحسين لوضعك الحالي" },
];

export const followedOptions: SurveyChoice<"yes" | "no">[] = [
  { value: "yes", label: "نعم", hint: "مستشفى أو مركز صحي" },
  { value: "no", label: "لا" },
];

export const contactOptions: SurveyChoice<ContactMethodValue>[] = [
  { value: "call", label: "اتصال هاتفي" },
  { value: "sms", label: "رسالة نصية" },
  { value: "whatsapp", label: "واتساب" },
];

export const contactTimeOptions: SurveyChoice[] = [
  { value: "morning", label: "صباحًا (8 – 12)" },
  { value: "noon", label: "ظهرًا (12 – 4)" },
  { value: "evening", label: "مساءً (4 – 9)" },
  { value: "any", label: "أي وقت" },
];

export const genderOptions: SurveyChoice<GenderValue>[] = [
  { value: "male", label: "ذكر" },
  { value: "female", label: "أنثى" },
];

/** نصّ الخيار من قيمته — للمراجعة وصفحات العرض. */
export function labelOf(
  options: readonly SurveyChoice<string>[],
  value: string | null | undefined,
): string {
  return options.find((o) => o.value === value)?.label ?? "—";
}
