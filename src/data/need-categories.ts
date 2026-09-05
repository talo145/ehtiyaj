/** تصنيفات الاحتياج كما تظهر في استبانة المستفيد.
 *  التصنيفات الرئيسية هي نفسها المعتمَدة في خريطة الاحتياج (`needCategories`)
 *  حتى لا تتفرّق التسميات بين ما يسجّله المستفيد وما يُعرض على الخريطة. */

import { needCategories } from "./categories";

export type CategoryIcon =
  | "device"
  | "pill"
  | "search"
  | "home"
  | "mind"
  | "speak";

export interface NeedCategoryOption {
  /** فهرس التصنيف داخل `needCategories`. */
  index: number;
  name: string;
  icon: CategoryIcon;
  subcategories: string[];
}

/** التصنيفات الفرعية مرتّبة على ترتيب `needCategories` نفسه. */
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

/** خيارات بقية أسئلة الاستبانة — نص واحد أو نص وشرح. */
export type SurveyChoice = { value: string; hint?: string };

const choice = (value: string, hint?: string): SurveyChoice => ({ value, hint });

export const sinceOptions: SurveyChoice[] = [
  choice("أقل من شهر"),
  choice("من شهر إلى ثلاثة أشهر"),
  choice("أكثر من ثلاثة أشهر"),
  choice("حاجة مستمرة منذ سنوات"),
];

export const recurrenceOptions: SurveyChoice[] = [
  choice("لمرة واحدة", "جهاز أو إجراء يكفي مرة واحدة"),
  choice("متكررة", "تحتاجها بشكل دوري أو مستمر"),
];

export const mobilityOptions: SurveyChoice[] = [
  choice("نعم", "أستطيع الوصول بنفسي"),
  choice("بصعوبة", "أحتاج مرافقًا أو وسيلة نقل"),
  choice("لا", "الخدمة يجب أن تصلني في المنزل"),
];

export const urgencyOptions: SurveyChoice[] = [
  choice("عاجل — خلال أيام", "تأخّره يضر بحالتك"),
  choice("خلال أسابيع", "مهم لكن يحتمل الانتظار"),
  choice("غير عاجل", "تحسين لوضعك الحالي"),
];

export const followedOptions: SurveyChoice[] = [
  choice("نعم", "مستشفى أو مركز صحي"),
  choice("لا"),
];

export const contactOptions: SurveyChoice[] = [
  choice("اتصال هاتفي"),
  choice("رسالة نصية"),
  choice("واتساب"),
];

export const contactTimeOptions: SurveyChoice[] = [
  choice("صباحًا (8 – 12)"),
  choice("ظهرًا (12 – 4)"),
  choice("مساءً (4 – 9)"),
  choice("أي وقت"),
];
