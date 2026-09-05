"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { cn } from "@/lib/cn";
import styles from "./Dropdown.module.css";

export interface DropdownOption {
  value: string;
  label: string;
  /** سطر صغير يمين الخيار — عدد المواقع مثلًا. */
  hint?: string;
}

interface SurfaceValue {
  openId: string | null;
  setOpenId: (id: string | null) => void;
}

const Surface = createContext<SurfaceValue>({
  openId: null,
  setOpenId: () => {},
});

/** يلفّ كل ما يحوي قوائم منسدلة: يمسك أي قائمة مفتوحة ويرسم الحجاب فوق الصفحة. */
export function DropdownSurface({ children }: { children: React.ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openId]);

  return (
    <Surface.Provider value={{ openId, setOpenId }}>
      {openId ? (
        <div
          className={styles.scrim}
          aria-hidden="true"
          onClick={() => setOpenId(null)}
        />
      ) : null}
      {children}
    </Surface.Provider>
  );
}

/** true حين تكون أي قائمة مفتوحة — يستعمله شريط التصفية ليرفع نفسه فوق الحجاب. */
export function useAnyDropdownOpen(): boolean {
  return useContext(Surface).openId !== null;
}

interface DropdownProps {
  options: DropdownOption[];
  /** نص الخيار الفارغ، وهو أيضًا ما يظهر على الزر قبل الاختيار. */
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  /** يضيف حقل بحث داخل القائمة — للقوائم الطويلة. */
  searchable?: boolean;
  searchPlaceholder?: string;
  ariaLabel?: string;
}

export function Dropdown({
  options,
  placeholder,
  value,
  onChange,
  searchable = false,
  searchPlaceholder = "ابحث…",
  ariaLabel,
}: DropdownProps) {
  const id = useId();
  const { openId, setOpenId } = useContext(Surface);
  const [query, setQuery] = useState("");
  const open = openId === id;

  const all = useMemo<DropdownOption[]>(
    () => [{ value: "", label: placeholder }, ...options],
    [options, placeholder],
  );

  const visible = useMemo(() => {
    const q = query.trim();
    if (!q) return all;
    // خيار «الكل» يبقى ظاهرًا دائمًا كي يمكن إلغاء الاختيار أثناء البحث
    return all.filter(
      (o) => !o.value || o.label.includes(q) || (o.hint ?? "").includes(q),
    );
  }, [all, query]);

  const current = all.find((o) => o.value === value)?.label ?? placeholder;

  function toggle() {
    setQuery("");
    setOpenId(open ? null : id);
  }

  function pick(v: string) {
    onChange(v);
    setOpenId(null);
  }

  return (
    <div className={cn(styles.sel, open && styles.open)}>
      <button
        type="button"
        className={cn(styles.btn, value && styles.picked)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={toggle}
      >
        <span className={styles.label}>{current}</span>
        <svg
          className={styles.chevron}
          width="13"
          height="13"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path
            d="m2.5 4.5 3.5 3.5 3.5-3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <div className={styles.menu} role="listbox">
          {searchable ? (
            <label className={styles.find}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <circle cx="7.2" cy="7.2" r="4.6" />
                <path d="M10.6 10.6 13.5 13.5" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                autoFocus
                value={query}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          ) : null}

          {visible.some((o) => o.value) || !query.trim() ? (
            visible.map((o) => (
              <button
                key={o.value || "__all"}
                type="button"
                role="option"
                aria-selected={o.value === value}
                className={styles.opt}
                onClick={() => pick(o.value)}
              >
                <span>{o.label}</span>
                {o.hint ? (
                  <span className={styles.optSub}>{o.hint}</span>
                ) : null}
                <svg
                  className={styles.tick}
                  width="13"
                  height="13"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path
                    d="m2.5 6.2 2.3 2.3 4.7-4.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ))
          ) : (
            <p className={styles.none}>لا يوجد خيار بهذا الاسم</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
