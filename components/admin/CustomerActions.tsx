"use client";

import { useTransition } from "react";
import { toggleCustomerBlock, updateCustomerRole } from "@/app/(admin)/admin/actions";

export function CustomerActions({ userId, isBlocked, role }: { userId: string, isBlocked: boolean, role: string }) {
  const [isPending, startTransition] = useTransition();

  const handleToggleBlock = () => {
    if (confirm(`Are you sure you want to ${isBlocked ? 'unblock' : 'block'} this user?`)) {
      startTransition(async () => {
        await toggleCustomerBlock(userId, !isBlocked);
      });
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as "CUSTOMER" | "ADMIN" | "DELIVERY_BOY";
    if (confirm(`Change this user's role to ${newRole}?`)) {
      startTransition(async () => {
        await updateCustomerRole(userId, newRole);
      });
    } else {
      e.target.value = role; // reset
    }
  };

  return (
    <div className="flex gap-4 items-center justify-end">
      <select 
        disabled={isPending}
        defaultValue={role}
        onChange={handleRoleChange}
        className="rounded-md border border-neutral-300 py-1 px-2 text-xs font-medium bg-white"
      >
        <option value="CUSTOMER">Customer</option>
        <option value="DELIVERY_BOY">Delivery Boy</option>
        <option value="ADMIN">Admin</option>
      </select>
      
      <button
        onClick={handleToggleBlock}
        disabled={isPending}
        className={`px-3 py-1.5 text-xs font-medium rounded-md disabled:opacity-50 ${
          isBlocked 
            ? "text-success-700 bg-success-50 hover:bg-success-100 border border-success-200" 
            : "text-danger-700 bg-danger-50 hover:bg-danger-100 border border-danger-200"
        }`}
      >
        {isBlocked ? "Unblock" : "Block"}
      </button>
    </div>
  );
}
