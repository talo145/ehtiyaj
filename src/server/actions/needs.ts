"use server";

import { randomInt } from "node:crypto";
import { revalidatePath } from "next/cache";
import { and, eq, isNull, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db";
import {
  auditLog,
  beneficiaryProfiles,
  needEvents,
  needSubcategories,
  needs,
  notifications,
  places,
} from "../db/schema";
import { getSessionUser } from "../auth/session";
import { fail, done, type ActionResult } from "../types";

const submitSchema = z.object({
  categoryId: z.number().int().min(0).max(5),
  subcategory: z.string().trim().min(1, "اختر نوع الاحتياج."),
  region: z.string().trim().min(1),
  city: z.string().trim().min(1, "اختر المدينة أو القرية."),
  since: z.enum(["under_month", "one_to_three", "over_three", "years"]),
  recurrence: z.enum(["once", "recurring"]),
  mobility: z.enum(["yes", "hard", "no"]),
  urgency: z.enum(["days", "weeks", "none"]),
  followedByProvider: z.enum(["yes", "no"]),
  description: z
    .string()
    .trim()
    .min(20, "اكتب 20 حرفًا على الأقل في وصف احتياجك."),
  contactMethod: z.enum(["call", "sms", "whatsapp"]),
  contactTime: z.enum(["morning", "noon", "evening", "any"]),
  acknowledged: z.literal(true, {
    message: "أقرّ بصحة البيانات قبل الإرسال.",
  }),
});

/** رقم الاحتياج الظاهر. الوحدانية مضمونة بقيد على العمود، والمحاولة تُعاد عند التصادم. */
function newReference() {
  return `ND-${randomInt(1000, 10000)}`;
}

export async function submitNeed(
  input: z.input<typeof submitSchema>,
): Promise<ActionResult<{ reference: string }>> {
  const user = await getSessionUser();
  if (!user) return fail("انتهت الجلسة. سجّل الدخول من جديد.");

  const parsed = submitSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return fail(issue.message, String(issue.path[0] ?? ""));
  }
  const data = parsed.data;

  const [profile] = await db
    .select()
    .from(beneficiaryProfiles)
    .where(eq(beneficiaryProfiles.userId, user.id))
    .limit(1);

  if (!profile?.completedAt) {
    return fail("أكمل بياناتك قبل تسجيل احتياج.");
  }

  const [sub] = await db
    .select({ id: needSubcategories.id })
    .from(needSubcategories)
    .where(
      and(
        eq(needSubcategories.categoryId, data.categoryId),
        eq(needSubcategories.name, data.subcategory),
      ),
    )
    .limit(1);

  const [place] = await db
    .select({ id: places.id })
    .from(places)
    .where(and(eq(places.name, data.city), eq(places.region, data.region)))
    .limit(1);

  try {
    const reference = await db.transaction(async (tx) => {
      const ref = newReference();
      const [need] = await tx
        .insert(needs)
        .values({
          reference: ref,
          beneficiaryId: user.id,
          categoryId: data.categoryId,
          subcategoryId: sub?.id ?? null,
          region: data.region,
          city: data.city,
          placeId: place?.id ?? null,
          since: data.since,
          recurrence: data.recurrence,
          mobility: data.mobility,
          urgency: data.urgency,
          followedByProvider: data.followedByProvider === "yes",
          description: data.description,
          contactMethod: data.contactMethod,
          contactTime: data.contactTime,
          status: "review",
        })
        .returning({ id: needs.id, reference: needs.reference });

      await tx.insert(needEvents).values([
        {
          needId: need.id,
          status: "new",
          title: "أرسلت احتياجك",
          note: "سجّلت الاحتياج بنفسك من حسابك. لا يمكن تعديله بعد الإرسال.",
          actorId: user.id,
        },
        {
          needId: need.id,
          status: "review",
          title: "قيد المراجعة",
          note: "تُراجَع بياناتك وتُحدَّد أولوية الاحتياج.",
        },
      ]);

      await tx.insert(notifications).values({
        userId: user.id,
        needId: need.id,
        title: "استلمنا احتياجك",
        body: `وصل احتياجك إلى المنصة برقم ${need.reference}، وهو الآن قيد المراجعة.`,
      });

      await tx.insert(auditLog).values({
        actorId: user.id,
        action: "need.submit",
        entity: "need",
        entityId: need.id,
        meta: { city: data.city, categoryId: data.categoryId },
      });

      return need.reference;
    });

    revalidatePath("/account", "layout");
    return done({ reference });
  } catch (error) {
    // الفهرس الفريد الجزئي يمنع احتياجًا ثانيًا قائمًا حتى لو التُف على الواجهة.
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code?: string }).code === "23505"
    ) {
      return fail(
        "لديك احتياج قائم. يُسمح باحتياج واحد في كل مرة، ويفتح لك التسجيل بعد إغلاقه.",
      );
    }
    throw error;
  }
}

/** السحب متاح ما لم تبدأ جهة بالمعالجة. السجل يبقى ولا يُحذف. */
export async function withdrawNeed(): Promise<ActionResult<undefined>> {
  const user = await getSessionUser();
  if (!user) return fail("انتهت الجلسة. سجّل الدخول من جديد.");

  const updated = await db.transaction(async (tx) => {
    const [need] = await tx
      .update(needs)
      .set({ status: "withdrawn", closedAt: new Date() })
      .where(
        and(
          eq(needs.beneficiaryId, user.id),
          eq(needs.status, "review"),
          isNull(needs.assignedAssociationId),
        ),
      )
      .returning({ id: needs.id, reference: needs.reference });

    if (!need) return null;

    await tx.insert(needEvents).values({
      needId: need.id,
      status: "withdrawn",
      title: "سحبت احتياجك",
      note: "أُغلق الاحتياج بطلبك، وبقي في سجلّك.",
      actorId: user.id,
    });

    await tx.insert(notifications).values({
      userId: user.id,
      needId: need.id,
      title: "سُحب احتياجك",
      body: "أُغلق احتياجك بحالة «مغلق — سحبته». يمكنك تسجيل احتياج جديد.",
    });

    await tx.insert(auditLog).values({
      actorId: user.id,
      action: "need.withdraw",
      entity: "need",
      entityId: need.id,
    });

    return need;
  });

  if (!updated) {
    return fail("لم يعد السحب متاحًا — بدأت الجمعية العمل على احتياجك.");
  }

  revalidatePath("/account", "layout");
  return done();
}

export async function markNotificationsRead(): Promise<ActionResult<undefined>> {
  const user = await getSessionUser();
  if (!user) return fail("انتهت الجلسة. سجّل الدخول من جديد.");

  await db
    .update(notifications)
    .set({ readAt: sql`now()` })
    .where(
      and(eq(notifications.userId, user.id), isNull(notifications.readAt)),
    );

  revalidatePath("/account", "layout");
  return done();
}
