"use client";

import { Button } from "@/components/ui/Button";
import { useAccount } from "../AccountState";
import { NotificationRows, ui } from "../pieces";

export function NotificationsView() {
  const { notifications, markNotificationsRead, unreadCount, pending } =
    useAccount();

  return (
    <>
      <div className={ui.head}>
        <h1>الإشعارات</h1>
        {unreadCount > 0 ? (
          <div className={ui.push}>
            <Button
              variant="ghost"
              disabled={pending}
              onClick={markNotificationsRead}
            >
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
