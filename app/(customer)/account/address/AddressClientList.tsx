"use client";

import { useState } from "react";
import { deleteAddress, addAddress, updateAddress } from "./actions";
import { MapPin, Plus, Star, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function AddressClientList({ addresses }: { addresses: any[] }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Form State for Pincode Auto-fill
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPincode(val);
    
    if (val.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
        const data = await res.json();
        if (data[0].Status === "Success") {
          const postOffice = data[0].PostOffice[0];
          setCity(postOffice.District);
          setState(postOffice.State);
        }
      } catch (err) {
        console.error("Failed to fetch pincode details", err);
      }
    }
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEditingAddress(null);
    setPincode("");
    setCity("");
    setState("");
  };

  const handleEditClick = (address: any) => {
    setEditingAddress(address);
    setPincode(address.pincode);
    setCity(address.city);
    setState(address.state);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    setLoadingId(id);
    await deleteAddress(id);
    setLoadingId(null);
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (editingAddress) {
      formData.append("id", editingAddress.id);
      const res = await updateAddress(formData);
      if (res.success) resetForm();
      else alert(res.error);
    } else {
      const res = await addAddress(formData);
      if (res.success) resetForm();
      else alert(res.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Saved Addresses</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage your delivery addresses for quick checkout.</p>
        </div>
        {!showAddForm && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            Add New Address
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">{editingAddress ? "Edit Address" : "Add New Address"}</h2>
            <button type="button" onClick={resetForm} className="text-sm text-neutral-500 hover:text-neutral-700">Cancel</button>
          </div>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input required name="fullName" defaultValue={editingAddress?.fullName} placeholder="Full Name" className="block w-full rounded-md border border-neutral-300 py-2 px-3 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
              <input required name="mobile" defaultValue={editingAddress?.mobile} placeholder="Mobile Number" className="block w-full rounded-md border border-neutral-300 py-2 px-3 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
              <input required name="houseNo" defaultValue={editingAddress?.houseNo} placeholder="House/Flat No." className="block w-full rounded-md border border-neutral-300 py-2 px-3 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
              <input required name="street" defaultValue={editingAddress?.street} placeholder="Street/Area" className="block w-full rounded-md border border-neutral-300 py-2 px-3 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
              <input name="landmark" defaultValue={editingAddress?.landmark} placeholder="Landmark (Optional)" className="block w-full rounded-md border border-neutral-300 py-2 px-3 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
              <input required name="pincode" value={pincode} onChange={handlePincodeChange} placeholder="Pincode" className="block w-full rounded-md border border-neutral-300 py-2 px-3 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500" maxLength={6} />
              <input required name="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="block w-full rounded-md border border-neutral-300 py-2 px-3 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
              <input required name="state" value={state} onChange={(e) => setState(e.target.value)} placeholder="State" className="block w-full rounded-md border border-neutral-300 py-2 px-3 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
              <select required name="type" defaultValue={editingAddress?.type || "HOME"} className="block w-full rounded-md border border-neutral-300 py-2 px-3 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500">
                <option value="HOME">Home</option>
                <option value="WORK">Work</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit">{editingAddress ? "Update Address" : "Save Address"}</Button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 && !showAddForm && (
        <div className="text-center py-12 text-neutral-500 border border-neutral-200 rounded-xl bg-white">
          No addresses saved yet.
        </div>
      )}

      {!showAddForm && (
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
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditClick(address)}
                    className="text-neutral-400 hover:text-brand-600 disabled:opacity-50"
                  >
                    <Edit2 className="h-5 w-5" />
                    <span className="sr-only">Edit Address</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(address.id)}
                    disabled={loadingId === address.id}
                    className="text-neutral-400 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="h-5 w-5" />
                    <span className="sr-only">Delete Address</span>
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <p className="font-medium text-neutral-900">{address.fullName}</p>
                <p className="mt-1 text-sm text-neutral-600">
                  {address.houseNo}, {address.street}
                  {address.landmark && <><br />Near {address.landmark}</>}
                  <br />
                  {address.city}, {address.state} {address.pincode}
                </p>
                <p className="mt-2 text-sm font-medium text-neutral-900">Phone: <span className="font-normal text-neutral-600">{address.mobile}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
