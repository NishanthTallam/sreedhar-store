"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { brandSchema, BrandInput } from "@/lib/validators/brand";

type BrandFormProps = {
  initialData?: BrandInput & { id?: string };
  isEdit?: boolean;
};

export default function BrandForm({ initialData, isEdit = false }: BrandFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<BrandInput>(initialData || {
    name: "",
    slug: "",
    logoUrl: null,
  });

  const autoSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "name" && !isEdit) {
      setFormData(prev => ({ ...prev, name: value, slug: autoSlug(value) }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value === "" ? null : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const parsed = brandSchema.safeParse(formData);
    if (!parsed.success) {
      setError("Validation error: " + JSON.stringify(parsed.error.flatten().fieldErrors));
      setLoading(false);
      return;
    }

    try {
      const url = isEdit && initialData?.id ? `/api/brands/${initialData.id}` : "/api/brands";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const json = await res.json();
      if (res.ok) {
        router.push("/admin/brands");
        router.refresh();
      } else {
        setError(json.error || "Failed to save brand");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEdit || !initialData?.id) return;
    if (!confirm("Are you sure you want to delete this brand?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/brands/${initialData.id}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok) {
        router.push("/admin/brands");
        router.refresh();
      } else {
        setError(json.error || "Failed to delete brand");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm space-y-6">
      {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-900">Name *</label>
          <input
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-neutral-300 p-2.5 text-sm focus:border-brand-500 focus:ring-brand-500"
            placeholder="e.g. Nestlé"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-900">Slug *</label>
          <input
            required
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="w-full rounded-lg border border-neutral-300 p-2.5 text-sm focus:border-brand-500 focus:ring-brand-500"
            placeholder="e.g. nestle"
          />
        </div>

        <div className="col-span-1 md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-neutral-900">Logo URL</label>
          <input
            name="logoUrl"
            value={formData.logoUrl || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-neutral-300 p-2.5 text-sm focus:border-brand-500 focus:ring-brand-500"
            placeholder="https://example.com/logo.png"
          />
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
              Delete Brand
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 disabled:bg-brand-400"
          >
            {loading ? "Saving..." : isEdit ? "Update Brand" : "Create Brand"}
          </button>
        </div>
      </div>
    </form>
  );
}
