import { prisma } from "@/lib/prisma";
import { NotificationList } from "./NotificationList";
import { requireAuth } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const session = await requireAuth();

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">System Notifications</h1>
        <p className="text-sm text-gray-500 mt-1">Review alerts, order updates, and inventory warnings.</p>
      </div>

      <NotificationList notifications={notifications} />
    </div>
  );
}
