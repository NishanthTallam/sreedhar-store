import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.brand.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } })
  ]);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Add New Product</h1>
        <p className="text-sm text-neutral-500 mt-1">Create a new product with multiple variants.</p>
      </div>
      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}