import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/** عميل قاعدة البيانات.
 *
 *  الاتصال كسول: يُفتح عند أول استعلام لا عند استيراد الملف، حتى لا يفشل
 *  البناء على جهاز بلا قاعدة بيانات. ويُعاد استخدامه بين إعادات التحميل في
 *  التطوير حتى لا تتراكم البِرَك.
 *
 *  لا ارتباط بمزوّد: أي Postgres قياسي — محلي أو مستضاف داخل المملكة — يعمل
 *  بتغيير DATABASE_URL وحده. */

type Database = ReturnType<typeof create>;

declare global {
  // eslint-disable-next-line no-var
  var __ehtiyajDb: Database | undefined;
}

function create() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL غير مضبوط. شغّل scripts/db-setup.ps1 مرة واحدة لإنشاء قاعدة البيانات.",
    );
  }

  const client = postgres(url, {
    max: process.env.NODE_ENV === "production" ? 10 : 4,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  return drizzle(client, { schema, casing: "snake_case" });
}

function instance(): Database {
  if (!globalThis.__ehtiyajDb) globalThis.__ehtiyajDb = create();
  return globalThis.__ehtiyajDb;
}

export const db = new Proxy({} as Database, {
  get(_target, property, receiver) {
    const real = instance() as unknown as Record<string | symbol, unknown>;
    const value = Reflect.get(real, property, receiver);
    return typeof value === "function" ? value.bind(real) : value;
  },
});

export { schema };
