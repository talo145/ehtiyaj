"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Dropdown, DropdownSurface } from "@/components/ui/Dropdown";
import { FilterBar, ResultRow } from "@/components/ui/FilterBar";
import {
  needCategories,
  placeKindLabel,
  placeKinds,
  priorityLevels,
} from "@/data/categories";
import {
  associationsByPlace,
  placesWithAssociations,
} from "@/lib/associations";
import { formatNumber, map, places } from "@/lib/needs";
import { cn } from "@/lib/cn";
import type { Place } from "@/types";
import styles from "./NeedsMapExplorer.module.css";

const NB_ISO = "SA-08";
const regionPath = map.regions.find((r) => r.iso === NB_ISO)?.d ?? "";
const PRIORITY_COLORS = ["#16B3A0", "#8FA9BC", "#33566A"];
const MAX_NEED = Math.max(...places.map((p) => p.need));

const PAD = 0.07;
const [bx0, by0, bx1, by1] = map.nbbox;
const BASE: [number, number, number, number] = [
  bx0 - (bx1 - bx0) * PAD,
  by0 - (by1 - by0) * PAD,
  (bx1 - bx0) * (1 + PAD * 2),
  (by1 - by0) * (1 + PAD * 2),
];

interface Filters {
  governorate: string;
  place: string;
  category: string;
  priority: string;
  kind: string;
  assocOnly: boolean;
}

const EMPTY: Filters = {
  governorate: "",
  place: "",
  category: "",
  priority: "",
  kind: "",
  assocOnly: false,
};

/** عدد احتياجات الموقع ضمن التصنيف المختار، أو إجماليه. */
function needOf(p: Place, category: string) {
  return category === "" ? p.need : (p.cats[Number(category)] ?? 0);
}

/** نصيب مستوى الأولوية من احتياجات الموقع. */
function priorityShare(p: Place, priority: string) {
  if (!priority) return 1;
  const total = p.pri[0] + p.pri[1] + p.pri[2] || 1;
  return (
    p.pri[priorityLevels.indexOf(priority as (typeof priorityLevels)[number])] /
    total
  );
}

