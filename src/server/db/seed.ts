/** يملأ المرجعيات وبيانات العرض من الملفات الثابتة نفسها التي يستعملها الموقع،
 *  فلا يتفرّق مصدر التصنيفات والمواقع والجمعيات بين الواجهة وقاعدة البيانات.
 *
 *      npm run db:seed
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";
import * as schema from "./schema";
import mapData from "../../data/map-data.json" with { type: "json" };
import { associations as staticAssociations } from "../../data/associations";
import { initiatives as staticInitiatives } from "../../data/initiatives";
import { needCategoryOptions } from "../../data/need-categories";
import { beneficiaryDocuments } from "../../data/legal";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL غير مضبوط.");

const client = postgres(url, { max: 1 });
const db = drizzle(client, { schema, casing: "snake_case" });

type MapShape = {
  cats: string[];
  places: { n: string; k: string; g: string; lat: number; lon: number }[];
};
const map = mapData as unknown as MapShape;

const KIND: Record<string, "city" | "town" | "suburb" | "village" | "hamlet"> = {
  city: "city",
  town: "town",
  suburb: "suburb",
  village: "village",
  hamlet: "hamlet",
};

const REGION = "الحدود الشمالية";

async function main() {
  console.log("← بدء التعبئة");

  await db.transaction(async (tx) => {
    /* ---------- التصنيفات ---------- */
    await tx
      .insert(schema.needCategories)
      .values(map.cats.map((name, id) => ({ id, name })))
      .onConflictDoNothing();

    const subs = needCategoryOptions.flatMap((c) =>
      c.subcategories.map((name) => ({ categoryId: c.index, name })),
    );
    await tx.insert(schema.needSubcategories).values(subs).onConflictDoNothing();
    console.log(`  التصنيفات: ${map.cats.length} رئيسي، ${subs.length} فرعي`);

    /* ---------- المواقع ---------- */
    const seen = new Set<string>();
    const rows = [];
    for (const p of map.places) {
      const key = `${p.n}|${p.g}`;
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push({
        name: p.n,
        kind: KIND[p.k] ?? "village",
        governorate: p.g,
        region: REGION,
        lat: String(p.lat),
        lon: String(p.lon),
      });
    }
    await tx.insert(schema.places).values(rows).onConflictDoNothing();
    console.log(`  المواقع: ${rows.length}`);

    /* ---------- الجمعيات ---------- */
    const assocRows = staticAssociations.map((a) => ({
      slug: a.id,
      name: a.name,
      initial: a.initial,
      place: a.place,
      governorate: a.governorate,
      scope: a.scope,
      status: "approved" as const,
      approvedAt: new Date(),
    }));
    const inserted = await tx
      .insert(schema.associations)
      .values(assocRows)
      .onConflictDoNothing()
      .returning({ id: schema.associations.id, slug: schema.associations.slug });

    const bySlug = new Map(inserted.map((r) => [r.slug, r.id]));
    if (bySlug.size === 0) {
      const all = await tx
        .select({ id: schema.associations.id, slug: schema.associations.slug })
        .from(schema.associations);
      for (const r of all) bySlug.set(r.slug, r.id);
    }
    console.log(`  الجمعيات: ${bySlug.size}`);

    /* ---------- نطاق كل جمعية ---------- */
    const cats = staticAssociations.flatMap((a) => {
      const id = bySlug.get(a.id);
      return id ? a.categories.map((categoryId) => ({ associationId: id, categoryId })) : [];
    });
    await tx
      .insert(schema.associationCategories)
      .values(cats)
      .onConflictDoNothing();

    const coverage = staticAssociations.flatMap((a) => {
      const id = bySlug.get(a.id);
      return id
        ? [{ associationId: id, governorate: a.governorate, city: null }]
        : [];
    });
    await tx.insert(schema.associationCoverage).values(coverage);
    console.log(`  نطاقات التغطية: ${coverage.length}`);

    /* ---------- المبادرات ---------- */
    const initRows = staticInitiatives.flatMap((i) => {
      const associationId = bySlug.get(i.associationId);
      return associationId
        ? [
            {
              slug: i.id,
              title: i.title,
              associationId,
              city: i.city,
              categoryId: i.category,
              status: i.status,
              statusLabel: i.statusLabel,
              startedAt: i.startedAt,
              progress: i.progress,
              beneficiaries: i.beneficiaries,
              target: i.target,
              places: i.places,
            },
          ]
        : [];
    });
    await tx.insert(schema.initiatives).values(initRows).onConflictDoNothing();
    console.log(`  المبادرات: ${initRows.length}`);

    /* ---------- المستندات القانونية ---------- */
    const docs = beneficiaryDocuments.map((d) => ({
      docKey: d.id,
      title: d.title,
      version: d.meta,
    }));
    await tx.insert(schema.legalDocuments).values(docs).onConflictDoNothing();
    console.log(`  المستندات: ${docs.length}`);
  });

  const counts = await db.execute<{ table: string; n: number }>(sql`
    select 'users' as table, count(*)::int as n from users
    union all select 'places', count(*)::int from places
    union all select 'associations', count(*)::int from associations
    union all select 'need_categories', count(*)::int from need_categories
    union all select 'need_subcategories', count(*)::int from need_subcategories
    union all select 'initiatives', count(*)::int from initiatives
    union all select 'legal_documents', count(*)::int from legal_documents
    union all select 'needs', count(*)::int from needs
  `);

  console.log("\n  الجداول بعد التعبئة:");
  for (const r of counts) console.log(`   ${r.table}: ${r.n}`);
  console.log("\n✓ تمت التعبئة");
}

main()
  .catch((e) => {
    console.error("✗ فشلت التعبئة:", e);
    process.exitCode = 1;
  })
  .finally(() => client.end());
