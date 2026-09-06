import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { cache } from "react";
import { and, eq, gt, lt } from "drizzle-orm";
import { db } from "../db";
import { sessions, users } from "../db/schema";
import type { UserRole } from "../types";

const COOKIE = "ehtiyaj_session";
const TTL_DAYS = 30;

/** يُخزَّن في قاعدة البيانات تجزئة المعرّف لا المعرّف نفسه:
 *  من يقرأ الجدول لا يستطيع انتحال جلسة. */
function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export async function createSession(
  userId: string,
  meta?: { userAgent?: string | null; ip?: string | null },
): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + TTL_DAYS * 86_400_000);

  await db.insert(sessions).values({
    id: hashToken(token),
    userId,
    expiresAt,
    userAgent: meta?.userAgent ?? null,
    ip: meta?.ip ?? null,
  });

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

/** يُقرأ مرة واحدة لكل طلب مهما تعدّد المستدعون. */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;

  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      status: users.status,
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.id, hashToken(token)), gt(sessions.expiresAt, new Date())))
    .limit(1);

  const row = rows[0];
  if (!row || row.status !== "active") return null;

  return { id: row.id, email: row.email, name: row.name, role: row.role };
});

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.id, hashToken(token)));
  }
  store.delete(COOKIE);
}

/** تنظيف الجلسات المنتهية — يُستدعى عند تسجيل الدخول، فلا يحتاج مهمّة مجدولة. */
export async function pruneExpiredSessions(): Promise<void> {
  await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
}

export { COOKIE as SESSION_COOKIE };
