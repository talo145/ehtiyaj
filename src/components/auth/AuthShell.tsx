import { cn } from "@/lib/cn";
import styles from "./AuthShell.module.css";

const Check = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    aria-hidden="true"
  >
    <path d="m3 8.4 3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export interface AsideStat {
  value: string;
  label: string;
}

interface AuthShellProps {
  /** وسم صغير أعلى العنوان — نوع الحساب. */
  kicker: string;
  title: string;
  subtitle: string;
  /** خطاب اللوحة المقابلة، يختلف بين حساب الفرد وحساب الجهة. */
  asideKicker: string;
  asideTitle: string;
  asideText?: string;
  asidePoints?: string[];
  asideStats?: AsideStat[];
  /** يوسّع عمود النموذج لصفحات إنشاء الحساب. */
  wide?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthShell({
  kicker,
  title,
  subtitle,
  asideKicker,
  asideTitle,
  asideText,
  asidePoints,
  asideStats,
  wide = false,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className={styles.split}>
      <div className={styles.pane}>
        <div className={cn(styles.form, wide && styles.wide)}>
          <div className={styles.head}>
            <span className={styles.kicker}>{kicker}</span>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>

          {children}

          {footer ? <p className={styles.footLink}>{footer}</p> : null}
        </div>
      </div>

      <aside className={styles.aside}>
        <div className={styles.asideIn}>
          <span className={styles.kicker}>{asideKicker}</span>
          <h2>{asideTitle}</h2>
          {asideText ? <p>{asideText}</p> : null}

          {asideStats?.length ? (
            <div className={styles.nums}>
              {asideStats.map((s) => (
                <div key={s.label}>
                  <b className="tabular">{s.value}</b>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          ) : null}

          {asidePoints?.length ? (
            <ul className={styles.points}>
              {asidePoints.map((p) => (
                <li key={p}>
                  {Check}
                  {p}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
