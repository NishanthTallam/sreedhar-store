"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { productSchema, ProductInput } from "@/lib/validators/product";

type Category = { id: string; name: string };
type Brand = { id: string; name: string };

type ProductFormProps = {
  initialData?: ProductInput & { id?: string };
  categories: Category[];
  brands: Brand[];
  isEdit?: boolean;
};

export default function ProductForm({ initialData, categories, brands, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProductInput>(initialData || {
    name: "",
    slug: "",
    description: "",
    categoryId: "",
    brandId: "",
    isReturnable: true,
    isActive: true,
    images: [],
    variants: [{ label: "Default", unit: "pcs", price: 0, stock: 0, lowStockAt: 10, sku: "" }],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleVariantChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => {
      const newVariants = [...prev.variants];
      newVariants[index] = { ...newVariants[index], [field]: value };
      return { ...prev, variants: newVariants };
    });
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { label: "", unit: "pcs", price: 0, stock: 0, lowStockAt: 10, sku: "" }]
    }));
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, images: value.split(",").map(i => i.trim()).filter(Boolean) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const parsed = productSchema.safeParse(formData);
    if (!parsed.success) {
      setError("Please fix the validation errors: " + JSON.stringify(parsed.error.flatten().fieldErrors));
      setLoading(false);
      return;
    }

    try {
      const url = isEdit && initialData?.id ? `/api/products/${initialData.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const json = await res.json();
      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        setError(json.error || "Failed to save product");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm space-y-8">
      {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-surface-900">Name *</label>
          <input required name="name" value={formData.name} onChange={handleChange} className="w-full rounded-lg border border-surface-300 p-2 text-sm focus:border-brand-500 focus:ring-brand-500" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-surface-900">Slug *</label>
          <input required name="slug" value={formData.slug} onChange={handleChange} className="w-full rounded-lg border border-surface-300 p-2 text-sm focus:border-brand-500 focus:ring-brand-500" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-surface-900">Category *</label>
          <select required name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full rounded-lg border border-surface-300 p-2 text-sm focus:border-brand-500 focus:ring-brand-500">
            <option value="">Select Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-surface-900">Brand</label>
          <select name="brandId" value={formData.brandId || ""} onChange={handleChange} className="w-full rounded-lg border border-surface-300 p-2 text-sm focus:border-brand-500 focus:ring-brand-500">
            <option value="">No Brand</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        
        <div className="col-span-1 md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-surface-900">Description</label>
          <textarea name="description" value={formData.description || ""} onChange={handleChange} className="w-full rounded-lg border border-surface-300 p-2 text-sm focus:border-brand-500 focus:ring-brand-500" rows={3} />
        </div>

        <div className="col-span-1 md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-surface-900">Images (Comma-separated URLs)</label>
          <input value={formData.images.join(", ")} onChange={handleImagesChange} placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" className="w-full rounded-lg border border-surface-300 p-2 text-sm focus:border-brand-500 focus:ring-brand-500" />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="isReturnable" checked={formData.isReturnable ?? true} onChange={handleChange} className="h-4 w-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500" />
          <label className="text-sm font-medium text-surface-900">Is Returnable</label>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500" />
          <label className="text-sm font-medium text-surface-900">Is Active</label>
        </div>
      </div>

      <div className="pt-6 border-t border-surface-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-surface-900">Variants *</h3>
          <button type="button" onClick={addVariant} className="text-sm text-brand-600 font-medium hover:text-brand-700">+ Add Variant</button>
        </div>
        
        <div className="space-y-4">
          {formData.variants.map((variant, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border border-surface-200 rounded-lg bg-surface-50 relative">
              {formData.variants.length > 1 && (
                <button type="button" onClick={() => removeVariant(index)} className="absolute top-2 right-2 text-red-500 text-xl font-bold">&times;</button>
              )}
              
              <div className="space-y-1">
                <label className="text-xs font-medium text-surface-700">Label (e.g. 1kg) *</label>
                <input required value={variant.label} onChange={(e) => handleVariantChange(index, "label", e.target.value)} className="w-full rounded-md border border-surface-300 p-1.5 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-surface-700">Unit (e.g. kg) *</label>
                <input required value={variant.unit} onChange={(e) => handleVariantChange(index, "unit", e.target.value)} className="w-full rounded-md border border-surface-300 p-1.5 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-surface-700">SKU *</label>
                <input required value={variant.sku} onChange={(e) => handleVariantChange(index, "sku", e.target.value)} className="w-full rounded-md border border-surface-300 p-1.5 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-surface-700">Price (₹) *</label>
                <input required type="number" step="0.01" min="0" value={variant.price} onChange={(e) => handleVariantChange(index, "price", parseFloat(e.target.value))} className="w-full rounded-md border border-surface-300 p-1.5 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-surface-700">Stock *</label>
                <input required type="number" min="0" value={variant.stock} onChange={(e) => handleVariantChange(index, "stock", parseInt(e.target.value, 10))} className="w-full rounded-md border border-surface-300 p-1.5 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-surface-700">Low Stock Alert *</label>
                <input required type="number" min="0" value={variant.lowStockAt} onChange={(e) => handleVariantChange(index, "lowStockAt", parseInt(e.target.value, 10))} className="w-full rounded-md border border-surface-300 p-1.5 text-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-surface-100">
        <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm font-medium text-surface-700 bg-white border border-surface-300 rounded-lg hover:bg-surface-50">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 disabled:bg-brand-400">
          {loading ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}
