"use client";

import { useMemo, useState } from "react";
import { AssociationCard } from "./AssociationCard";
import { Dropdown, DropdownSurface } from "@/components/ui/Dropdown";
import { FilterBar, ResultRow } from "@/components/ui/FilterBar";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { associations } from "@/data/associations";
import { needCategories } from "@/data/categories";
import { map } from "@/lib/needs";
import styles from "./AssociationsBrowser.module.css";

const PER_PAGE = 9;
const SORTS = ["الأكثر مبادرات", "الأكثر احتياجات", "أبجديًا"] as const;
type Sort = (typeof SORTS)[number];

export function AssociationsBrowser() {
  const [governorate, setGovernorate] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<Sort>(SORTS[0]);
  const [page, setPage] = useState(1);

  const govOptions = useMemo(
    () =>
      map.govs.map((g) => ({
        value: g.name,
        label: g.name,
        hint: `${associations.filter((a) => a.governorate === g.name).length} جمعية`,
      })),
    [],
  );

  const catOptions = useMemo(
    () =>
      needCategories.map((c, i) => ({
        value: String(i),
        label: c,
        hint: `${associations.filter((a) => a.categories.includes(i)).length}`,
      })),
    [],
  );

  const results = useMemo(() => {
    const list = associations.filter((a) => {
      if (governorate && a.governorate !== governorate) return false;
      if (category && !a.categories.includes(Number(category))) return false;
      return true;
    });

    if (sort === "الأكثر احتياجات")
      return [...list].sort((x, y) => y.needs - x.needs);
    if (sort === "أبجديًا")
      return [...list].sort((x, y) => x.name.localeCompare(y.name, "ar"));
    return [...list].sort((x, y) => y.initiatives - x.initiatives);
  }, [governorate, category, sort]);

  const pages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const current = Math.min(page, pages);
  const slice = results.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  // أي تغيير في التصفية يعيدنا للصفحة الأولى، وإلا بقينا على صفحة لم تعد موجودة
  function apply<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setPage(1);
    };
  }

  const pills = [
    governorate ? { key: "gov", label: governorate } : null,
    category ? { key: "cat", label: needCategories[Number(category)] } : null,
  ].filter(Boolean) as { key: string; label: string }[];

  function removePill(key: string) {
    if (key === "gov") setGovernorate("");
    if (key === "cat") setCategory("");
    setPage(1);
  }

  function reset() {
    setGovernorate("");
    setCategory("");
    setPage(1);
  }

  return (
    <DropdownSurface>
      <FilterBar activeCount={pills.length} columns={3}>
        <Dropdown
          options={govOptions}
          placeholder="كل المحافظات"
          value={governorate}
          onChange={apply(setGovernorate)}
          ariaLabel="المحافظة"
        />
        <Dropdown
          options={catOptions}
          placeholder="كل التصنيفات"
          value={category}
          onChange={apply(setCategory)}
          ariaLabel="تصنيف الاحتياج"
        />
        <Dropdown
          options={SORTS.slice(1).map((s) => ({ value: s, label: s }))}
          placeholder={SORTS[0]}
          value={sort === SORTS[0] ? "" : sort}
          onChange={apply((v: string) => setSort((v || SORTS[0]) as Sort))}
          ariaLabel="الترتيب"
        />
      </FilterBar>

      <ResultRow pills={pills} onRemove={removePill}>
        <b className="tabular">{results.length}</b> جمعية
        {pages > 1 ? (
          <>
            {" · صفحة "}
            <span className="tabular">{current}</span> من{" "}
            <span className="tabular">{pages}</span>
          </>
        ) : null}
      </ResultRow>

      {results.length ? (
        <div className={styles.grid}>
          {slice.map((a) => (
            <AssociationCard key={a.id} association={a} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="لا توجد جمعية مطابقة"
          hint="جرّب توسيع نطاق التصفية، أو أزل أحد الفلاتر المطبّقة."
          action={
            <Button variant="outline" onClick={reset}>
              إعادة التصفية
            </Button>
          }
        />
      )}

      <Pagination page={current} pages={pages} onChange={setPage} />
    </DropdownSurface>
  );
}
