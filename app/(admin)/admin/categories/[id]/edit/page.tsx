import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CategoryForm from "@/components/admin/CategoryForm";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [category, parentCategories] = await Promise.all([
    prisma.category.findUnique({ where: { id } }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!category) return notFound();

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Edit Category</h1>
        <p className="text-sm text-neutral-500 mt-1">Update &ldquo;{category.name}&rdquo;</p>
      </div>
      <CategoryForm
        initialData={{
          id: category.id,
          name: category.name,
          slug: category.slug,
          parentId: category.parentId,
          isReturnable: category.isReturnable,
          imageUrl: category.imageUrl,
        }}
        parentCategories={parentCategories}
        isEdit
      />
    </div>
  );
}
