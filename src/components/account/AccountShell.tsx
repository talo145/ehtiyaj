"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";
import { Button } from "@/components/ui/Button";
import { logout } from "@/server/actions/auth";
import { cn } from "@/lib/cn";
import { useAccount } from "./AccountState";
import { StatusBadge } from "./pieces";
import {
  AccountMark,
  BackIcon,
  BellIcon,
  ClockIcon,
  DocIcon,
  HomeIcon,
  InfoIcon,
  LockIcon,
  PlusIcon,
  ShieldIcon,
  SignOutIcon,
  UserIcon,
} from "./icons";
import styles from "./AccountShell.module.css";

const nav = [
  { href: "/account", label: "لوحتي", short: "الرئيسية", Icon: HomeIcon },
  { href: "/account/need", label: "احتياجي", short: "احتياجي", Icon: DocIcon },
  { href: "/account/history", label: "السجل", short: "السجل", Icon: ClockIcon },
  {
    href: "/account/notifications",
    label: "الإشعارات",
    short: "الإشعارات",
    Icon: BellIcon,
  },
  { href: "/account/me", label: "حسابي", short: "حسابي", Icon: UserIcon },
];

const accountNav = [
  { href: "/account/profile", label: "الملف الشخصي", Icon: UserIcon },
  { href: "/account/privacy", label: "بياناتي وخصوصيتي", Icon: ShieldIcon },
];

/** عنوان كل شاشة كما يظهر في شريط الجوال العلوي. */
const titles: Record<string, string> = {
  "/account": "لوحتي",
  "/account/need": "احتياجي",
  "/account/history": "سجل احتياجاتي",
  "/account/notifications": "الإشعارات",
  "/account/me": "حسابي",
  "/account/profile": "الملف الشخصي",
  "/account/privacy": "بياناتي وخصوصيتي",
  "/account/complete": "إكمال بياناتي",
  "/account/new-need": "استبانة الاحتياج",
};

/** الشاشات الفرعية وأين يعود منها زر الرجوع. */
const parents: Record<string, string> = {
  "/account/profile": "/account/me",
  "/account/privacy": "/account/me",
  "/account/complete": "/account",
  "/account/new-need": "/account",
};

/** شاشات التدفّق: تُخفي الشريط السفلي وتضع أزرارها في شريط ثابت أسفل الشاشة. */
const flowScreens = new Set(["/account/complete", "/account/new-need"]);

type Gate = "blocked" | "incomplete" | null;

const NewNeedContext = createContext<(() => void) | null>(null);

/** الإجراء الأساسي في الحساب كله. يعبر البوابتين قبل أن يفتح الاستبانة. */
export function useNewNeed(): () => void {
  const fn = useContext(NewNeedContext);
  if (!fn) throw new Error("useNewNeed خارج AccountShell");
  return fn;
}

