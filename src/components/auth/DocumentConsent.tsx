"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { LegalDocument } from "@/data/legal";
import styles from "./DocumentConsent.module.css";

interface DocumentConsentProps {
  documents: LegalDocument[];
  /** يُبلَّغ بمعرّفات المستندات الموافَق عليها بعد كل تغيير. */
  onChange: (agreedIds: string[]) => void;
}

/** الموافقة لا تُؤخذ بعلامة صح: يُفتح المستند في نافذة،
 *  ولا يُفعَّل زر الموافقة إلا بعد الوصول إلى نهايته. */
export function DocumentConsent({ documents, onChange }: DocumentConsentProps) {
  const [agreed, setAgreed] = useState<string[]>([]);
  const [open, setOpen] = useState<LegalDocument | null>(null);
  const [readToEnd, setReadToEnd] = useState(false);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // مستند قصير لا يحتاج تمريرًا، فتُفعَّل الموافقة فورًا
  useEffect(() => {
    if (!open) return;
    setReadToEnd(false);
    const el = bodyRef.current;
    if (!el) return;
    const t = window.setTimeout(() => {
      if (el.scrollHeight - el.clientHeight < 24) setReadToEnd(true);
    }, 60);
    return () => window.clearTimeout(t);
  }, [open]);

  function accept() {
    if (!open) return;
    const next = agreed.includes(open.id) ? agreed : [...agreed, open.id];
    setAgreed(next);
    onChange(next);
    setOpen(null);
  }

  return (
    <>
      <div className={styles.docs}>
        {documents.map((d) => {
          const done = agreed.includes(d.id);
          return (
            <button
              key={d.id}
              type="button"
              className={cn(styles.doc, done && styles.agreed)}
              onClick={() => setOpen(d)}
            >
              <span className={styles.icon}>
                {done ? (
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path
                      d="m3 8.4 3 3 7-7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    aria-hidden="true"
                  >
                    <path
                      d="M11.5 2.5H6a1.5 1.5 0 0 0-1.5 1.5v12A1.5 1.5 0 0 0 6 17.5h8a1.5 1.5 0 0 0 1.5-1.5V6.5l-4-4Z"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.5 2.5v4h4M7.5 11h5M7.5 13.6h3"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </span>
              <span className={styles.text}>
                <b>{d.title}</b>
                <span>{d.meta}</span>
              </span>
              <span className={styles.state}>
                {done ? "تمت الموافقة" : "إلزامي"}
              </span>
            </button>
          );
        })}
      </div>

      <p className={styles.note}>
        اضغط كل مستند لقراءته والموافقة عليه من داخل النافذة. لا تُقبل الموافقة
        إلا بعد الاطّلاع.
      </p>

      {open ? (
        <div
          className={styles.modal}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(null);
          }}
        >
          <div
            className={styles.card}
            role="dialog"
            aria-modal="true"
            aria-labelledby="doc-title"
          >
            <div className={styles.cardHead}>
              <div>
                <h3 id="doc-title">{open.title}</h3>
                <small>{open.meta}</small>
              </div>
              <button
                type="button"
                className={styles.close}
                aria-label="إغلاق"
                onClick={() => setOpen(null)}
              >
                ✕
              </button>
            </div>

            <div
              ref={bodyRef}
              className={styles.body}
              tabIndex={0}
              onScroll={(e) => {
                const el = e.currentTarget;
                if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24)
                  setReadToEnd(true);
              }}
            >
              {open.sections.map((s) => (
                <section key={s.heading}>
                  <h4>{s.heading}</h4>
                  {s.paragraphs?.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                  {s.bullets ? (
                    <ul>
                      {s.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>

            <div className={styles.cardFoot}>
              <p className={cn(styles.readNote, readToEnd && styles.ready)}>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  aria-hidden="true"
                >
                  <path
                    d="M8 3v8M4.6 7.6 8 11l3.4-3.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {readToEnd
                  ? "قرأت المستند — يمكنك الموافقة الآن"
                  : "مرّر إلى نهاية المستند لتفعيل الموافقة"}
              </p>
              <Button variant="outline" size="sm" onClick={() => setOpen(null)}>
                إغلاق
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!readToEnd}
                onClick={accept}
              >
                أوافق على المستند
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
