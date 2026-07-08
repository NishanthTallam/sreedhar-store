"use client";

import { User, Phone, Mail, Edit2, X } from "lucide-react";
import { useState, useTransition } from "react";
import { updatePersonalDetails } from "./actions";

export function PersonalDetailsForm({ 
  initialFirstName, 
  initialLastName, 
  email, 
  initialPhone 
}: { 
  initialFirstName: string; 
  initialLastName: string; 
  email: string; 
  initialPhone: string; 
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setMessage(null);
    startTransition(async () => {
      const res = await updatePersonalDetails(formData);
      if (res.success) {
        setMessage({ type: "success", text: res.message || "Profile updated successfully." });
        setIsEditing(false); // Close edit mode on success
      } else {
        setMessage({ type: "error", text: res.error || "Something went wrong." });
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-neutral-900">Your Details</h2>
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            <Edit2 className="h-4 w-4" />
            Edit Profile
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setMessage(null);
            }}
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-700"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        )}
      </div>

      {message && (
        <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-100'}`}>
          {message.text}
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium text-neutral-900">
            First Name
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <User className="h-4 w-4 text-neutral-400" />
            </div>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="block w-full rounded-md border border-neutral-300 py-2.5 pl-10 pr-3 text-sm placeholder-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-neutral-50 disabled:text-neutral-500"
              placeholder="First Name"
              defaultValue={initialFirstName}
              required
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium text-neutral-900">
            Last Name
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <User className="h-4 w-4 text-neutral-400" />
            </div>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="block w-full rounded-md border border-neutral-300 py-2.5 pl-10 pr-3 text-sm placeholder-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-neutral-50 disabled:text-neutral-500"
              placeholder="Last Name"
              defaultValue={initialLastName}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-neutral-900">
            Email Address
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-4 w-4 text-neutral-400" />
            </div>
            <input
              type="email"
              id="email"
              className="block w-full rounded-md border border-neutral-300 py-2.5 pl-10 pr-3 text-sm text-neutral-500 bg-neutral-50 focus:outline-none cursor-not-allowed"
              defaultValue={email}
              disabled
            />
          </div>
          <p className="text-xs text-neutral-500">Email address cannot be changed.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-neutral-900">
            Phone Number
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Phone className="h-4 w-4 text-neutral-400" />
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="block w-full rounded-md border border-neutral-300 py-2.5 pl-10 pr-3 text-sm placeholder-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-neutral-50 disabled:text-neutral-500"
              placeholder="+91 98765 43210"
              defaultValue={initialPhone}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-md bg-brand-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </form>
  );
}
