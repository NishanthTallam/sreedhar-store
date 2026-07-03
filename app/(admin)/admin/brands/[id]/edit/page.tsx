import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BrandForm from "@/components/admin/BrandForm";

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const brand = await prisma.brand.findUnique({ where: { id } });
  if (!brand) return notFound();

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Edit Brand</h1>
        <p className="text-sm text-neutral-500 mt-1">Update &ldquo;{brand.name}&rdquo;</p>
      </div>
      <BrandForm
        initialData={{
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
          logoUrl: brand.logoUrl,
        }}
        isEdit
      />
    </div>
  );
}
