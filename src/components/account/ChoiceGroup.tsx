"use client";

import { cn } from "@/lib/cn";
import type { SurveyChoice } from "@/data/need-categories";
import form from "./AccountForm.module.css";

/** اختيار واحد من مجموعة — نمط موحّد في الاستبانة كلها.
 *  القيمة المخزَّنة ثابتة، والنصّ المعروض قابل للتغيير دون أثر على البيانات. */
export function ChoiceGroup<V extends string>({
  label,
  options,
  value,
  onChange,
  columns = 1,
}: {
  label?: string;
  options: readonly SurveyChoice<V>[];
  value: V | "";
  onChange: (v: V) => void;
  columns?: 1 | 2;
}) {
  return (
    <div>
      {label ? <span className={form.groupLabel}>{label}</span> : null}
      <div className={cn(form.options, columns === 2 && form.two)}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={cn(form.option, value === o.value && form.on)}
          >
            <span className={form.radio} aria-hidden="true" />
            <span>
              <b>{o.label}</b>
              {o.hint ? <span className={form.optionHint}>{o.hint}</span> : null}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** قائمة المدن والقرى مجمّعة بمحافظاتها. */
export function CitySelect({
  value,
  onChange,
  disabled,
  groups,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  groups: { governorate: string; places: { name: string; kind: string }[] }[];
  placeholder: string;
}) {
  return (
    <select
      className={form.input}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {groups.map((g) => (
        <optgroup key={g.governorate} label={`محافظة ${g.governorate}`}>
          {g.places.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name} — {p.kind}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
