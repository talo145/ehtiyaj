"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAccount } from "../AccountState";
import { ChevronIcon, ClockIcon, ShieldIcon, SignOutIcon, UserIcon } from "../icons";
import { ui } from "../pieces";

const items = [
  { href: "/account/profile", label: "الملف الشخصي", Icon: UserIcon },
  { href: "/account/privacy", label: "بياناتي وخصوصيتي", Icon: ShieldIcon },
  { href: "/account/history", label: "سجل احتياجاتي", Icon: ClockIcon },
];

/** شاشة «حسابي» — مدخل الجوال إلى صفحات البيانات التي تظهر على سطح المكتب
 *  في القائمة الجانبية. */
export function MeView() {
  const { profile, profileComplete, ready } = useAccount();
  if (!ready) return null;

  return (
    <>
      <div className={ui.head}>
        <h1>حسابي</h1>
      </div>

      <div className={ui.card} style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: "1.1rem" }}>{profile.name}</h2>
        <p className={ui.sub}>
          {profileComplete
            ? `${profile.city} · ${profile.region}`
            : "الملف غير مكتمل"}
        </p>
      </div>

      <div className={ui.menu}>
        {items.map(({ href, label, Icon }) => (
          <Link key={href} href={href}>
            <span className={ui.menuIcon} aria-hidden="true">
              <Icon />
            </span>
            {label}
            <span className={ui.menuGo} aria-hidden="true">
              <ChevronIcon />
            </span>
          </Link>
        ))}
      </div>

      <Button href="/login" variant="outline" className="mt-[18px] w-full">
        <SignOutIcon />
        تسجيل الخروج
      </Button>
    </>
  );
}
