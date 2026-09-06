"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import { navLinks } from "@/data/site";
import { cn } from "@/lib/cn";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // القائمة تُغلق بمفتاح الهروب حتى لا يعلق المستخدم داخلها
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={cn(styles.nav, solid && styles.solid)}>
      <Logo />

      <nav className={styles.links} aria-label="التنقل الرئيسي">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={link.href === pathname ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className={styles.actions}>
        <Button href="/login" variant="ghost" className={styles.ghostAction}>
          تسجيل الدخول
        </Button>
        <Button href="/register" variant="primary">
          انضم إلينا
        </Button>
        <button
          type="button"
          className={styles.burger}
          aria-label="القائمة"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <i />
          <i />
          <i />
        </button>
      </div>

      <div
        id="mobile-menu"
        className={cn(styles.menu, open && styles.menuOpen)}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) setOpen(false);
        }}
      >
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
        <Button href="/login" variant="outline" className={styles.menuCta}>
          تسجيل الدخول
        </Button>
      </div>
    </header>
  );
}
