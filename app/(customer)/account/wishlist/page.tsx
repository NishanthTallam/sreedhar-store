import { requireAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { WishlistClientList } from "./WishlistClientList";

export default async function WishlistPage() {
  const session = await requireAuth();

  const wishlistItems = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      productId: true,
      addedAt: true,
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          images: true,
          avgRating: true,
          brand: { select: { id: true, name: true } },
          variants: {
            select: {
              id: true,
              label: true,
              price: true,
              stock: true,
              productId: true,
            },
          },
        },
      },
    },
    orderBy: { addedAt: "desc" },
  });

  const serializedItems = JSON.parse(JSON.stringify(wishlistItems));

  return <WishlistClientList initialItems={serializedItems} />;
}