import mapData from "@/data/map-data.json";
import type { MapData, NeedTotals, Place } from "@/types";

/** لوحة الخريطة وبياناتها المجمّعة — مصدر واحد لكل الأرقام المعروضة. */
export const map = mapData as unknown as MapData;

export const places: Place[] = map.places;

/** يجمع أرقام مجموعة أماكن. لا يُشتق من الناتج أي بيان فردي (القسم 24). */
export function totalsOf(list: Place[]): NeedTotals {
  return list.reduce<NeedTotals>(
    (acc, p) => ({
      needs: acc.needs + p.need,
      beneficiaries: acc.beneficiaries + p.ben,
      places: acc.places + 1,
      highPriority: acc.highPriority + (p.pri?.[0] ?? 0),
    }),
    { needs: 0, beneficiaries: 0, places: 0, highPriority: 0 },
  );
}

/** إجمالي منطقة الحدود الشمالية. */
export const regionTotals: NeedTotals = totalsOf(places);

/** الإجمالي لكل محافظة، مفهرسًا بالاسم. */
export const totalsByGovernorate: Record<string, NeedTotals> =
  Object.fromEntries(
    map.govs.map((g) => [
      g.name,
      totalsOf(places.filter((p) => p.g === g.name)),
    ]),
  );

/** أرقام إنجليزية بفواصل — الأرقام في الواجهة لاتينية ولو كان النص عربيًا. */
export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}
