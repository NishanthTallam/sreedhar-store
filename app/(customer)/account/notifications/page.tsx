import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/rbac";
import { NotificationList } from "@/components/notifications/NotificationList";
import { MarkAllReadButton } from "./MarkAllReadButton";

export default async function NotificationsPage() {
  const session = await requireAuth();

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Notifications</h1>
          <p className="text-sm text-neutral-500 mt-1">Stay updated with your orders and offers.</p>
        </div>
        <MarkAllReadButton />
      </div>

      <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-neutral-200">
        <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-neutral-900 text-white">
          All
        </span>
      </div>

      <NotificationList initialNotifications={notifications} />
    </div>
  );
}