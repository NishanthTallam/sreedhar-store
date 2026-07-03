import { prisma } from "@/lib/prisma";
import CategoryForm from "@/components/admin/CategoryForm";

export default async function NewCategoryPage() {
  const parentCategories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Add New Category</h1>
        <p className="text-sm text-neutral-500 mt-1">Create a new product category.</p>
      </div>
      <CategoryForm parentCategories={parentCategories} />
    </div>
  );
}
