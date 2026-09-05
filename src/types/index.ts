/** الأنواع المشتركة بين البيانات والمكوّنات.
 *  البيانات الآن ملفات ثابتة، ولاحقًا نداءات API بنفس هذه الأشكال. */

export type NeedCategory =
  | "أجهزة ومستلزمات طبية"
  | "علاج وتأهيل"
  | "رعاية صحية منزلية"
  | "فحوصات وكشف مبكر"
  | "دعم نفسي"
  | "توعية ووقاية";

export interface Association {
  id: string;
  name: string;
  /** الحرف الظاهر داخل مربّع الشعار إلى أن تتوفر شعارات فعلية. */
  initial: string;
  /** اسم الموقع الفعلي داخل بيانات الخريطة — مدينة أو قرية. */
  place: string;
  governorate: string;
  /** نطاق التغطية الجغرافي والتصنيفي، بصياغة تُعرض للزائر. */
  scope: string;
  initiatives: number;
  needs: number;
  /** فهارس التصنيفات المعتمَدة للجمعية داخل `needCategories`. */
  categories: number[];
}

export type InitiativeStatus = "active" | "completed" | "upcoming";

export interface Initiative {
  id: string;
  title: string;
  /** الجمعية المنفّذة. */
  associationId: string;
  city: string;
  /** فهرس التصنيف داخل `needCategories`. */
  category: number;
  status: InitiativeStatus;
  statusLabel: string;
  /** شهر الانطلاق بالتقويم الهجري. */
  startedAt: string;
  /** نسبة الإنجاز 0–100. */
  progress: number;
  beneficiaries: number;
  /** عدد الاحتياجات المستهدفة التي بُنيت عليها المبادرة. */
  target: number;
  /** عدد المدن والقرى التي تشملها. */
  places: number;
}

export interface FlowStage {
  name: string;
  title: string;
  text: string;
}

export interface Landmark {
  src: string;
  caption: string;
  credit: string;
}

/** مكان مأهول داخل منطقة الحدود الشمالية، بإحداثيات مسقطة على لوحة الخريطة. */
export interface Place {
  n: string;
  /** المحافظة التابع لها. */
  g: string;
  /** تصنيف المكان في OpenStreetMap: city / town / village / suburb … */
  k: string;
  /** إحداثيات مسقطة على لوحة الخريطة (وليست بكسلات الشاشة). */
  x: number;
  y: number;
  lon: number;
  lat: number;
  need: number;
  ben: number;
  init: number;
  /** أعداد الاحتياج موزّعة على التصنيفات الستة بترتيب `categories`. */
  cats: number[];
  /** [عدد الأولوية العالية, المتوسطة, المنخفضة] */
  pri: [number, number, number];
}

export interface GovShape {
  name: string;
  d: string;
  cx: number;
  cy: number;
}

export interface RegionShape {
  iso: string;
  name: string;
  d: string;
}

export interface CityDot {
  n: string;
  x: number;
  y: number;
  /** 1 للمدن الرئيسية التي تحمل هالة. */
  a?: number;
}

export interface MapData {
  w: number;
  h: number;
  adm0: string;
  regions: RegionShape[];
  govs: GovShape[];
  cities: CityDot[];
  /** إطار منطقة الحدود الشمالية [x0, y0, x1, y1] على لوحة الخريطة. */
  nbbox: [number, number, number, number];
  places: Place[];
  /** تصنيفات الاحتياج الستة بالترتيب المستخدم في `Place.cats`. */
  cats: string[];
  /** مواقع الجمعيات على اللوحة — لخريطة الجمعيات في مرحلة لاحقة. */
  assoc: MapAssociation[];
}

/** جمعية بموقعها على لوحة الخريطة (غير مستخدمة في الصفحة الرئيسية بعد). */
export interface MapAssociation {
  n: string;
  city: string;
  scope: string;
  init: number;
  x: number;
  y: number;
  vol?: number;
}

/** أرقام مجمّعة لمنطقة أو محافظة — لا تُشتق منها أي بيانات فردية. */
export interface NeedTotals {
  needs: number;
  beneficiaries: number;
  places: number;
  highPriority: number;
}
