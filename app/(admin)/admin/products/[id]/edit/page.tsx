import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({
      where: { id: resolvedParams.id },
      include: { variants: true },
    }),
    prisma.category.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.brand.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } })
  ]);

  if (!product) {
    notFound();
  }

  // Convert decimal to number for form state
  const formattedProduct = {
    ...product,
    variants: product.variants.map(v => ({
      ...v,
      price: Number(v.price),
      mrpPrice: v.mrpPrice ? Number(v.mrpPrice) : null,
      discount: v.discount ? Number(v.discount) : null,
    }))
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Edit Product</h1>
        <p className="text-sm text-neutral-500 mt-1">Editing product ID: {resolvedParams.id}</p>
      </div>
      <ProductForm 
        initialData={formattedProduct as any} 
        categories={categories} 
        brands={brands} 
        isEdit={true} 
      />
    </div>
  );
}