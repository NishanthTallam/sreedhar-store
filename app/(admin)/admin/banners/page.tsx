"use client";

import { useEffect, useState } from "react";
import { BannerType } from "@prisma/client";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    type: "HOMEPAGE" as BannerType,
    title: "",
    imageUrl: "",
    linkUrl: "",
    isActive: true,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/banners?admin=true");
      const json = await res.json();
      if (res.ok) {
        setBanners(json.data);
      } else {
        setError(json.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsAdding(false);
        fetchBanners();
        setFormData({ type: "HOMEPAGE", title: "", imageUrl: "", linkUrl: "", isActive: true });
      } else {
        const json = await res.json();
        alert(json.error || "Failed to create banner");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      const res = await fetch(`/api/banners/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchBanners();
      } else {
        alert("Failed to delete banner");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const toggleActive = async (banner: any) => {
    try {
      const res = await fetch(`/api/banners/${banner.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...banner, isActive: !banner.isActive }),
      });
      if (res.ok) {
        fetchBanners();
      } else {
        alert("Failed to update status");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-surface-900">Banners</h1>
        <button onClick={() => setIsAdding(!isAdding)} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          {isAdding ? "Cancel" : "Add Banner"}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-surface-900">New Banner</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-surface-700">Type *</label>
              <select required value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as BannerType })} className="w-full rounded-md border border-surface-300 p-2 text-sm">
                <option value="HOMEPAGE">Homepage</option>
                <option value="OFFER">Offer</option>
                <option value="FESTIVAL">Festival</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-surface-700">Title *</label>
              <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-md border border-surface-300 p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-surface-700">Image URL *</label>
              <input required type="url" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full rounded-md border border-surface-300 p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-surface-700">Link URL (optional)</label>
              <input type="url" value={formData.linkUrl} onChange={e => setFormData({ ...formData, linkUrl: e.target.value })} className="w-full rounded-md border border-surface-300 p-2 text-sm" />
            </div>
            <div className="space-y-1 flex items-center gap-2 md:col-span-2 pt-4">
              <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="rounded border-surface-300 text-brand-600 focus:ring-brand-500" />
              <label className="text-sm font-medium text-surface-700">Is Active</label>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">Save Banner</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-surface-500">Loading banners...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map(banner => (
            <div key={banner.id} className="rounded-xl border border-surface-200 bg-white shadow-sm overflow-hidden flex flex-col">
              <div className="h-40 w-full bg-surface-100 relative">
                {banner.imageUrl ? (
                  <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-surface-400">No Image</div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium shadow-sm ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-surface-100 text-surface-700'}`}>
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white shadow-sm">
                    {banner.type}
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-surface-900">{banner.title}</h3>
                {banner.linkUrl && <a href={banner.linkUrl} target="_blank" rel="noreferrer" className="text-xs text-brand-600 hover:underline truncate mt-1">{banner.linkUrl}</a>}
                
                <div className="mt-auto pt-4 flex gap-2 justify-end">
                  <button onClick={() => toggleActive(banner)} className="px-3 py-1.5 text-xs font-medium text-surface-700 bg-surface-100 rounded-lg hover:bg-surface-200">
                    Toggle Status
                  </button>
                  <button onClick={() => handleDelete(banner.id)} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {banners.length === 0 && (
            <div className="col-span-full py-12 text-center text-surface-500 bg-white rounded-xl border border-surface-200">
              No banners found. Create one above!
            </div>
          )}
        </div>
      )}
    </div>
  );
}