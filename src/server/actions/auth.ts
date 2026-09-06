"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db";
import {
  beneficiaryProfiles,
  consents,
  legalDocuments,
  notifications,
  users,
} from "../db/schema";
import { hashPassword, verifyPassword } from "../auth/password";
import {
  createSession,
  destroySession,
  pruneExpiredSessions,
} from "../auth/session";
import { fail, done, type ActionResult } from "../types";

const email = z
  .string()
  .trim()
  .min(1, "اكتب بريدك الإلكتروني.")
  .email("صيغة البريد غير صحيحة.");

/** ثمانية أحرف على الأقل مع رقم وحرف — عربي أو لاتيني. نفس شرط الواجهة. */
const password = z
  .string()
  .min(8, "كلمة المرور ثمانية أحرف على الأقل.")
  .refine((v) => /[0-9]/.test(v), "كلمة المرور يجب أن تتضمّن رقمًا.")
  .refine(
    (v) => /[a-zA-Z؀-ۿ]/.test(v),
    "كلمة المرور يجب أن تتضمّن حرفًا.",
  );

const registerSchema = z.object({
  name: z.string().trim().min(2, "اكتب اسمك الكامل."),
  email,
  password,
  confirm: z.string(),
  documents: z.array(z.string()).min(1, "يجب الموافقة على المستندات."),
});

async function requestMeta() {
  const h = await headers();
  return {
    userAgent: h.get("user-agent"),
    ip:
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      h.get("x-real-ip") ??
      null,
  };
}

export async function registerBeneficiary(
  input: z.input<typeof registerSchema>,
): Promise<ActionResult<undefined>> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return fail(issue.message, String(issue.path[0] ?? ""));
  }

  const data = parsed.data;
  if (data.password !== data.confirm) {
    return fail("كلمتا المرور غير متطابقتين.", "confirm");
  }

  const meta = await requestMeta();
  const normalized = data.email.toLowerCase();

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, normalized))
    .limit(1);

  if (existing.length) {
    return fail("هذا البريد مسجَّل بالفعل. سجّل الدخول بدلًا من ذلك.", "email");
  }

  const passwordHash = await hashPassword(data.password);

  const userId = await db.transaction(async (tx) => {
    const [user] = await tx
      .insert(users)
      .values({
        email: normalized,
        name: data.name,
        passwordHash,
        role: "beneficiary",
      })
      .returning({ id: users.id });

    // الملف يُنشأ فارغًا: الحساب مفعّل، والبيانات ناقصة حتى يكملها المستفيد.
    await tx.insert(beneficiaryProfiles).values({ userId: user.id });

    // تُسجَّل الموافقة بنسختها ووقتها — مطلب امتثال.
    const docs = await tx.select().from(legalDocuments);
    const accepted = docs.filter((d) => data.documents.includes(d.docKey));
    if (accepted.length) {
      await tx.insert(consents).values(
        accepted.map((d) => ({
          userId: user.id,
          documentId: d.id,
          ip: meta.ip,
          userAgent: meta.userAgent,
        })),
      );
    }

    await tx.insert(notifications).values({
      userId: user.id,
      title: "أهلًا بك في احتياج",
      body: "أكمل بياناتك لتتمكّن من تسجيل احتياجك.",
    });

    return user.id;
  });

  await createSession(userId, meta);
  redirect("/account");
}

const loginSchema = z.object({
  email,
  password: z.string().min(1, "اكتب كلمة المرور."),
});

export async function login(
  input: z.input<typeof loginSchema>,
): Promise<ActionResult<undefined>> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  const { email: mail, password: pass } = parsed.data;

  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.email, mail.toLowerCase()), eq(users.role, "beneficiary")))
    .limit(1);

  // رسالة واحدة للحالتين: لا نكشف أي بريد مسجَّل.
  const generic = "البريد أو كلمة المرور غير صحيحة.";
  if (!user) {
    // نُجزّئ على أي حال كي لا يفرّق زمن الردّ بين بريد موجود وغير موجود.
    await hashPassword(pass);
    return fail(generic);
  }

  if (!(await verifyPassword(pass, user.passwordHash))) return fail(generic);
  if (user.status !== "active") {
    return fail("هذا الحساب موقوف. تواصل مع إدارة المنصة.");
  }

  await pruneExpiredSessions();
  await createSession(user.id, await requestMeta());
  redirect("/account");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/login");
}

export { done };
