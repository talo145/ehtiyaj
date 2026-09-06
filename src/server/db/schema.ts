/** سكيمة منصة احتياج.
 *
 *  المبادئ التي تحكم هذا الملف — وهي قرارات منتج لا تفاصيل تقنية:
 *  1. الاحتياج سجلّ ثابت: يُنشأ ولا يُعدَّل. كل تغيّر حالة حدث مستقل في `needEvents`.
 *  2. احتياج واحد قائم لكل مستفيد — مفروض بفهرس فريد جزئي، لا بشرط في الواجهة.
 *  3. حذف حساب المستفيد يجرّد احتياجاته من الهوية ولا يحذفها، حفاظًا على الإحصاءات.
 *  4. الجهة لا ترى إلا ما يقع داخل نطاق تغطيتها المعتمَد (`associationCoverage`).
 */

import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/* ================= التعدادات ================= */

export const userRole = pgEnum("user_role", [
  "beneficiary",
  "association",
  "admin",
]);

export const accountStatus = pgEnum("account_status", [
  "active",
  "suspended",
  "deleted",
]);

export const genderEnum = pgEnum("gender", ["male", "female"]);

export const contactMethod = pgEnum("contact_method", [
  "call",
  "sms",
  "whatsapp",
]);

export const needStatus = pgEnum("need_status", [
  "new",
  "review",
  "processing",
  "responded",
  "withdrawn",
  "closed",
]);

export const priority = pgEnum("priority", ["high", "medium", "low"]);

export const urgencyEnum = pgEnum("urgency", ["days", "weeks", "none"]);

export const sinceEnum = pgEnum("need_since", [
  "under_month",
  "one_to_three",
  "over_three",
  "years",
]);

export const recurrenceEnum = pgEnum("need_recurrence", ["once", "recurring"]);

export const mobilityEnum = pgEnum("mobility", ["yes", "hard", "no"]);

export const associationStatus = pgEnum("association_status", [
  "pending",
  "approved",
  "suspended",
]);

export const initiativeStatus = pgEnum("initiative_status", [
  "active",
  "completed",
  "upcoming",
]);

export const placeKind = pgEnum("place_kind", [
  "city",
  "town",
  "suburb",
  "village",
  "hamlet",
]);

