import { associations } from "@/data/associations";
import type { Association } from "@/types";

export interface PlaceAssociations {
  place: string;
  governorate: string;
  list: Association[];
  /** فهارس التصنيفات التي تغطّيها جمعيات هذا الموقع مجتمعةً. */
  categories: number[];
}

/** الجمعيات مجمّعة بموقعها الفعلي — يربط طبقة الجمعيات بخريطة الاحتياج. */
export const associationsByPlace: Map<string, PlaceAssociations> =
  associations.reduce((acc, a) => {
    const entry = acc.get(a.place) ?? {
      place: a.place,
      governorate: a.governorate,
      list: [],
      categories: [],
    };
    entry.list.push(a);
    for (const c of a.categories) {
      if (!entry.categories.includes(c)) entry.categories.push(c);
    }
    acc.set(a.place, entry);
    return acc;
  }, new Map<string, PlaceAssociations>());

/** أسماء المواقع التي تعمل فيها جمعية واحدة على الأقل. */
export const placesWithAssociations: string[] = [...associationsByPlace.keys()];
