import { requireAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { PersonalDetailsForm } from "./PersonalDetailsForm";

export default async function PersonalDetailsPage() {
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

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card">
        <PersonalDetailsForm 
          initialFirstName={firstName} 
          initialLastName={lastName} 
          email={user.email} 
          initialPhone={phone} 
        />
      </div>
    </div>
  );
}