/* ================= المستخدمون والجلسات ================= */

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRole("role").notNull().default("beneficiary"),
    name: text("name").notNull(),
    status: accountStatus("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    // البريد فريد بغضّ النظر عن حالة الأحرف
    uniqueIndex("users_email_key").on(sql`lower(${t.email})`),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    /** تجزئة معرّف الجلسة، لا المعرّف نفسه: تسريب الجدول لا يمنح دخولًا. */
    id: text("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    userAgent: text("user_agent"),
    ip: varchar("ip", { length: 64 }),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

/* ================= ملف المستفيد ================= */

export const beneficiaryProfiles = pgTable("beneficiary_profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  phone: varchar("phone", { length: 16 }),
  phoneVerified: boolean("phone_verified").notNull().default(false),
  region: text("region"),
  city: text("city"),
  placeId: integer("place_id").references(() => places.id),
  birthYear: smallint("birth_year"),
  gender: genderEnum("gender"),
  contactMethod: contactMethod("contact_method").notNull().default("call"),
  /** يُختم عند اكتمال البيانات المطلوبة — البوابة الأولى قبل تسجيل أي احتياج. */
  completedAt: timestamp("completed_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const phoneVerifications = pgTable(
  "phone_verifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    phone: varchar("phone", { length: 16 }).notNull(),
    /** الرمز مجزّأ كما تُجزَّأ كلمة المرور. */
    codeHash: text("code_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    attempts: smallint("attempts").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("phone_verifications_user_idx").on(t.userId)],
);

/* ================= المرجعيات الجغرافية ================= */

export const places = pgTable(
  "places",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: text("name").notNull(),
    kind: placeKind("kind").notNull(),
    governorate: text("governorate").notNull(),
    region: text("region").notNull(),
    lat: text("lat"),
    lon: text("lon"),
  },
  (t) => [
    uniqueIndex("places_name_gov_key").on(t.name, t.governorate),
    index("places_governorate_idx").on(t.governorate),
  ],
);

/* ================= تصنيفات الاحتياج ================= */

export const needCategories = pgTable("need_categories", {
  id: smallint("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const needSubcategories = pgTable(
  "need_subcategories",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    categoryId: smallint("category_id")
      .notNull()
      .references(() => needCategories.id),
    name: text("name").notNull(),
  },
  (t) => [uniqueIndex("need_subcategories_key").on(t.categoryId, t.name)],
);

/* ================= الجمعيات ================= */

export const associations = pgTable("associations", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** المعرّف المستخدم في روابط الموقع العام — a01 وما بعده. */
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  initial: varchar("initial", { length: 4 }).notNull(),
  place: text("place").notNull(),
  governorate: text("governorate").notNull(),
  scope: text("scope").notNull(),
  status: associationStatus("status").notNull().default("pending"),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** مسؤولو حساب الجهة. الحساب لا يُفعَّل إلا بعد الاعتماد. */
export const associationMembers = pgTable(
  "association_members",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    associationId: uuid("association_id")
      .notNull()
      .references(() => associations.id, { onDelete: "cascade" }),
    isOwner: boolean("is_owner").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.associationId] })],
);

/** التصنيفات المعتمَدة للجهة — حدّ ما تراه من احتياجات. */
export const associationCategories = pgTable(
  "association_categories",
  {
    associationId: uuid("association_id")
      .notNull()
      .references(() => associations.id, { onDelete: "cascade" }),
    categoryId: smallint("category_id")
      .notNull()
      .references(() => needCategories.id),
  },
  (t) => [primaryKey({ columns: [t.associationId, t.categoryId] })],
);

/** نطاق التغطية الجغرافي. `city` فارغة تعني المحافظة كلها. */
export const associationCoverage = pgTable(
  "association_coverage",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    associationId: uuid("association_id")
      .notNull()
      .references(() => associations.id, { onDelete: "cascade" }),
    governorate: text("governorate").notNull(),
    city: text("city"),
  },
  (t) => [index("association_coverage_idx").on(t.governorate, t.city)],
);

/* ================= الاحتياجات ================= */

export const needs = pgTable(
  "needs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** المعرّف الظاهر للمستفيد: ND-4417. */
    reference: text("reference").notNull().unique(),
    /** يصير NULL عند حذف الحساب — السجل يبقى مجهول الهوية. */
    beneficiaryId: uuid("beneficiary_id").references(() => users.id, {
      onDelete: "set null",
    }),
    anonymizedAt: timestamp("anonymized_at", { withTimezone: true }),

    categoryId: smallint("category_id")
      .notNull()
      .references(() => needCategories.id),
    subcategoryId: integer("subcategory_id").references(
      () => needSubcategories.id,
    ),
    /** نصّ الموقع محفوظ إلى جانب المرجع كي يبقى السجل مقروءًا لو تغيّرت المرجعيات. */
    region: text("region").notNull(),
    city: text("city").notNull(),
    placeId: integer("place_id").references(() => places.id),

    since: sinceEnum("since").notNull(),
    recurrence: recurrenceEnum("recurrence").notNull(),
    mobility: mobilityEnum("mobility").notNull(),
    urgency: urgencyEnum("urgency").notNull(),
    followedByProvider: boolean("followed_by_provider").notNull(),
    description: text("description").notNull(),
    contactMethod: contactMethod("contact_method").notNull(),
    contactTime: text("contact_time").notNull(),

    status: needStatus("status").notNull().default("review"),
    /** تُحدَّد بعد المراجعة، ولا يختارها المستفيد. */
    priority: priority("priority"),
    assignedAssociationId: uuid("assigned_association_id").references(
      () => associations.id,
    ),

    submittedAt: timestamp("submitted_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    closedAt: timestamp("closed_at", { withTimezone: true }),
  },
  (t) => [
    /** القاعدة الأهم: احتياج واحد قائم لكل مستفيد، مفروضة في قاعدة البيانات. */
    uniqueIndex("needs_one_open_per_beneficiary")
      .on(t.beneficiaryId)
      .where(sql`${t.status} in ('new', 'review', 'processing')`),
    index("needs_beneficiary_idx").on(t.beneficiaryId),
    index("needs_routing_idx").on(t.status, t.city, t.categoryId),
  ],
);

