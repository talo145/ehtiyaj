"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  demoAssociation,
  emptyProfile,
  seedHistory,
  seedNotifications,
  statusLabels,
} from "@/data/account-demo";
import { needCategoryOptions } from "@/data/need-categories";
import type {
  BeneficiaryNeed,
  BeneficiaryNotification,
  BeneficiaryProfile,
  NeedRecord,
  NeedSubmission,
} from "@/types";

/** حالة حساب المستفيد.
 *
 *  ثلاث قواعد تحكم هذه الحالة، وهي قرارات منتج لا تفاصيل واجهة:
 *  1. لا تسجيل احتياج قبل اكتمال الملف.
 *  2. احتياج واحد قائم في كل مرة.
 *  3. الاحتياج بعد إرساله سجلّ ثابت: يُسحب أو يُغلق، ولا يُعدَّل ولا يُحذف.
 *
 *  تُحفظ الحالة في `sessionStorage` لتبقى بين الصفحات ريثما يوجد خادم. */

const KEY = "ehtiyaj:account";

interface Stored {
  profile: BeneficiaryProfile;
  current: BeneficiaryNeed | null;
  history: NeedRecord[];
  notifications: BeneficiaryNotification[];
}

interface AccountValue extends Stored {
  ready: boolean;
  profileComplete: boolean;
  /** احتياج قائم = لم يُغلق بعد. */
  hasOpenNeed: boolean;
  completeProfile: (data: Partial<BeneficiaryProfile>) => void;
  submitNeed: (data: NeedSubmission) => void;
  withdrawNeed: () => void;
  markNotificationsRead: () => void;
}

const initial: Stored = {
  profile: emptyProfile,
  current: null,
  history: seedHistory,
  notifications: seedNotifications,
};

const AccountContext = createContext<AccountValue | null>(null);

function isComplete(p: BeneficiaryProfile) {
  return Boolean(p.phoneVerified && p.region && p.city && p.birthYear && p.gender);
}

/** تاريخ هجري مختصر للعرض. يُستبدل بتاريخ الخادم عند الربط. */
function nowLabel() {
  return new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function newId() {
  return `ND-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Stored>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) setState(JSON.parse(raw) as Stored);
    } catch {
      // تخزين معطّل أو محتوى تالف — نبدأ من الحالة الأولى
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      // لا شيء يعتمد على الحفظ؛ الجلسة تكمل بلا تخزين
    }
  }, [ready, state]);

  const notify = useCallback(
    (title: string, body: string): BeneficiaryNotification => ({
      id: `nt-${Date.now()}`,
      title,
      body,
      at: "الآن",
      unread: true,
    }),
    [],
  );

  const completeProfile = useCallback(
    (data: Partial<BeneficiaryProfile>) => {
      setState((s) => ({
        ...s,
        profile: { ...s.profile, ...data },
        notifications: [
          notify(
            "اكتملت بياناتك",
            "يمكنك الآن تسجيل احتياجك من لوحة حسابك.",
          ),
          ...s.notifications.map((n) => ({ ...n, unread: false })),
        ],
      }));
    },
    [notify],
  );

  const submitNeed = useCallback(
    (data: NeedSubmission) => {
      setState((s) => {
        if (s.current) return s; // حارس القاعدة الثانية
        const at = nowLabel();
        const need: BeneficiaryNeed = {
          ...data,
          id: newId(),
          status: "review",
          statusLabel: statusLabels.review,
          submittedAt: at,
          events: [
            {
              status: "new",
              title: "أرسلت احتياجك",
              at,
              note: "سجّلت الاحتياج بنفسك من حسابك. لا يمكن تعديله بعد الإرسال.",
            },
            {
              status: "review",
              title: "قيد المراجعة",
              at,
              note: "تُراجَع بياناتك وتُحدَّد أولوية الاحتياج.",
            },
          ],
        };
        return {
          ...s,
          current: need,
          notifications: [
            notify(
              "استلمنا احتياجك",
              `وصل احتياجك إلى المنصة برقم ${need.id}، وهو الآن قيد المراجعة.`,
            ),
            ...s.notifications.map((n) => ({ ...n, unread: false })),
          ],
        };
      });
    },
    [notify],
  );

  const withdrawNeed = useCallback(() => {
    setState((s) => {
      if (!s.current || s.current.status !== "review") return s;
      const c = s.current;
      const record: NeedRecord = {
        id: c.id,
        title: c.subcategory,
        category: needCategoryOptions[c.category]?.name ?? "",
        status: "withdrawn",
        statusLabel: statusLabels.withdrawn,
        closedAt: nowLabel(),
      };
      return {
        ...s,
        current: null,
        history: [record, ...s.history],
        notifications: [
          notify(
            "سُحب احتياجك",
            "أُغلق احتياجك بحالة «مغلق — سحبته». يمكنك تسجيل احتياج جديد.",
          ),
          ...s.notifications.map((n) => ({ ...n, unread: false })),
        ],
      };
    });
  }, [notify]);

  const markNotificationsRead = useCallback(() => {
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) => ({ ...n, unread: false })),
    }));
  }, []);

  const value = useMemo<AccountValue>(
    () => ({
      ...state,
      ready,
      profileComplete: isComplete(state.profile),
      hasOpenNeed: Boolean(state.current),
      completeProfile,
      submitNeed,
      withdrawNeed,
      markNotificationsRead,
    }),
    [
      state,
      ready,
      completeProfile,
      submitNeed,
      withdrawNeed,
      markNotificationsRead,
    ],
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

export { demoAssociation };