function isActive(pathname: string, href: string) {
  if (href === "/account") return pathname === "/account";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AccountShell({ children }: { children: React.ReactNode }) {
  const {
    user,
    profile,
    profileComplete,
    hasOpenNeed,
    history,
    unreadCount,
    current,
  } = useAccount();
  const pathname = usePathname();
  const router = useRouter();
  const [gate, setGate] = useState<Gate>(null);

  const unread = unreadCount;
  const isFlow = flowScreens.has(pathname);
  const parent = parents[pathname];
  /** الزر العائم لا يظهر قبل أول احتياج — بطاقة اللوحة تكفي حينها. */
  const showFab =
    !isFlow && profileComplete && (hasOpenNeed || history.length > 0);

  function requestNewNeed() {
    if (!profileComplete) return setGate("incomplete");
    if (hasOpenNeed) return setGate("blocked");
    router.push("/account/new-need");
  }

  return (
    <NewNeedContext.Provider value={requestNewNeed}>
      <div className={styles.app}>
        <header className={styles.top}>
          <Link href="/account" className={styles.brand}>
            <AccountMark />
            <b>احتياج</b>
            <span>حسابي</span>
          </Link>

          <div className={styles.spacer} />

          <Link
            href="/account/notifications"
            className={styles.iconBtn}
            aria-label={`الإشعارات${unread ? ` (${unread} غير مقروء)` : ""}`}
          >
            <BellIcon />
            {unread > 0 ? <span className={styles.dot} /> : null}
          </Link>

          <div className={styles.who}>
            <b>{user.name}</b>
            <span>
              {profile.city
                ? `${profile.city} · ${profile.region}`
                : "الملف غير مكتمل"}
            </span>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className={styles.iconBtn}
              aria-label="تسجيل الخروج"
            >
              <SignOutIcon />
            </button>
          </form>
        </header>

        <header className={styles.mtop}>
          {parent ? (
            <Link
              href={parent}
              className={styles.back}
              aria-label="رجوع"
            >
              <BackIcon />
            </Link>
          ) : null}
          <h2>{titles[pathname] ?? "حسابي"}</h2>
          {pathname === "/account" && current ? (
            <span className={styles.mtopBadge}>
              <StatusBadge status={current.status} />
            </span>
          ) : null}
        </header>

        <div className={styles.shell}>
          <aside className={styles.side} aria-label="أقسام الحساب">
            <p className={styles.group}>الحساب</p>
            {nav
              .filter((n) => n.href !== "/account/me")
              .map(({ href, label, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(isActive(pathname, href) && styles.on)}
                  aria-current={isActive(pathname, href) ? "page" : undefined}
                >
                  <Icon />
                  {label}
                  {href === "/account/notifications" && unread > 0 ? (
                    <span className={styles.count}>{unread}</span>
                  ) : null}
                </Link>
              ))}

            <p className={styles.group}>بياناتي</p>
            {accountNav.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(isActive(pathname, href) && styles.on)}
                aria-current={isActive(pathname, href) ? "page" : undefined}
              >
                <Icon />
                {label}
              </Link>
            ))}

            {pathname !== "/account" ? (
              <div className={styles.sideFoot}>
                <Button
                  variant="cta"
                  className="w-full"
                  onClick={requestNewNeed}
                >
                  <PlusIcon />
                  سجّل احتياجًا
                </Button>
              </div>
            ) : null}
          </aside>

          <div className={styles.main}>{children}</div>
        </div>

        {showFab ? (
          <button type="button" className={styles.fab} onClick={requestNewNeed}>
            <PlusIcon />
            احتياج جديد
          </button>
        ) : null}

        <nav
          className={cn(styles.bottom, isFlow && styles.hidden)}
          aria-label="التنقل السريع"
        >
          {nav.map(({ href, short, Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(isActive(pathname, href) && styles.on)}
              aria-current={isActive(pathname, href) ? "page" : undefined}
            >
              {href === "/account/notifications" && unread > 0 ? (
                <span className={styles.pip}>{unread}</span>
              ) : null}
              <Icon />
              <span>{short}</span>
            </Link>
          ))}
        </nav>

        {gate ? (
          <Gate kind={gate} onClose={() => setGate(null)} />
        ) : null}
      </div>
    </NewNeedContext.Provider>
  );
}

/** الشرح الذي يظهر عند محاولة التسجيل، لا قبلها. */
function Gate({ kind, onClose }: { kind: Exclude<Gate, null>; onClose: () => void }) {
  const blocked = kind === "blocked";

  return (
    <div
      className={styles.scrim}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modal} role="dialog" aria-modal="true">
        <div
          className={styles.modalIcon}
          style={
            blocked
              ? { background: "rgba(240,162,114,.12)", color: "#F0A272" }
              : { background: "rgba(22,179,160,.12)", color: "var(--accent)" }
          }
        >
          {blocked ? <LockIcon /> : <InfoIcon />}
        </div>

        <h2>{blocked ? "لديك احتياج قائم" : "أكمل بياناتك أولًا"}</h2>
        <p>
          {blocked
            ? "لا يمكنك تسجيل احتياج جديد الآن. يُسمح باحتياج واحد قائم في كل مرة — يفتح لك التسجيل فور اكتمال احتياجك الحالي أو إغلاقه."
            : "لتسجيل احتياج نحتاج رقم جوالك ومدينتك — بهما يصل احتياجك إلى الجمعية الصحيحة وتستطيع التواصل معك. لن يستغرق الأمر دقيقة."}
        </p>

        <div className={styles.modalActions}>
          <Button
            href={blocked ? "/account/need" : "/account/complete"}
            variant="cta"
            withArrow
            onClick={onClose}
          >
            {blocked ? "عرض احتياجي" : "أكمل بياناتي"}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            {blocked ? "إغلاق" : "لاحقًا"}
          </Button>
        </div>
      </div>
    </div>
  );
}
