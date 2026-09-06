import "server-only";

import { and, desc, eq, inArray, isNull, or } from "drizzle-orm";
import { db } from "./db";
import {
  associations,
  beneficiaryProfiles,
  needEvents,
  needSubcategories,
  needs,
  notifications,
} from "./db/schema";
import { getSessionUser } from "./auth/session";
import type { AccountSnapshot, NeedView } from "./view-types";

/** الحالات التي تُعدّ «احتياجًا قائمًا» — نفس القائمة التي يفرضها الفهرس الفريد. */
export const OPEN_STATUSES = ["new", "review", "processing"] as const;

/** كل ما تحتاجه واجهة الحساب في نداء واحد. */
export async function getAccountSnapshot(): Promise<AccountSnapshot | null> {
  const user = await getSessionUser();
  if (!user) return null;

  const [profileRow] = await db
    .select()
    .from(beneficiaryProfiles)
    .where(eq(beneficiaryProfiles.userId, user.id))
    .limit(1);

  const rows = await db
    .select({
      need: needs,
      subcategory: needSubcategories.name,
      association: {
        name: associations.name,
        initial: associations.initial,
        place: associations.place,
      },
    })
    .from(needs)
    .leftJoin(needSubcategories, eq(needSubcategories.id, needs.subcategoryId))
    .leftJoin(associations, eq(associations.id, needs.assignedAssociationId))
    .where(eq(needs.beneficiaryId, user.id))
    .orderBy(desc(needs.submittedAt));

  const openRow = rows.find((r) =>
    (OPEN_STATUSES as readonly string[]).includes(r.need.status),
  );

  let current: NeedView | null = null;
  if (openRow) {
    const events = await db
      .select()
      .from(needEvents)
      .where(eq(needEvents.needId, openRow.need.id))
      .orderBy(needEvents.at);

    current = {
      id: openRow.need.id,
      reference: openRow.need.reference,
      categoryId: openRow.need.categoryId,
      subcategory: openRow.subcategory ?? "",
      region: openRow.need.region,
      city: openRow.need.city,
      since: openRow.need.since,
      recurrence: openRow.need.recurrence,
      mobility: openRow.need.mobility,
      urgency: openRow.need.urgency,
      followedByProvider: openRow.need.followedByProvider,
      description: openRow.need.description,
      contactMethod: openRow.need.contactMethod,
      contactTime: openRow.need.contactTime,
      status: openRow.need.status,
      priority: openRow.need.priority,
      submittedAt: openRow.need.submittedAt.toISOString(),
      association: openRow.association?.name
        ? {
            name: openRow.association.name,
            initial: openRow.association.initial,
            city: openRow.association.place,
          }
        : null,
      events: events.map((e) => ({
        status: e.status,
        title: e.title,
        note: e.note,
        at: e.at.toISOString(),
      })),
    };
  }

  const history = rows
    .filter((r) => !(OPEN_STATUSES as readonly string[]).includes(r.need.status))
    .map((r) => ({
      id: r.need.id,
      reference: r.need.reference,
      title: r.subcategory ?? "",
      categoryId: r.need.categoryId,
      status: r.need.status,
      closedAt: (r.need.closedAt ?? r.need.submittedAt).toISOString(),
      association: r.association?.name ?? null,
    }));

  const notes = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, user.id))
    .orderBy(desc(notifications.createdAt))
    .limit(50);

  return {
    user: { id: user.id, name: user.name, email: user.email },
    profile: {
      phone: profileRow?.phone ?? "",
      phoneVerified: profileRow?.phoneVerified ?? false,
      region: profileRow?.region ?? "",
      city: profileRow?.city ?? "",
      birthYear: profileRow?.birthYear ? String(profileRow.birthYear) : "",
      gender: profileRow?.gender ?? "",
      contactMethod: profileRow?.contactMethod ?? "call",
      complete: Boolean(profileRow?.completedAt),
    },
    current,
    history,
    notifications: notes.map((n) => ({
      id: n.id,
      title: n.title,
      body: n.body,
      unread: n.readAt === null,
      at: n.createdAt.toISOString(),
    })),
  };
}

/** الجمعية المسؤولة عن احتياج: داخل نطاق المدينة ومعتمدة على تصنيفه.
 *  تُستخدم في التوجيه، ويُبقى منطقها في مكان واحد. */
export async function findRoutingCandidates(city: string, categoryId: number) {
  const { associationCategories, associationCoverage } = await import(
    "./db/schema"
  );

  return db
    .selectDistinct({ id: associations.id, name: associations.name })
    .from(associations)
    .innerJoin(
      associationCoverage,
      eq(associationCoverage.associationId, associations.id),
    )
    .innerJoin(
      associationCategories,
      eq(associationCategories.associationId, associations.id),
    )
    .where(
      and(
        eq(associations.status, "approved"),
        eq(associationCategories.categoryId, categoryId),
        or(
          eq(associationCoverage.city, city),
          isNull(associationCoverage.city),
        ),
      ),
    );
}

export async function hasOpenNeed(userId: string): Promise<boolean> {
  const rows = await db
    .select({ id: needs.id })
    .from(needs)
    .where(
      and(
        eq(needs.beneficiaryId, userId),
        inArray(needs.status, [...OPEN_STATUSES]),
      ),
    )
    .limit(1);
  return rows.length > 0;
}
