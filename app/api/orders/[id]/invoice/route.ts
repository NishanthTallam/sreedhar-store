import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/rbac";
import { format } from "date-fns";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const order = await prisma.order.findUnique({
      where: { id: (await context.params).id },
      include: {
        user: true,
        address: true,
        items: {
          include: {
            variant: {
              include: {
                product: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Get store settings for invoice header (fallback to defaults)
    const settings = await prisma.storeSetting.findFirst();
    const storeName = settings?.storeName || "General Store";
    const storeAddress = settings?.storeAddress || "123 Store Street, City";
    const storePhone = settings?.supportPhone || "+1 234 567 8900";

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Invoice - ${order.orderNumber}</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; color: #333; margin: 0; padding: 40px; }
          .invoice-container { max-width: 800px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
          .store-info h1 { margin: 0 0 10px 0; font-size: 24px; color: #111; }
          .store-info p { margin: 0 0 5px 0; color: #666; font-size: 14px; }
          .invoice-details { text-align: right; }
          .invoice-details h2 { margin: 0 0 10px 0; font-size: 20px; color: #111; }
          .invoice-details p { margin: 0 0 5px 0; color: #666; font-size: 14px; }
          .billing-info { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .billing-box { width: 45%; }
          .billing-box h3 { font-size: 14px; text-transform: uppercase; color: #888; letter-spacing: 1px; margin-bottom: 10px; }
          .billing-box p { margin: 0 0 5px 0; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background: #f9fafb; text-align: left; padding: 12px; font-size: 12px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb; }
          td { padding: 16px 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #111; }
          .totals { width: 300px; margin-left: auto; }
          .total-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 14px; color: #4b5563; }
          .total-row.grand-total { border-top: 2px solid #e5e7eb; margin-top: 10px; padding-top: 15px; font-weight: bold; font-size: 16px; color: #111; }
          .print-btn { display: block; margin: 40px auto; padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; }
          @media print {
            .print-btn { display: none; }
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="store-info">
              <h1>${storeName}</h1>
              <p>${storeAddress}</p>
              <p>${storePhone}</p>
            </div>
            <div class="invoice-details">
              <h2>INVOICE</h2>
              <p><strong>Order #:</strong> ${order.orderNumber}</p>
              <p><strong>Date:</strong> ${format(new Date(order.createdAt), "MMM d, yyyy")}</p>
              <p><strong>Status:</strong> ${order.status}</p>
            </div>
          </div>
          
          <div class="billing-info">
            <div class="billing-box">
              <h3>Billed To</h3>
              <p><strong>${order.user.name}</strong></p>
              <p>${order.user.email}</p>
            </div>
            <div class="billing-box">
              <h3>Shipped To</h3>
              <p><strong>${order.address.fullName}</strong></p>
              <p>${order.address.houseNo}, ${order.address.street}</p>
              ${order.address.landmark ? `<p>${order.address.landmark}</p>` : ''}
              <p>${order.address.city}, ${order.address.state} ${order.address.pincode}</p>
              <p>Phone: ${order.address.mobile}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Variant</th>
                <th>Qty</th>
                <th style="text-align: right">Price</th>
                <th style="text-align: right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>
                    <strong>${item.variant.product.name}</strong>
                  </td>
                  <td>${item.variant.label}</td>
                  <td>${item.quantity}</td>
                  <td style="text-align: right">₹${item.priceAtOrder.toString()}</td>
                  <td style="text-align: right">₹${(Number(item.priceAtOrder) * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>₹${order.subtotal.toString()}</span>
            </div>
            ${order.discountAmount && Number(order.discountAmount) > 0 ? `
            <div class="total-row" style="color: #16a34a;">
              <span>Discount:</span>
              <span>-₹${order.discountAmount.toString()}</span>
            </div>` : ''}
            <div class="total-row">
              <span>Delivery Charge:</span>
              <span>${Number(order.deliveryCharge) === 0 ? 'Free' : `₹${order.deliveryCharge.toString()}`}</span>
            </div>
            <div class="total-row grand-total">
              <span>Total Amount:</span>
              <span>₹${order.totalAmount.toString()}</span>
            </div>
            <div class="total-row">
              <span>Payment Method:</span>
              <span>${order.paymentMethod}</span>
            </div>
          </div>

          <button class="print-btn" onclick="window.print()">Print Invoice</button>
        </div>
      </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.error("[InvoiceError]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}