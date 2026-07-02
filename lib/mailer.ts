// lib/mailer.ts
import nodemailer from "nodemailer";

// SMTP transport singleton
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  requireTLS: true,
  tls: { rejectUnauthorized: false }, // handles network proxy cert inspection
});

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send an email using the configured SMTP transport.
 * Should only be called from server actions / API routes, never from the client.
 */
export async function sendMail({ to, subject, html }: SendMailOptions) {
  const from = process.env.SMTP_FROM_EMAIL || "noreply@generalstore.com";

  try {
    const info = await transporter.sendMail({
      from: `"General Store" <${from}>`,
      to,
      subject,
      html,
    });

    console.log(`[Mailer] Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Mailer] Failed to send email to ${to}:`, error);
    return { success: false, error };
  }
}

/**
 * Verify the SMTP connection is working (useful for health checks).
 */
export async function verifyMailerConnection() {
  try {
    await transporter.verify();
    console.log("[Mailer] SMTP connection verified");
    return true;
  } catch (error) {
    console.error("[Mailer] SMTP connection failed:", error);
    return false;
  }
}

/**
 * Send an order status update email
 */
export async function sendOrderStatusEmail(
  to: string,
  orderNumber: string,
  status: string,
  customerName: string
) {
  const subject = `Order Update: #${orderNumber} is now ${status.replace(/_/g, " ")}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">Order Status Update</h2>
      <p>Hi ${customerName},</p>
      <p>Your order <strong>#${orderNumber}</strong> has been updated.</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 0; font-size: 16px;">
          New Status: <strong style="color: #2563eb;">${status.replace(/_/g, " ")}</strong>
        </p>
      </div>
      <p>Thank you for shopping with us!</p>
    </div>
  `;
  
  return sendMail({ to, subject, html });
}

