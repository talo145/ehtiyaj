import Link from "next/link";
import { Logo } from "./Logo";
import { footerColumns, site, socialLinks } from "@/data/site";
import type { SocialLink } from "@/data/site";
import styles from "./SiteFooter.module.css";

function SocialIcon({ icon }: { icon: SocialLink["icon"] }) {
  if (icon === "x") {
    return (
      <svg
        width="15"
        height="15"
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12.2 2h2.1l-4.6 5.3L15 14h-4.2l-3.3-4.3L3.7 14H1.6l5-5.7L1 2h4.3l3 4 3.9-4Zm-.7 10.7h1.2L4.6 3.2H3.3l8.2 9.5Z" />
      </svg>
    );
  }
  if (icon === "linkedin") {
    return (
      <svg
        width="15"
        height="15"
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M4.3 5.5H2.1V14h2.2V5.5ZM3.2 2a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6ZM14 9.6c0-2.2-1.2-3.3-2.8-3.3-1.3 0-1.9.7-2.2 1.2V5.5H6.8V14H9V9.4c0-.9.5-1.5 1.3-1.5s1.4.6 1.4 1.5V14H14V9.6Z" />
      </svg>
    );
  }
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      <rect x="2.5" y="2.5" width="11" height="11" rx="3.4" />
      <circle cx="8" cy="8" r="2.6" />
      <circle cx="11.4" cy="4.6" r=".7" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className={styles.foot} aria-label="تذييل الموقع">
      <div className="wrap">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Logo />
            <p>
              منصة رقمية تحوّل الاحتياج الفعلي إلى بيانات منظّمة، لتُبنى
              المبادرات على ما يحتاجه المجتمع لا على التقدير.
            </p>
            <div className={styles.social}>
              {socialLinks.map((s) => (
                <a key={s.icon} href={s.href} aria-label={s.label}>
                  <SocialIcon icon={s.icon} />
                </a>
              ))}
            </div>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title} className={styles.col}>
              <h4>{col.title}</h4>
              {col.links.map((link) => (
                <Link key={link.label} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <span>
            © {new Date().getFullYear()} {site.name} — جميع الحقوق محفوظة
          </span>
          <span className={`${styles.demo} mono`}>DEMO DATA</span>
        </div>
      </div>
    </footer>
  );
}
