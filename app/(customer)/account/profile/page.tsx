import { requireAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { PersonalDetailsForm } from "../PersonalDetailsForm";
import { LogoutButton } from "../LogoutButton";

export const metadata = {
  title: "My Profile | Customer Account",
};

export default async function MobileProfilePage() {
  const session = await requireAuth();
  
  // Fetch fresh user data from the database to ensure it reflects recent updates
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) return null;

  // Split name into first and last name as a best effort
  const nameParts = user.name.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";
  
  const phone = user.phone || "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Personal Details</h1>
        <p className="mt-1 text-sm text-neutral-500">Manage your personal information and contact details.</p>
      </div>

      <div className="rounded-xl border border-neutral-200/80 bg-white/95 backdrop-blur-sm p-6 shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
        <PersonalDetailsForm 
          initialFirstName={firstName} 
          initialLastName={lastName} 
          email={user.email} 
          initialPhone={phone} 
        />
      </div>

      <div className="rounded-xl border border-red-100/80 bg-white/95 backdrop-blur-sm p-6 shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">Sign Out</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Sign out of your account on this device.
            </p>
          </div>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
