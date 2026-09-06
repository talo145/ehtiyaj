/** مواقع الحدود الشمالية كما يختارها المستفيد: كل مدينة وقرية وهجرة في بيانات
 *  الخريطة، مجمّعة بمحافظاتها. مصدر واحد للقائمتين — إكمال البيانات والاستبانة. */

import { map, places } from "./needs";
import { placeKindLabel } from "@/data/categories";

export interface PlaceOption {
  name: string;
  /** نوع الموقع بالعربية: مدينة، بلدة، قرية، هجرة، حي. */
  kind: string;
}

export interface GovernoratePlaces {
  governorate: string;
  places: PlaceOption[];
}

/** المناطق المتاحة الآن. تتوسّع حين تتوسّع تغطية المنصة خارج الحدود الشمالية. */
export const regions: string[] = ["الحدود الشمالية"];

/** المحافظة أولًا بمدينتها، ثم بقية مواقعها أبجديًا. */
export const placesByGovernorate: GovernoratePlaces[] = map.govs.map((g) => {
  const seen = new Set<string>();
  const list: PlaceOption[] = [];

  for (const p of places) {
    if (p.g !== g.name || seen.has(p.n)) continue;
    seen.add(p.n);
    list.push({ name: p.n, kind: placeKindLabel(p.k) });
  }

  const head = list.filter((p) => p.name === g.name);
  const rest = list
    .filter((p) => p.name !== g.name)
    .sort((a, b) => a.name.localeCompare(b.name, "ar"));

  return { governorate: g.name, places: [...head, ...rest] };
});

export const placeCount: number = placesByGovernorate.reduce(
  (n, g) => n + g.places.length,
  0,
);
