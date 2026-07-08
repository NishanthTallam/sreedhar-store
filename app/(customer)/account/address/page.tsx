import { requireAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { AddressClientList } from "./AddressClientList";

export default async function AddressPage() {
  const session = await requireAuth();

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { isDefault: 'desc' }
  });

  return <AddressClientList addresses={addresses} />;
}