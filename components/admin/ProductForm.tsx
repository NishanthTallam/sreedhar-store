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
  const [uploading, setUploading] = useState(false);
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
    variants: [{ label: "Default", unit: "pieces", price: 0, mrpPrice: 0, discount: 0, stock: 0, lowStockAt: 10, sku: "", barcode: "" }],
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
      variants: [...prev.variants, { label: "", unit: "pieces", price: 0, mrpPrice: 0, discount: 0, stock: 0, lowStockAt: 10, sku: "", barcode: "" }]
    }));
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const files = Array.from(e.target.files);
    
    try {
      const uploadPromises = files.map(async (file) => {
        const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: 'POST',
          body: file,
        });
        const data = await response.json();
        if (data.url) return data.url;
        throw new Error(data.error || 'Upload failed');
      });
      
      const uploadedUrls = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls.filter(Boolean)]
      }));
    } catch (err: any) {
      setError(err.message || 'Error uploading images');
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset file input
    }
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

  const handleDelete = async () => {
    if (!isEdit || !initialData?.id) return;
    if (!confirm("Are you sure you want to delete this product? This cannot be undone.")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/products/${initialData.id}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        setError(json.error || "Failed to delete product");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm space-y-8">
      {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-900">Name *</label>
          <input required name="name" value={formData.name} onChange={handleChange} className="w-full rounded-lg border border-neutral-300 p-2 text-sm focus:border-brand-500 focus:ring-brand-500" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-900">Slug *</label>
          <input required name="slug" value={formData.slug} onChange={handleChange} className="w-full rounded-lg border border-neutral-300 p-2 text-sm focus:border-brand-500 focus:ring-brand-500" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-900">Category *</label>
          <select required name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full rounded-lg border border-neutral-300 p-2 text-sm focus:border-brand-500 focus:ring-brand-500">
            <option value="">Select Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-900">Brand</label>
          <select name="brandId" value={formData.brandId || ""} onChange={handleChange} className="w-full rounded-lg border border-neutral-300 p-2 text-sm focus:border-brand-500 focus:ring-brand-500">
            <option value="">No Brand</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        
        <div className="col-span-1 md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-neutral-900">Description</label>
          <textarea name="description" value={formData.description || ""} onChange={handleChange} className="w-full rounded-lg border border-neutral-300 p-2 text-sm focus:border-brand-500 focus:ring-brand-500" rows={3} />
        </div>

        <div className="col-span-1 md:col-span-2 space-y-4">
          <label className="text-sm font-medium text-neutral-900">Images</label>
          <div className="flex items-center gap-4">
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleFileUpload} 
              disabled={uploading}
              className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 disabled:opacity-50" 
            />
            {uploading && <span className="text-sm text-brand-600 font-medium">Uploading...</span>}
          </div>
          
          {formData.images.length > 0 && (
            <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
              {formData.images.map((url, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden border border-neutral-200">
                  <img src={url} alt={`Preview ${i}`} className="w-full h-24 object-cover" />
                  <button 
                    type="button" 
                    onClick={() => removeImage(i)} 
                    className="absolute top-1 right-1 bg-white/80 hover:bg-red-50 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="isReturnable" checked={formData.isReturnable ?? true} onChange={handleChange} className="h-4 w-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500" />
          <label className="text-sm font-medium text-neutral-900">Is Returnable</label>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500" />
          <label className="text-sm font-medium text-neutral-900">Is Active</label>
        </div>
      </div>

      <div className="pt-6 border-t border-neutral-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-neutral-900">Variants *</h3>
          <button type="button" onClick={addVariant} className="text-sm text-brand-600 font-medium hover:text-brand-700">+ Add Variant</button>
        </div>
        
        <div className="space-y-4">
          {formData.variants.map((variant, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border border-neutral-200 rounded-lg bg-neutral-50 relative">
              {formData.variants.length > 1 && (
                <button type="button" onClick={() => removeVariant(index)} className="absolute top-2 right-2 text-red-500 text-xl font-bold">&times;</button>
              )}
              
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-700">Label (e.g. 1kg) *</label>
                <input required value={variant.label} onChange={(e) => handleVariantChange(index, "label", e.target.value)} className="w-full rounded-md border border-neutral-300 p-1.5 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-700">Unit *</label>
                <select required value={variant.unit} onChange={(e) => handleVariantChange(index, "unit", e.target.value)} className="w-full rounded-md border border-neutral-300 p-1.5 text-sm">
                  <option value="pieces">Pieces</option>
                  <option value="kg">Kg</option>
                  <option value="gram">Gram</option>
                  <option value="litre">Litre</option>
                  <option value="millitre">Millilitre</option>
                  <option value="pack">Pack</option>
                  <option value="box">Box</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-700">SKU *</label>
                <input required value={variant.sku} onChange={(e) => handleVariantChange(index, "sku", e.target.value)} className="w-full rounded-md border border-neutral-300 p-1.5 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-700">Barcode</label>
                <input value={variant.barcode || ""} onChange={(e) => handleVariantChange(index, "barcode", e.target.value)} className="w-full rounded-md border border-neutral-300 p-1.5 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-700">MRP Price (₹)</label>
                <input type="number" step="0.01" min="0" value={variant.mrpPrice == null || Number.isNaN(variant.mrpPrice as number) ? "" : variant.mrpPrice} onChange={(e) => handleVariantChange(index, "mrpPrice", e.target.value ? parseFloat(e.target.value) : "")} className="w-full rounded-md border border-neutral-300 p-1.5 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-700">Discount (₹/%)</label>
                <input type="number" step="0.01" min="0" value={variant.discount == null || Number.isNaN(variant.discount as number) ? "" : variant.discount} onChange={(e) => handleVariantChange(index, "discount", e.target.value ? parseFloat(e.target.value) : "")} className="w-full rounded-md border border-neutral-300 p-1.5 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-700">Selling Price (₹) *</label>
                <input required type="number" step="0.01" min="0" value={Number.isNaN(variant.price as number) ? "" : variant.price} onChange={(e) => handleVariantChange(index, "price", parseFloat(e.target.value))} className="w-full rounded-md border border-neutral-300 p-1.5 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-700">Stock *</label>
                <input required type="number" min="0" value={Number.isNaN(variant.stock as number) ? "" : variant.stock} onChange={(e) => handleVariantChange(index, "stock", parseInt(e.target.value, 10))} className="w-full rounded-md border border-neutral-300 p-1.5 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-700">Low Alert *</label>
                <input required type="number" min="0" value={Number.isNaN(variant.lowStockAt as number) ? "" : variant.lowStockAt} onChange={(e) => handleVariantChange(index, "lowStockAt", parseInt(e.target.value, 10))} className="w-full rounded-md border border-neutral-300 p-1.5 text-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-neutral-100">
        <div>
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50"
            >
              Delete Product
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50">
            Cancel
          </button>
          <button type="submit" disabled={loading || uploading} className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 disabled:bg-brand-400">
            {loading ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
          </button>
        </div>
      </div>
    </form>
  );
}
