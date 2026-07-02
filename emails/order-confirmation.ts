export function generateOrderConfirmationEmail(orderNumber: string, customerName: string, items: any[], totalAmount: number): string {
  // A simple HTML template generator. 
  // For larger scale, consider react-email or a templating engine like Handlebars.
  
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong><br/>
        <small>${item.variantLabel}</small>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
    </tr>
  `).join("");

  return `
    <div style="font-family: sans-serif; max-w-xl; margin: 0 auto; color: #333;">
      <h2 style="color: #059669;">Order Confirmed!</h2>
      <p>Hi ${customerName},</p>
      <p>Thank you for your order. We are currently processing it.</p>
      
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <strong>Order Number:</strong> ${orderNumber}
      </div>

      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 10px; text-align: left;">Item</th>
            <th style="padding: 10px; text-align: center;">Qty</th>
            <th style="padding: 10px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
            <td style="padding: 10px; text-align: right; font-weight: bold;">₹${totalAmount}</td>
          </tr>
        </tfoot>
      </table>

      <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
        You will receive another update when your order is out for delivery.
      </p>
    </div>
  `;
}
