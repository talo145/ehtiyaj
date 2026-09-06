/** أنواع مشتركة بين طبقة الخادم والواجهة. */

export type UserRole = "beneficiary" | "association" | "admin";

/** نتيجة موحّدة لكل إجراء خادم: إما نجاح أو خطأ برسالة عربية جاهزة للعرض. */
export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string; field?: string };

export function fail(error: string, field?: string): ActionResult<never> {
  return { ok: false, error, field };
}

export function done(): ActionResult<undefined>;
export function done<T>(data: T): ActionResult<T>;
export function done<T>(data?: T): ActionResult<T | undefined> {
  return { ok: true, data };
}