/** كل تغيّر حالة حدث مستقل — لا تُعدَّل صفوف الاحتياج تاريخيًا. */
export const needEvents = pgTable(
  "need_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    needId: uuid("need_id")
      .notNull()
      .references(() => needs.id, { onDelete: "cascade" }),
    status: needStatus("status").notNull(),
    title: text("title").notNull(),
    note: text("note"),
    /** من نفّذ التغيير: المستفيد، أو جهة، أو الإدارة. NULL يعني النظام. */
    actorId: uuid("actor_id").references(() => users.id, {
      onDelete: "set null",
    }),
    at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("need_events_need_idx").on(t.needId, t.at)],
);

/* ================= الإشعارات ================= */

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    body: text("body").notNull(),
    needId: uuid("need_id").references(() => needs.id, { onDelete: "cascade" }),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("notifications_user_idx").on(t.userId, t.createdAt)],
);

/* ================= المستندات والموافقات ================= */

export const legalDocuments = pgTable(
  "legal_documents",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    docKey: text("doc_key").notNull(),
    title: text("title").notNull(),
    version: text("version").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("legal_documents_key").on(t.docKey, t.version)],
);

/** الموافقة تُسجَّل بنسختها ووقتها — مطلب امتثال لا تفصيل واجهة. */
export const consents = pgTable(
  "consents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    documentId: integer("document_id")
      .notNull()
      .references(() => legalDocuments.id),
    acceptedAt: timestamp("accepted_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    ip: varchar("ip", { length: 64 }),
    userAgent: text("user_agent"),
  },
  (t) => [index("consents_user_idx").on(t.userId)],
);

/* ================= المبادرات ================= */

export const initiatives = pgTable("initiatives", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  associationId: uuid("association_id")
    .notNull()
    .references(() => associations.id, { onDelete: "cascade" }),
  city: text("city").notNull(),
  categoryId: smallint("category_id")
    .notNull()
    .references(() => needCategories.id),
  status: initiativeStatus("status").notNull(),
  statusLabel: text("status_label").notNull(),
  startedAt: text("started_at").notNull(),
  progress: smallint("progress").notNull().default(0),
  beneficiaries: integer("beneficiaries").notNull().default(0),
  target: integer("target").notNull().default(0),
  places: smallint("places").notNull().default(0),
});

/* ================= سجل التدقيق ================= */

/** كل اطّلاع على بيانات مستفيد يُسجَّل — التزام في اتفاقية استخدام البيانات. */
export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorId: uuid("actor_id").references(() => users.id, {
      onDelete: "set null",
    }),
    action: text("action").notNull(),
    entity: text("entity").notNull(),
    entityId: text("entity_id"),
    meta: jsonb("meta"),
    at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("audit_log_entity_idx").on(t.entity, t.entityId, t.at)],
);

/* ================= العلاقات ================= */

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(beneficiaryProfiles, {
    fields: [users.id],
    references: [beneficiaryProfiles.userId],
  }),
  needs: many(needs),
  notifications: many(notifications),
  consents: many(consents),
  memberships: many(associationMembers),
}));

export const needsRelations = relations(needs, ({ one, many }) => ({
  beneficiary: one(users, {
    fields: [needs.beneficiaryId],
    references: [users.id],
  }),
  category: one(needCategories, {
    fields: [needs.categoryId],
    references: [needCategories.id],
  }),
  subcategory: one(needSubcategories, {
    fields: [needs.subcategoryId],
    references: [needSubcategories.id],
  }),
  association: one(associations, {
    fields: [needs.assignedAssociationId],
    references: [associations.id],
  }),
  events: many(needEvents),
}));

export const needEventsRelations = relations(needEvents, ({ one }) => ({
  need: one(needs, { fields: [needEvents.needId], references: [needs.id] }),
}));

export const associationsRelations = relations(associations, ({ many }) => ({
  members: many(associationMembers),
  categories: many(associationCategories),
  coverage: many(associationCoverage),
  initiatives: many(initiatives),
}));
