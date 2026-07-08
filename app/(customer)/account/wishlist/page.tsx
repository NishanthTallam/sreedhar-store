import { requireAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { WishlistClientList } from "./WishlistClientList";

export default async function WishlistPage() {
  const session = await requireAuth();

  const wishlistItems = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: {
          variants: true,
          brand: true
        }
      }
    },
    orderBy: { addedAt: 'desc' }
  });

  const serializedItems = JSON.parse(JSON.stringify(wishlistItems));

  return <WishlistClientList initialItems={serializedItems} />;
}