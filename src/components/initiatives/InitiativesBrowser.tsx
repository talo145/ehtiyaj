"use client";

import { useMemo, useState } from "react";
import { InitiativeCard } from "./InitiativeCard";
import { Dropdown, DropdownSurface } from "@/components/ui/Dropdown";
import { FilterBar, ResultRow } from "@/components/ui/FilterBar";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { initiatives, monthOrder } from "@/data/initiatives";
import { needCategories } from "@/data/categories";
import { map } from "@/lib/needs";
import styles from "./InitiativesBrowser.module.css";

const PER_PAGE = 9;
const STATUSES = [
  { value: "active", label: "جارية" },
  { value: "upcoming", label: "قادمة" },
  { value: "completed", label: "مكتملة" },
];
const SORTS = ["الأحدث", "الأكثر استفادة", "حسب الحالة"] as const;
type Sort = (typeof SORTS)[number];

const STATUS_ORDER = ["active", "upcoming", "completed"];

export function InitiativesBrowser() {
  const [status, setStatus] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<Sort>(SORTS[0]);
  const [page, setPage] = useState(1);

  const statusOptions = useMemo(
    () =>
      STATUSES.map((s) => ({
        ...s,
        hint: `${initiatives.filter((i) => i.status === s.value).length}`,
      })),
    [],
  );

  const cityOptions = useMemo(
    () =>
      map.govs.map((g) => ({
        value: g.name,
        label: g.name,
        hint: `${initiatives.filter((i) => i.city === g.name).length}`,
      })),
    [],
  );

  const catOptions = useMemo(
    () =>
      needCategories.map((c, i) => ({
        value: String(i),
        label: c,
        hint: `${initiatives.filter((x) => x.category === i).length}`,
      })),
    [],
  );

  const results = useMemo(() => {
    const list = initiatives.filter((i) => {
      if (status && i.status !== status) return false;
      if (city && i.city !== city) return false;
      if (category && i.category !== Number(category)) return false;
      return true;
    });

    if (sort === "الأكثر استفادة")
      return [...list].sort((x, y) => y.beneficiaries - x.beneficiaries);
    if (sort === "حسب الحالة")
      return [...list].sort(
        (x, y) =>
          STATUS_ORDER.indexOf(x.status) - STATUS_ORDER.indexOf(y.status),
      );
    return [...list].sort(
      (x, y) =>
        monthOrder.indexOf(x.startedAt) - monthOrder.indexOf(y.startedAt),
    );
  }, [status, city, category, sort]);

  const pages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const current = Math.min(page, pages);
  const slice = results.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  function apply<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setPage(1);
    };
  }

  const pills = [
    status
      ? {
          key: "status",
          label: STATUSES.find((s) => s.value === status)!.label,
        }
      : null,
    city ? { key: "city", label: city } : null,
    category ? { key: "cat", label: needCategories[Number(category)] } : null,
  ].filter(Boolean) as { key: string; label: string }[];

  function removePill(key: string) {
    if (key === "status") setStatus("");
    if (key === "city") setCity("");
    if (key === "cat") setCategory("");
    setPage(1);
  }

  function reset() {
    setStatus("");
    setCity("");
    setCategory("");
    setPage(1);
  }

  return (
    <DropdownSurface>
      <FilterBar activeCount={pills.length} columns={4}>
        <Dropdown
          options={statusOptions}
          placeholder="كل الحالات"
          value={status}
          onChange={apply(setStatus)}
          ariaLabel="حالة المبادرة"
        />
        <Dropdown
          options={cityOptions}
          placeholder="كل المحافظات"
          value={city}
          onChange={apply(setCity)}
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
        <b className="tabular">{results.length}</b> مبادرة
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
          {slice.map((i) => (
            <InitiativeCard key={i.id} initiative={i} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="لا توجد مبادرة مطابقة"
          hint="لا توجد مبادرات بهذه المواصفات حاليًا. جرّب توسيع نطاق التصفية."
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
