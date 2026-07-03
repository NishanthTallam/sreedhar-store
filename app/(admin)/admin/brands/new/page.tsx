import BrandForm from "@/components/admin/BrandForm";

export default function NewBrandPage() {
  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Add New Brand</h1>
        <p className="text-sm text-neutral-500 mt-1">Create a new product brand.</p>
      </div>
      <BrandForm />
    </div>
  );
}
