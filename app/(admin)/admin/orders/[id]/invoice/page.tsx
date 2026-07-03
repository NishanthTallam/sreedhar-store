import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { PrintButton } from "./PrintButton";

export default async function InvoicePage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      address: true,
      items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const storeSettings = await prisma.storeSetting.findFirst();
  const storeName = storeSettings?.storeName || "General Store";
  const storeAddress = storeSettings?.storeAddress || "123 Commerce St, Business City";
  const supportEmail = storeSettings?.supportEmail || "support@example.com";
  const supportPhone = storeSettings?.supportPhone || "+1 234 567 890";

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white" id="printable-invoice">
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-invoice, #printable-invoice * {
              visibility: visible;
            }
            #printable-invoice {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 0;
              margin: 0;
            }
            .no-print {
              display: none !important;
            }
          }
        `
      }} />

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mb-8 no-print">
        <a 
          href={`/admin/orders/${order.id}`}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
        >
          Back to Order
        </a>
        <PrintButton />
      </div>

      <div className="p-8 border border-gray-200 rounded-lg shadow-sm print:border-none print:shadow-none print:p-0">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{storeName}</h1>
            <div className="text-gray-500 text-sm space-y-1">
              <p>{storeAddress}</p>
              <p>{supportEmail}</p>
              <p>{supportPhone}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-wider mb-2">Invoice</h2>
            <div className="text-gray-900 font-medium">#{order.orderNumber}</div>
            <div className="text-gray-500 text-sm mt-1">
              Date: {format(new Date(order.createdAt), "MMM dd, yyyy")}
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Bill To:</h3>
          <div className="text-gray-900 font-medium">{order.address.fullName}</div>
          <div className="text-gray-500 text-sm mt-1">
            <p>{order.address.houseNo}, {order.address.street}</p>
            <p>{order.address.city}, {order.address.state} {order.address.pincode}</p>
            <p className="mt-1">Phone: {order.address.mobile}</p>
            <p>Email: {order.user.email}</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full text-left mb-8">
          <thead>
            <tr className="border-b border-gray-200 text-sm font-semibold text-gray-900">
              <th className="py-3 px-2">Item Description</th>
              <th className="py-3 px-2">Qty</th>
              <th className="py-3 px-2 text-right">Price</th>
              <th className="py-3 px-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="py-4 px-2">
                  <div className="font-medium text-gray-900">{item.variant.product.name}</div>
                  <div className="text-sm text-gray-500">Variant: {item.variant.label}</div>
                </td>
                <td className="py-4 px-2 text-gray-700">{item.quantity}</td>
                <td className="py-4 px-2 text-right text-gray-700">₹{Number(item.priceAtOrder).toFixed(2)}</td>
                <td className="py-4 px-2 text-right font-medium text-gray-900">
                  ₹{(Number(item.priceAtOrder) * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className="flex justify-end">
          <div className="w-64 space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{Number(order.subtotal).toFixed(2)}</span>
            </div>
            {Number(order.discountAmount) > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{Number(order.discountAmount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600 border-b border-gray-200 pb-3">
              <span>Delivery Charge</span>
              <span>{Number(order.deliveryCharge) === 0 ? "Free" : `₹${Number(order.deliveryCharge).toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-1">
              <span>Total Amount</span>
              <span>₹{Number(order.totalAmount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500 pt-2">
              <span>Payment Method</span>
              <span className="uppercase">{order.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Thank you for your business!</p>
          <p className="mt-1">If you have any questions about this invoice, please contact {supportEmail}</p>
        </div>
      </div>
    </div>
  );
}
