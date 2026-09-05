"use client";

import { Button } from "@/components/ui/Button";
import { useAccount } from "../AccountState";
import { NotificationRows, ui } from "../pieces";

export function NotificationsView() {
  const { notifications, markNotificationsRead, ready } = useAccount();
  if (!ready) return null;

  const unread = notifications.filter((n) => n.unread).length;

  return (
    <>
      <div className={ui.head}>
        <h1>الإشعارات</h1>
        {unread > 0 ? (
          <div className={ui.push}>
            <Button variant="ghost" onClick={markNotificationsRead}>
              تعليم الكل كمقروء
            </Button>
          </div>
        ) : null}
      </div>

      <p className={ui.text} style={{ marginBottom: 16 }}>
        يصلك إشعار عند كل تغيّر في حالة احتياجك.
      </p>

      <NotificationRows items={notifications} />
    </>
  );
}
