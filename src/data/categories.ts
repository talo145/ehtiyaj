import { map } from "@/lib/needs";

/** تصنيفات الاحتياج الستة — مصدرها ملف الخريطة كي لا تتفرّق النسخ. */
export const needCategories: string[] = map.cats;

/** مستويات الأولوية بالترتيب المستخدم في `Place.pri`. */
export const priorityLevels = ["عالية", "متوسطة", "منخفضة"] as const;
export type PriorityLevel = (typeof priorityLevels)[number];

/** أنواع المواقع كما تصنّفها OpenStreetMap، بمسمّياتها العربية. */
export const placeKinds = [
  { value: "city", label: "مدينة" },
  { value: "town", label: "بلدة" },
  { value: "suburb", label: "حي" },
  { value: "village", label: "قرية" },
  { value: "hamlet", label: "هجرة" },
] as const;

export function placeKindLabel(kind: string): string {
  return placeKinds.find((k) => k.value === kind)?.label ?? kind;
}
