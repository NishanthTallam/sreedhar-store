import { MapPin, Plus, Star, MoreVertical } from "lucide-react";

export default function AddressPage() {
  const addresses = [
    {
      id: 1,
      type: "Home",
      name: "John Doe",
      street: "123 Main Street, Block A",
      area: "Koramangala, 4th Block",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560034",
      phone: "+91 98765 43210",
      isDefault: true,
    },
    {
      id: 2,
      type: "Work",
      name: "John Doe",
      street: "Tech Park, Tower B",
      area: "Whitefield",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560066",
      phone: "+91 98765 43210",
      isDefault: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Saved Addresses</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage your delivery addresses for quick checkout.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
          <Plus className="h-4 w-4" />
          Add New Address
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {addresses.map((address) => (
          <div key={address.id} className="relative rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-card">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800">
                  <MapPin className="mr-1 h-3 w-3" />
                  {address.type}
                </span>
                {address.isDefault && (
                  <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
                    <Star className="mr-1 h-3 w-3 fill-current" />
                    Default
                  </span>
                )}
              </div>
              <button className="text-neutral-400 hover:text-neutral-600">
                <MoreVertical className="h-5 w-5" />
                <span className="sr-only">Address options</span>
              </button>
            </div>

            <div className="mt-4">
              <p className="font-medium text-neutral-900">{address.name}</p>
              <p className="mt-1 text-sm text-neutral-600">
                {address.street}, {address.area}
                <br />
                {address.city}, {address.state} {address.pincode}
              </p>
              <p className="mt-2 text-sm font-medium text-neutral-900">Phone: <span className="font-normal text-neutral-600">{address.phone}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}