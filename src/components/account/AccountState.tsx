"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useTransition,
} from "react";
import {
  markNotificationsRead as markRead,
  withdrawNeed as withdrawAction,
} from "@/server/actions/needs";
import type { AccountSnapshot } from "@/server/view-types";

/** حالة حساب المستفيد كما يقرأها الخادم.
 *
 *  لا نسخة محلية من الحقيقة: اللقطة تأتي من قاعدة البيانات مع كل طلب،
 *  والإجراءات تُنفَّذ على الخادم ثم يُعاد تحميل اللقطة. القواعد الثلاث
 *  (اكتمال الملف، احتياج واحد قائم، ثبات السجل) مفروضة هناك لا هنا. */

interface AccountValue extends AccountSnapshot {
  pending: boolean;
  profileComplete: boolean;
  hasOpenNeed: boolean;
  unreadCount: number;
  withdrawNeed: () => Promise<string | null>;
  markNotificationsRead: () => void;
  refresh: () => void;
}

const AccountContext = createContext<AccountValue | null>(null);

export function AccountProvider({
  snapshot,
  children,
}: {
  snapshot: AccountSnapshot;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const refresh = useCallback(() => {
    startTransition(() => router.refresh());
  }, [router]);

  const withdrawNeed = useCallback(async () => {
    const res = await withdrawAction();
    refresh();
    return res.ok ? null : res.error;
  }, [refresh]);

  const markNotificationsRead = useCallback(() => {
    startTransition(async () => {
      await markRead();
      router.refresh();
    });
  }, [router]);

  const value = useMemo<AccountValue>(
    () => ({
      ...snapshot,
      pending,
      profileComplete: snapshot.profile.complete,
      hasOpenNeed: snapshot.current !== null,
      unreadCount: snapshot.notifications.filter((n) => n.unread).length,
      withdrawNeed,
      markNotificationsRead,
      refresh,
    }),
    [snapshot, pending, withdrawNeed, markNotificationsRead, refresh],
  );

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

export function useAccount(): AccountValue {
  const v = useContext(AccountContext);
  if (!v) throw new Error("useAccount خارج AccountProvider");
  return v;
}
