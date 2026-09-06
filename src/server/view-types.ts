/** الأشكال التي تعبر من الخادم إلى الواجهة.
 *  التواريخ نصوص ISO كي تمرّ عبر حدود المكوّنات دون تسلسل خاص. */

export type NeedStatusValue =
  | "new"
  | "review"
  | "processing"
  | "responded"
  | "withdrawn"
  | "closed";

export interface NeedEventView {
  status: NeedStatusValue;
  title: string;
  note: string | null;
  at: string;
}

export interface NeedView {
  id: string;
  reference: string;
  categoryId: number;
  subcategory: string;
  region: string;
  city: string;
  since: string;
  recurrence: string;
  mobility: string;
  urgency: string;
  followedByProvider: boolean;
  description: string;
  contactMethod: string;
  contactTime: string;
  status: NeedStatusValue;
  priority: "high" | "medium" | "low" | null;
  submittedAt: string;
  association: { name: string; initial: string; city: string } | null;
  events: NeedEventView[];
}

export interface HistoryItemView {
  id: string;
  reference: string;
  title: string;
  categoryId: number;
  status: NeedStatusValue;
  closedAt: string;
  association: string | null;
}

export interface NotificationView {
  id: string;
  title: string;
  body: string;
  unread: boolean;
  at: string;
}

export interface ProfileView {
  phone: string;
  phoneVerified: boolean;
  region: string;
  city: string;
  birthYear: string;
  gender: string;
  contactMethod: string;
  complete: boolean;
}

export interface AccountSnapshot {
  user: { id: string; name: string; email: string };
  profile: ProfileView;
  current: NeedView | null;
  history: HistoryItemView[];
  notifications: NotificationView[];
}
