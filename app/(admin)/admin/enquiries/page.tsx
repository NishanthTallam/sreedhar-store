import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  title: "Contact Enquiries | Admin",
};

export default async function AdminEnquiriesPage() {
  const enquiries = await prisma.contactEnquiry.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Contact Enquiries</h1>
        <p className="text-sm text-neutral-500">View and manage customer messages from the Contact Us page.</p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50">
              <tr>
                <th className="px-4 py-3 font-medium text-neutral-900">Date</th>
                <th className="px-4 py-3 font-medium text-neutral-900">Customer</th>
                <th className="px-4 py-3 font-medium text-neutral-900">Subject</th>
                <th className="px-4 py-3 font-medium text-neutral-900">Message</th>
                <th className="px-4 py-3 font-medium text-neutral-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                    No enquiries found.
                  </td>
                </tr>
              ) : (
                enquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 whitespace-nowrap text-neutral-500">
                      {format(new Date(enquiry.createdAt), "MMM d, yyyy HH:mm")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-neutral-900">{enquiry.name}</div>
                      <div className="text-xs text-neutral-500">{enquiry.email}</div>
                      <div className="text-xs text-neutral-500">{enquiry.phone}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      {enquiry.subject}
                    </td>
                    <td className="px-4 py-3 text-neutral-600 max-w-xs truncate">
                      {enquiry.message}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge variant="status" statusColor={enquiry.status === "PENDING" ? "warning" : "success"}>
                        {enquiry.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
