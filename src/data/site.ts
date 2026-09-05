/** ثوابت الموقع: التسمية، التنقل، الفوتر، وقنوات التواصل.
 *  مركزة هنا كي لا تتكرر النصوص داخل المكوّنات. */

export const site = {
  name: "احتياج",
  tagline: "نعرف الاحتياج… لنصنع الأثر.",
  description:
    "منصة احتياج تحوّل احتياجات المستفيدين إلى بيانات واضحة تساعد الجهات والجمعيات على فهم الاحتياج الحقيقي وبناء مبادرات أكثر تأثيرًا.",
  url: "https://ehtiyaj.sa",
  /** رقم تجريبي في هذه المرحلة — يُستبدل قبل الإطلاق. */
  whatsapp: "966500000000",
  locale: "ar_SA",
} as const;

export interface NavLink {
  label: string;
  href: string;
}

/** روابط الهيدر. ما لم تُبنَ صفحته بعد يشير إلى قسمه في الصفحة الرئيسية. */
export const navLinks: NavLink[] = [
  { label: "الرئيسية", href: "/" },
  { label: "عن احتياج", href: "/#about" },
  { label: "الجمعيات", href: "/#associations" },
  { label: "المبادرات", href: "/#initiatives" },
  { label: "خريطة الاحتياج", href: "/#needs-map" },
];

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: "الموقع",
    links: [
      { label: "الرئيسية", href: "/" },
      { label: "عن احتياج", href: "/#about" },
      { label: "خريطة الاحتياج", href: "/#needs-map" },
      { label: "الجمعيات", href: "/#associations" },
      { label: "المبادرات", href: "/#initiatives" },
    ],
  },
  {
    title: "الحساب",
    links: [
      { label: "تسجيل الدخول", href: "/login" },
      { label: "إنشاء حساب", href: "/register" },
      { label: "تسجيل كمستفيد", href: "/register/beneficiary" },
      { label: "تسجيل كجمعية", href: "/register/association" },
    ],
  },
  {
    title: "قانوني",
    links: [
      { label: "سياسة الخصوصية", href: "/privacy" },
      { label: "الشروط والأحكام", href: "/terms" },
    ],
  },
];

export interface SocialLink {
  label: string;
  href: string;
  /** مفتاح الأيقونة في `SocialIcon`. */
  icon: "x" | "linkedin" | "instagram";
}

export const socialLinks: SocialLink[] = [
  { label: "منصة إكس", href: "#", icon: "x" },
  { label: "لينكدإن", href: "#", icon: "linkedin" },
  { label: "إنستغرام", href: "#", icon: "instagram" },
];
