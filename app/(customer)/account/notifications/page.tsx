import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/rbac";
import NotificationList from "@/components/notifications/NotificationList";
import { NotificationCategory } from "@prisma/client";
import Link from "next/link";

export default async function NotificationsPage({ searchParams }: { searchParams: Promise<{ category?: string, unread?: string }> }) {
  const session = await requireAuth();
  const resolvedParams = await searchParams;

  const category = resolvedParams.category as NotificationCategory | undefined;
  const unreadOnly = resolvedParams.unread === "true";

  const where: any = { userId: session.user.id };
  if (category) where.category = category;
  if (unreadOnly) where.isRead = false;

  const notifications = await prisma.notification.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const categories = Object.values(NotificationCategory);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Notifications</h1>
        <p className="text-sm text-surface-500 mt-1">Stay updated with your orders and offers.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-surface-200">
        <Link 
          href="/account/notifications" 
          className={`px-3 py-1.5 rounded-full text-sm font-medium ${!category && !unreadOnly ? 'bg-surface-900 text-white' : 'bg-surface-100 text-surface-700 hover:bg-surface-200'}`}
        >
          All
        </Link>
        <Link 
          href="/account/notifications?unread=true" 
          className={`px-3 py-1.5 rounded-full text-sm font-medium ${!category && unreadOnly ? 'bg-surface-900 text-white' : 'bg-surface-100 text-surface-700 hover:bg-surface-200'}`}
        >
          Unread
        </Link>
        {categories.map((cat) => (
          <Link 
            key={cat}
            href={`/account/notifications?category=${cat}`} 
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${category === cat ? 'bg-surface-900 text-white' : 'bg-surface-100 text-surface-700 hover:bg-surface-200'}`}
          >
            {cat}
          </Link>
        ))}
      </div>

      <NotificationList initialNotifications={notifications} />
    </div>
  );
}