export function NeedsMapExplorer() {
  const [f, setF] = useState<Filters>(EMPTY);
  const [selected, setSelected] = useState("");
  const [zoom, setZoom] = useState(1);
  const [tip, setTip] = useState<{ x: number; y: number; place: Place } | null>(
    null,
  );
  const hostRef = useRef<HTMLDivElement | null>(null);

  const inFilter = useCallback(
    (p: Place) => {
      if (f.governorate && p.g !== f.governorate) return false;
      if (f.place && p.n !== f.place) return false;
      if (f.kind && p.k !== f.kind) return false;
      if (f.assocOnly && !associationsByPlace.has(p.n)) return false;
      if (needOf(p, f.category) === 0) return false;
      return true;
    },
    [f],
  );

  const shown = useMemo(() => places.filter(inFilter), [inFilter]);

  /** عتبات ربعية تُحسب من قيم التصفية الحالية، فالتدرّج يبقى مقروءًا مهما تغيّر التصنيف. */
  const breaks = useMemo(() => {
    const vals = places
      .map((p) => needOf(p, f.category))
      .filter((v) => v > 0)
      .sort((a, b) => a - b);
    const q = (r: number) =>
      vals.length
        ? vals[Math.min(vals.length - 1, Math.floor(vals.length * r))]
        : 0;
    return [q(0.35), q(0.65), q(0.88)];
  }, [f.category]);

  const totals = useMemo(() => {
    return shown.reduce(
      (acc, p) => {
        const v = needOf(p, f.category) * priorityShare(p, f.priority);
        const ratio = needOf(p, f.category) / (p.need || 1);
        return {
          needs: acc.needs + v,
          beneficiaries: acc.beneficiaries + p.ben * (v / (p.need || 1)),
          high: acc.high + p.pri[0] * ratio,
          places: acc.places + 1,
          associations:
            acc.associations + (associationsByPlace.get(p.n)?.list.length ?? 0),
        };
      },
      { needs: 0, beneficiaries: 0, high: 0, places: 0, associations: 0 },
    );
  }, [shown, f.category, f.priority]);

  const byCategory = useMemo(
    () =>
      needCategories.map((_, i) =>
        shown.reduce((a, p) => a + (p.cats[i] ?? 0), 0),
      ),
    [shown],
  );
  const maxCategory = Math.max(...byCategory, 1);

  const byPriority = useMemo(() => {
    const v = [0, 0, 0];
    for (const p of shown) {
      const ratio = needOf(p, f.category) / (p.need || 1);
      v[0] += p.pri[0] * ratio;
      v[1] += p.pri[1] * ratio;
      v[2] += p.pri[2] * ratio;
    }
    return v;
  }, [shown, f.category]);

  const topPlaces = useMemo(
    () =>
      [...shown]
        .sort((a, b) => needOf(b, f.category) - needOf(a, f.category))
        .slice(0, 10),
    [shown, f.category],
  );

  const viewBox = useMemo(() => {
    const w = BASE[2] / zoom;
    const h = BASE[3] / zoom;
    const cx = BASE[0] + BASE[2] / 2;
    const cy = BASE[1] + BASE[3] / 2;
    return [cx - w / 2, cy - h / 2, w, h].join(" ");
  }, [zoom]);

  const pills = [
    f.governorate && { key: "governorate", label: f.governorate },
    f.place && { key: "place", label: f.place },
    f.category && {
      key: "category",
      label: needCategories[Number(f.category)],
    },
    f.priority && { key: "priority", label: `أولوية ${f.priority}` },
    f.kind && { key: "kind", label: placeKindLabel(f.kind) },
    f.assocOnly && { key: "assocOnly", label: "فيها جمعيات" },
  ].filter(Boolean) as { key: string; label: string }[];

  function clear(key: string) {
    setF((prev) => ({ ...prev, [key]: key === "assocOnly" ? false : "" }));
  }

  const donutTotal = byPriority[0] + byPriority[1] + byPriority[2] || 1;
  const R = 54;
  const C = 2 * Math.PI * R;
  let offset = 0;

  return (
    <DropdownSurface>
      <FilterBar activeCount={pills.length} columns={5}>
        <Dropdown
          options={map.govs.map((g) => ({
            value: g.name,
            label: g.name,
            hint: `${places.filter((p) => p.g === g.name).length} موقعًا`,
          }))}
          placeholder="كل المحافظات"
          value={f.governorate}
          onChange={(v) => setF((p) => ({ ...p, governorate: v, place: "" }))}
          ariaLabel="المحافظة"
        />
        <Dropdown
          options={placesWithAssociations.map((n) => {
            const e = associationsByPlace.get(n)!;
            return {
              value: n,
              label: n,
              hint: `${e.governorate} · ${e.list.length} جمعية`,
            };
          })}
          placeholder="المواقع التي فيها جمعيات"
          value={f.place}
          onChange={(v) => setF((p) => ({ ...p, place: v }))}
          searchable
          searchPlaceholder="ابحث عن مدينة أو قرية…"
          ariaLabel="الموقع"
        />
        <Dropdown
          options={needCategories.map((c, i) => ({
            value: String(i),
            label: c,
          }))}
          placeholder="كل التصنيفات"
          value={f.category}
          onChange={(v) => setF((p) => ({ ...p, category: v }))}
          ariaLabel="تصنيف الاحتياج"
        />
        <Dropdown
          options={priorityLevels.map((p) => ({
            value: p,
            label: `أولوية ${p}`,
          }))}
          placeholder="كل الأولويات"
          value={f.priority}
          onChange={(v) => setF((p) => ({ ...p, priority: v }))}
          ariaLabel="الأولوية"
        />
        <Dropdown
          options={placeKinds.map((k) => ({
            value: k.value,
            label: k.label,
            hint: `${places.filter((p) => p.k === k.value).length}`,
          }))}
          placeholder="كل أنواع المواقع"
          value={f.kind}
          onChange={(v) => setF((p) => ({ ...p, kind: v }))}
          ariaLabel="نوع الموقع"
        />
      </FilterBar>

      <ResultRow pills={pills} onRemove={clear}>
        <button
          type="button"
          className={styles.toggle}
          aria-pressed={f.assocOnly}
          onClick={() => setF((p) => ({ ...p, assocOnly: !p.assocOnly }))}
          style={{ marginInlineEnd: 14 }}
        >
          <i /> المواقع التي فيها جمعيات فقط
        </button>
        <b className="tabular">{totals.places}</b> موقعًا ضمن التصفية من أصل{" "}
        <span className="tabular">{places.length}</span>
      </ResultRow>

      <div
        ref={hostRef}
        className={styles.mapshell}
        onMouseLeave={() => setTip(null)}
        role="application"
        aria-label={`خريطة احتياج منطقة الحدود الشمالية — ${formatNumber(totals.needs)} احتياج في ${totals.places} موقعًا`}
      >
        <svg viewBox={viewBox} preserveAspectRatio="xMidYMid meet">
          <path className={styles.regionFill} d={regionPath} />
          <path className={styles.regionEdge} d={regionPath} />

          {places.map((p, i) => {
            const on = inFilter(p);
            const v = needOf(p, f.category);
            const r = 2.1 + Math.sqrt((v || 1) / MAX_NEED) * 7.1;
            const hi = p.pri[0] / p.need > 0.26;
            const tier =
              v > breaks[2]
                ? styles.t4
                : v > breaks[1]
                  ? styles.t3
                  : v > breaks[0]
                    ? styles.t2
                    : styles.t1;
            // الأصل والتأخير على كل عنصر، فالنبضات تتوزّع بدل أن تتزامن
            const anim = {
              transformOrigin: `${p.x}px ${p.y}px`,
              animationDelay: `${((i * 173) % 460) / 100}s`,
            };
            const assoc = associationsByPlace.get(p.n);

            return (
              <g key={`${p.n}-${i}`}>
                <circle
                  className={cn(
                    styles.pulse,
                    hi && styles.hi,
                    !on && styles.off,
                  )}
                  cx={p.x}
                  cy={p.y}
                  r={r}
                  style={anim}
                />
                {assoc ? (
                  <circle
                    className={cn(styles.assocRing, !on && styles.off)}
                    cx={p.x}
                    cy={p.y}
                    r={r + 3}
                  />
                ) : null}
                <circle
                  className={cn(
                    styles.place,
                    hi && styles.hi,
                    tier,
                    !on && styles.off,
                    selected === p.n && styles.selected,
                  )}
                  cx={p.x}
                  cy={p.y}
                  r={r}
                  style={anim}
                  tabIndex={on ? 0 : -1}
                  role="button"
                  aria-label={`${p.n} — ${formatNumber(v)} احتياج`}
                  onClick={() => setSelected((s) => (s === p.n ? "" : p.n))}
                  onMouseMove={(e) => {
                    const box = hostRef.current?.getBoundingClientRect();
                    if (!box) return;
                    setTip({
                      x: e.clientX - box.left,
                      y: e.clientY - box.top - 8,
                      place: p,
                    });
                  }}
                />
                {p.k === "city" || p.k === "town" || assoc ? (
                  <text
                    className={cn(styles.label, !on && styles.off)}
                    x={p.x}
                    y={p.y - r - 6}
                  >
                    {p.n}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>

        {tip ? (
          <div className={styles.tip} style={{ left: tip.x, top: tip.y }}>
            <b>{tip.place.n}</b>
            <span>
              {formatNumber(needOf(tip.place, f.category))} احتياج ·{" "}
              {placeKindLabel(tip.place.k)} · {tip.place.g}
            </span>
            {associationsByPlace.has(tip.place.n) ? (
              <em>
                {associationsByPlace.get(tip.place.n)!.list.length} جمعية تعمل
                هنا
              </em>
            ) : null}
          </div>
        ) : null}

        <div className={styles.legend}>
          <b>الحجم واللون = عدد الاحتياجات</b>
          <div className={styles.legendRow}>
            <span>
              <i style={{ width: 6, height: 6, background: "#0D554F" }} /> أقل
            </span>
            <span>
              <i style={{ width: 9, height: 9, background: "#12897C" }} />
            </span>
            <span>
              <i style={{ width: 12, height: 12, background: "#16B3A0" }} />
            </span>
            <span>
              <i style={{ width: 15, height: 15, background: "#4FD8C6" }} />{" "}
              أعلى
            </span>
            <span>
              <i style={{ width: 11, height: 11, background: "#F0A272" }} />{" "}
              أولوية عالية مرتفعة
            </span>
            <span>
              <i
                style={{ width: 13, height: 13, border: "1.4px solid #EAF2F5" }}
              />{" "}
              يوجد جمعية
            </span>
          </div>
        </div>

        <div className={styles.zoom}>
          <button
            type="button"
            aria-label="تكبير"
            onClick={() => setZoom((z) => Math.min(4, z * 1.3))}
          >
            +
          </button>
          <button
            type="button"
            aria-label="تصغير"
            onClick={() => setZoom((z) => Math.max(1, z / 1.3))}
          >
            −
          </button>
        </div>
      </div>

      <div className={cn("stat-bar", styles.stats)}>
        <div>
          <b className="tabular">{formatNumber(totals.needs)}</b>
          <span>احتياج مسجّل</span>
        </div>
        <div>
          <b className="tabular">{formatNumber(totals.beneficiaries)}</b>
          <span>مستفيد</span>
        </div>
        <div>
          <b className="tabular">{totals.places}</b>
          <span>مدينة وقرية</span>
        </div>
        <div>
          <b className="tabular">{formatNumber(totals.high)}</b>
          <span>أولوية عالية</span>
        </div>
        <div>
          <b className="tabular">{totals.associations}</b>
          <span>جمعية تعمل هنا</span>
        </div>
      </div>

      <div className={styles.analytics}>
        <div className="panel">
          <h3>الاحتياج حسب التصنيف</h3>
          <p className="hint">
            مجموع الاحتياجات المسجّلة في كل تصنيف ضمن التصفية الحالية.
          </p>
          <div className={styles.bars}>
            {needCategories.map((c, i) => (
              <div key={c} className={styles.bar}>
                <b>
                  {c}
                  <span className="mono">{formatNumber(byCategory[i])}</span>
                </b>
                <i>
                  <em
                    style={{
                      width: `${Math.round((byCategory[i] / maxCategory) * 100)}%`,
                      opacity: f.category && Number(f.category) !== i ? 0.3 : 1,
                    }}
                  />
                </i>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h3>التوزيع حسب الأولوية</h3>
          <p className="hint">
            الأولوية تُحدَّد يدويًا في مرحلة المراجعة، لا آليًا.
          </p>
          <div className={styles.donut}>
            <svg
              width="140"
              height="140"
              viewBox="0 0 140 140"
              role="img"
              aria-label="توزيع الاحتياج حسب الأولوية"
            >
              <circle
                cx="70"
                cy="70"
                r={R}
                fill="none"
                stroke="rgba(234,242,245,.07)"
                strokeWidth="20"
              />
              {byPriority.map((v, i) => {
                const len = (v / donutTotal) * C;
                const dash = `${len.toFixed(1)} ${(C - len).toFixed(1)}`;
                const shift = -offset;
                offset += len;
                return (
                  <circle
                    key={i}
                    cx="70"
                    cy="70"
                    r={R}
                    fill="none"
                    stroke={PRIORITY_COLORS[i]}
                    strokeWidth="20"
                    strokeDasharray={dash}
                    strokeDashoffset={shift.toFixed(1)}
                    transform="rotate(-90 70 70)"
                  />
                );
              })}
              <text
                x="70"
                y="66"
                textAnchor="middle"
                fill="#EAF2F5"
                fontSize="21"
                fontWeight="700"
              >
                {formatNumber(donutTotal)}
              </text>
              <text
                x="70"
                y="86"
                textAnchor="middle"
                fill="#8FA9BC"
                fontSize="11"
              >
                احتياج
              </text>
            </svg>
            <div className={styles.donutLegend}>
              {priorityLevels.map((p, i) => (
                <div key={p}>
                  <i style={{ background: PRIORITY_COLORS[i] }} />
                  {p}
                  <b className="tabular">{formatNumber(byPriority[i])}</b>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 18 }}>
        <h3>أعلى المدن والقرى احتياجًا</h3>
        <p className="hint">اضغط أي صف لتحديد الموقع على الخريطة.</p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.start}>المدينة أو القرية</th>
                <th className={styles.start}>المحافظة</th>
                <th className={styles.num}>الاحتياجات</th>
                <th className={styles.num}>المستفيدون</th>
                <th className={styles.num}>أولوية عالية</th>
                <th className={styles.num}>الجمعيات</th>
              </tr>
            </thead>
            <tbody>
              {topPlaces.length ? (
                topPlaces.map((p) => {
                  const assoc = associationsByPlace.get(p.n);
                  const v = needOf(p, f.category);
                  const max = needOf(topPlaces[0], f.category) || 1;
                  return (
                    <tr
                      key={p.n}
                      aria-selected={selected === p.n}
                      onClick={() => setSelected((s) => (s === p.n ? "" : p.n))}
                    >
                      <td className={cn(styles.start, styles.name)}>
                        {p.n}
                        <span className={styles.mini}>
                          <em
                            style={{ width: `${Math.round((v / max) * 100)}%` }}
                          />
                        </span>
                      </td>
                      <td className={styles.start}>{p.g}</td>
                      <td className={cn(styles.num, "mono")}>
                        {formatNumber(v)}
                      </td>
                      <td className={cn(styles.num, "mono")}>
                        {formatNumber(p.ben)}
                      </td>
                      <td className={cn(styles.num, "mono")}>
                        {formatNumber(p.pri[0])}
                      </td>
                      <td className={styles.num}>
                        {assoc ? (
                          <span className={styles.has}>
                            <i />
                            {assoc.list.length}
                          </span>
                        ) : (
                          <span style={{ color: "var(--dim)" }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      color: "var(--dim)",
                      padding: 26,
                    }}
                  >
                    لا توجد نتائج ضمن هذه التصفية
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.privacy}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path d="M10 2.5 3.8 5v4.6c0 3.6 2.5 6.9 6.2 7.9 3.7-1 6.2-4.3 6.2-7.9V5L10 2.5Z" />
          <path
            d="M7.6 10.2 9.3 12l3.4-3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div>
          <b>ما لا تعرضه هذه الصفحة</b>
          <p>
            كل الأرقام مجمّعة على مستوى المدينة أو القرية. لا يظهر اسم مستفيد
            ولا رقمه ولا عنوانه ولا موقعه الدقيق ولا أي تفصيل صحي شخصي.
          </p>
        </div>
      </div>
    </DropdownSurface>
  );
}
