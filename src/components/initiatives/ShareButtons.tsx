"use client";

import { useState } from "react";
import styles from "./InitiativeDetail.module.css";

/** أزرار مشاركة. النسخ يعمل فعليًا، وواتساب يفتح نصًا جاهزًا. */
export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // المتصفح قد يمنع الحافظة بلا تفاعل موثوق — نتجاهل بصمت
    }
  }

  function shareWhatsApp() {
    const text = `${title} — ${window.location.href}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener",
    );
  }

  return (
    <div className={styles.share}>
      <button type="button" onClick={shareWhatsApp}>
        <i>
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-2.9.8.8-2.8-.2-.3A8.2 8.2 0 1 1 12 20.2Z" />
          </svg>
        </i>
        واتساب
      </button>

      <button type="button" onClick={copy}>
        <i>
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M6.5 9.5a3 3 0 0 0 4.2 0l2-2a3 3 0 0 0-4.2-4.2l-.7.7" />
            <path d="M9.5 6.5a3 3 0 0 0-4.2 0l-2 2a3 3 0 0 0 4.2 4.2l.7-.7" />
          </svg>
        </i>
        {copied ? "تم النسخ" : "نسخ الرابط"}
      </button>
    </div>
  );
}
