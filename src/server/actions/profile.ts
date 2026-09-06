"use server";

import { randomInt } from "node:crypto";
import { revalidatePath } from "next/cache";
import { and, desc, eq, gt, isNull } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db";
import { beneficiaryProfiles, phoneVerifications, places } from "../db/schema";
import { hashPassword, verifyPassword } from "../auth/password";
import { getSessionUser } from "../auth/session";
import { fail, done, type ActionResult } from "../types";

const phoneSchema = z
  .string()
  .trim()
  .regex(/^05\d{8}$/, "الرقم يبدأ بـ 05 ويتكوّن من عشرة أرقام.");

const CODE_TTL_MS = 10 * 60_000;
const MAX_ATTEMPTS = 5;

/** يُرسل رمز تحقق إلى الجوال.
 *
 *  لا مزوّد رسائل بعد: في التطوير يُعاد الرمز في النتيجة ليمكن اختبار المسار.
 *  عند الربط بمزوّد يُستبدل هذا الجزء وحده، والباقي كما هو. */
export async function requestPhoneCode(
  phone: string,
): Promise<ActionResult<{ devCode?: string }>> {
  const user = await getSessionUser();
  if (!user) return fail("انتهت الجلسة. سجّل الدخول من جديد.");

  const parsed = phoneSchema.safeParse(phone);
  if (!parsed.success) return fail(parsed.error.issues[0].message, "phone");

  const code = String(randomInt(1000, 10000));
  const codeHash = await hashPassword(code);

  await db.insert(phoneVerifications).values({
    userId: user.id,
    phone: parsed.data,
    codeHash,
    expiresAt: new Date(Date.now() + CODE_TTL_MS),
  });

  return done(
    process.env.NODE_ENV === "production" ? {} : { devCode: code },
  );
}

export async function verifyPhoneCode(
  phone: string,
  code: string,
): Promise<ActionResult<undefined>> {
  const user = await getSessionUser();
  if (!user) return fail("انتهت الجلسة. سجّل الدخول من جديد.");

  const [row] = await db
    .select()
    .from(phoneVerifications)
    .where(
      and(
        eq(phoneVerifications.userId, user.id),
        eq(phoneVerifications.phone, phone.trim()),
        isNull(phoneVerifications.consumedAt),
        gt(phoneVerifications.expiresAt, new Date()),
      ),
    )
    .orderBy(desc(phoneVerifications.createdAt))
    .limit(1);

  if (!row) return fail("انتهت صلاحية الرمز. اطلب رمزًا جديدًا.", "code");
  if (row.attempts >= MAX_ATTEMPTS) {
    return fail("تجاوزت عدد المحاولات. اطلب رمزًا جديدًا.", "code");
  }

  if (!(await verifyPassword(code.trim(), row.codeHash))) {
    await db
      .update(phoneVerifications)
      .set({ attempts: row.attempts + 1 })
      .where(eq(phoneVerifications.id, row.id));
    return fail("الرمز غير صحيح.", "code");
  }

  await db.transaction(async (tx) => {
    await tx
      .update(phoneVerifications)
      .set({ consumedAt: new Date() })
      .where(eq(phoneVerifications.id, row.id));

    await tx
      .update(beneficiaryProfiles)
      .set({ phone: row.phone, phoneVerified: true, updatedAt: new Date() })
      .where(eq(beneficiaryProfiles.userId, user.id));
  });

  revalidatePath("/account", "layout");
  return done();
}

const profileSchema = z.object({
  region: z.string().trim().min(1, "اختر المنطقة."),
  city: z.string().trim().min(1, "اختر المدينة أو القرية."),
  birthYear: z
    .string()
    .regex(/^\d{4}$/, "اختر سنة الميلاد.")
    .transform(Number)
    .refine((n) => n >= 1300 && n <= 1460, "سنة الميلاد خارج المدى."),
  gender: z.enum(["male", "female"]),
  contactMethod: z.enum(["call", "sms", "whatsapp"]),
});

/** البوابة الأولى: لا يكتمل الملف بلا جوال محقَّق ومدينة وسنة ميلاد وجنس. */
export async function saveProfile(
  input: z.input<typeof profileSchema>,
): Promise<ActionResult<undefined>> {
  const user = await getSessionUser();
  if (!user) return fail("انتهت الجلسة. سجّل الدخول من جديد.");

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return fail(issue.message, String(issue.path[0] ?? ""));
  }

  const [profile] = await db
    .select()
    .from(beneficiaryProfiles)
    .where(eq(beneficiaryProfiles.userId, user.id))
    .limit(1);

  if (!profile?.phoneVerified) {
    return fail("تحقّق من رقم جوالك أولًا.", "phone");
  }

  const data = parsed.data;

  const [place] = await db
    .select({ id: places.id })
    .from(places)
    .where(and(eq(places.name, data.city), eq(places.region, data.region)))
    .limit(1);

  await db
    .update(beneficiaryProfiles)
    .set({
      region: data.region,
      city: data.city,
      placeId: place?.id ?? null,
      birthYear: data.birthYear,
      gender: data.gender,
      contactMethod: data.contactMethod,
      completedAt: profile.completedAt ?? new Date(),
      updatedAt: new Date(),
    })
    .where(eq(beneficiaryProfiles.userId, user.id));

  revalidatePath("/account", "layout");
  return done();
}
