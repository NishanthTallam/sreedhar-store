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

const STORE_NAME = "Sreedhar Store";
const STORE_ADDRESS = "Bukkapatnam, Puttaparthi, Andhra Pradesh";
const STORE_EMAIL = "tallamnishanth@gmail.com";
const STORE_PHONE = "+91 7989102722";

/**
 * Base Email Template for Sreedhar Store
 */
function getBaseEmailTemplate(title: string, content: string, ctaHtml?: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; color: #18181b; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f4f4f5; padding: 40px 0; }
        .main { background-color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .header { background-color: #2563eb; padding: 32px 40px; text-align: center; }
        .header-logo { color: #ffffff; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.5px; text-decoration: none; }
        .content { padding: 40px; }
        .title { font-size: 24px; font-weight: 700; color: #18181b; margin-top: 0; margin-bottom: 24px; }
        .body-text { font-size: 16px; line-height: 1.6; color: #3f3f46; margin: 0 0 24px 0; }
        .body-text p { margin: 0 0 16px 0; }
        .cta-container { margin: 32px 0; text-align: center; }
        .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; font-weight: 600; font-size: 16px; text-decoration: none; padding: 14px 28px; border-radius: 6px; text-align: center; }
        .footer { background-color: #f8fafc; padding: 32px 40px; text-align: center; border-top: 1px solid #e2e8f0; }
        .footer-text { font-size: 14px; color: #64748b; line-height: 1.5; margin: 0 0 8px 0; }
        .footer-link { color: #2563eb; text-decoration: none; }
        .socials { margin-top: 16px; }
        .socials a { color: #64748b; text-decoration: none; margin: 0 8px; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="main">
          <div class="header">
            <a href="https://sreedharstore.com" class="header-logo">${STORE_NAME}</a>
          </div>
          <div class="content">
            <h1 class="title">${title}</h1>
            <div class="body-text">
              ${content}
            </div>
            ${ctaHtml ? `<div class="cta-container">${ctaHtml}</div>` : ''}
            <div class="body-text" style="margin-top: 32px;">
              <p>Best regards,<br>The ${STORE_NAME} Team</p>
            </div>
          </div>
          <div class="footer">
            <p class="footer-text">
              <strong>${STORE_NAME}</strong><br>
              ${STORE_ADDRESS}<br>
              <a href="mailto:${STORE_EMAIL}" class="footer-link">${STORE_EMAIL}</a> | ${STORE_PHONE}
            </p>
            <p class="footer-text" style="margin-top: 24px; font-size: 12px;">
              &copy; ${new Date().getFullYear()} ${STORE_NAME}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send an email using the configured SMTP transport.
 * Should only be called from server actions / API routes, never from the client.
 */
export async function sendMail({ to, subject, html }: SendMailOptions) {
  const from = process.env.SMTP_FROM_EMAIL || "noreply@sreedharstore.com";

  try {
    const info = await transporter.sendMail({
      from: `"${STORE_NAME}" <${from}>`,
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

// ----------------------------------------------------------------------
// TRANSACTIONAL EMAIL TEMPLATES
// ----------------------------------------------------------------------

export async function sendWelcomeEmail(to: string, name: string) {
  const content = `
    <p>Hi ${name},</p>
    <p>Welcome to ${STORE_NAME}! We're absolutely thrilled to have you join our community.</p>
    <p>Discover our wide range of products tailored just for you. If you need any assistance, our support team is always here to help.</p>
  `;
  const cta = `<a href="https://sreedharstore.com/shop" class="btn">Start Shopping</a>`;
  return sendMail({ to, subject: `Welcome to ${STORE_NAME}!`, html: getBaseEmailTemplate("Welcome Aboard!", content, cta) });
}

export async function sendEmailVerification(to: string, name: string, verifyUrl: string) {
  const content = `
    <p>Hi ${name},</p>
    <p>Please verify your email address to complete your registration and unlock all features of your ${STORE_NAME} account.</p>
    <p>This link will expire in 24 hours.</p>
  `;
  const cta = `<a href="${verifyUrl}" class="btn">Verify Email Address</a>`;
  return sendMail({ to, subject: "Verify Your Email", html: getBaseEmailTemplate("Verify Your Email", content, cta) });
}

export async function sendOtpVerification(to: string, name: string, otpCode: string) {
  const content = `
    <p>Hi ${name},</p>
    <p>Your One-Time Password (OTP) for verification is:</p>
    <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; margin: 24px 0;">
      <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #0f172a;">${otpCode}</span>
    </div>
    <p>Please enter this code on the verification page. Do not share this code with anyone.</p>
  `;
  return sendMail({ to, subject: "Your Verification Code", html: getBaseEmailTemplate("Verification Code", content) });
}

export async function sendPasswordReset(to: string, name: string, resetUrl: string) {
  const content = `
    <p>Hi ${name},</p>
    <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
    <p>To reset your password, click the button below:</p>
  `;
  const cta = `<a href="${resetUrl}" class="btn">Reset Password</a>`;
  return sendMail({ to, subject: "Reset Your Password", html: getBaseEmailTemplate("Password Reset Request", content, cta) });
}

export async function sendPasswordChanged(to: string, name: string) {
  const content = `
    <p>Hi ${name},</p>
    <p>Your password has been successfully updated.</p>
    <p>If you did not make this change, please contact our support team immediately.</p>
  `;
  return sendMail({ to, subject: "Password Updated Successfully", html: getBaseEmailTemplate("Password Updated", content) });
}

export async function sendAccountCreated(to: string, name: string) {
  const content = `
    <p>Hi ${name},</p>
    <p>Your account at ${STORE_NAME} has been successfully created by an administrator.</p>
    <p>You can now log in and manage your profile.</p>
  `;
  const cta = `<a href="https://sreedharstore.com/login" class="btn">Log In Now</a>`;
  return sendMail({ to, subject: "Your Account is Ready", html: getBaseEmailTemplate("Account Created", content, cta) });
}

export async function sendProfileUpdated(to: string, name: string) {
  const content = `
    <p>Hi ${name},</p>
    <p>We're writing to let you know that your profile information has been successfully updated.</p>
  `;
  return sendMail({ to, subject: "Profile Updated", html: getBaseEmailTemplate("Profile Updated", content) });
}

export async function sendOrderConfirmation(to: string, name: string, orderNumber: string, amount: string) {
  const content = `
    <p>Hi ${name},</p>
    <p>Thank you for your order! We've received your order <strong>#${orderNumber}</strong> and are getting it ready for you.</p>
    <p><strong>Total Amount:</strong> ₹${amount}</p>
    <p>We will notify you once your order ships.</p>
  `;
  const cta = `<a href="https://sreedharstore.com/account/orders/${orderNumber}" class="btn">View Order Status</a>`;
  return sendMail({ to, subject: `Order Confirmation - #${orderNumber}`, html: getBaseEmailTemplate("Order Confirmed", content, cta) });
}

export async function sendOrderStatusEmail(to: string, orderNumber: string, status: string, customerName: string) {
  const formattedStatus = status.replace(/_/g, " ");
  const content = `
    <p>Hi ${customerName},</p>
    <p>Your order <strong>#${orderNumber}</strong> has been updated.</p>
    <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px; margin: 24px 0;">
      <p style="margin: 0; color: #1e3a8a;">New Status: <strong>${formattedStatus.toUpperCase()}</strong></p>
    </div>
  `;
  const cta = `<a href="https://sreedharstore.com/account/orders/${orderNumber}" class="btn">Track Order</a>`;
  return sendMail({ to, subject: `Order Update: #${orderNumber} is now ${formattedStatus}`, html: getBaseEmailTemplate("Order Status Update", content, cta) });
}

export async function sendOrderCancelled(to: string, name: string, orderNumber: string) {
  const content = `
    <p>Hi ${name},</p>
    <p>Your order <strong>#${orderNumber}</strong> has been cancelled.</p>
    <p>If you have already paid, your refund will be processed shortly.</p>
  `;
  return sendMail({ to, subject: `Order Cancelled - #${orderNumber}`, html: getBaseEmailTemplate("Order Cancelled", content) });
}

export async function sendRefundInitiated(to: string, name: string, orderNumber: string, amount: string) {
  const content = `
    <p>Hi ${name},</p>
    <p>We have initiated a refund of <strong>₹${amount}</strong> for your order <strong>#${orderNumber}</strong>.</p>
    <p>It may take 5-7 business days for the amount to reflect in your original payment method.</p>
  `;
  return sendMail({ to, subject: `Refund Initiated for Order #${orderNumber}`, html: getBaseEmailTemplate("Refund Initiated", content) });
}

export async function sendRefundCompleted(to: string, name: string, orderNumber: string, amount: string) {
  const content = `
    <p>Hi ${name},</p>
    <p>Your refund of <strong>₹${amount}</strong> for order <strong>#${orderNumber}</strong> has been successfully completed.</p>
  `;
  return sendMail({ to, subject: `Refund Completed for Order #${orderNumber}`, html: getBaseEmailTemplate("Refund Completed", content) });
}

export async function sendInvoiceEmail(to: string, name: string, orderNumber: string, invoiceUrl: string) {
  const content = `
    <p>Hi ${name},</p>
    <p>Your invoice for order <strong>#${orderNumber}</strong> is ready to view and download.</p>
  `;
  const cta = `<a href="${invoiceUrl}" class="btn">Download Invoice</a>`;
  return sendMail({ to, subject: `Your Invoice for Order #${orderNumber}`, html: getBaseEmailTemplate("Invoice Available", content, cta) });
}

export async function sendContactFormConfirmation(to: string, name: string) {
  const content = `
    <p>Hi ${name},</p>
    <p>We have successfully received your enquiry. One of our support representatives will get back to you as soon as possible.</p>
    <p>Thank you for reaching out to us!</p>
  `;
  return sendMail({ to, subject: "We received your message", html: getBaseEmailTemplate("Message Received", content) });
}

export async function sendAdminContactNotification(adminEmail: string, userName: string, message: string) {
  const content = `
    <p>A new contact enquiry has been submitted by <strong>${userName}</strong>.</p>
    <div style="background-color: #f1f5f9; padding: 16px; border-radius: 4px; margin: 24px 0;">
      <p style="margin: 0; font-style: italic;">"${message}"</p>
    </div>
  `;
  const cta = `<a href="https://sreedharstore.com/admin/enquiries" class="btn">View Enquiries</a>`;
  return sendMail({ to: adminEmail, subject: "New Contact Enquiry Received", html: getBaseEmailTemplate("New Enquiry", content, cta) });
}

export async function sendNewsletterSubscription(to: string) {
  const content = `
    <p>Hi there,</p>
    <p>Thank you for subscribing to our newsletter! You'll be the first to know about our latest products, exclusive offers, and store updates.</p>
  `;
  const cta = `<a href="https://sreedharstore.com" class="btn">Explore Store</a>`;
  return sendMail({ to, subject: `Welcome to the ${STORE_NAME} Newsletter!`, html: getBaseEmailTemplate("Subscription Confirmed", content, cta) });
}

export async function sendCouponReceived(to: string, name: string, couponCode: string, discountDesc: string) {
  const content = `
    <p>Hi ${name},</p>
    <p>We're sending a special gift your way! Enjoy <strong>${discountDesc}</strong> on your next purchase.</p>
    <div style="background-color: #fce7f3; border: 2px dashed #db2777; padding: 20px; border-radius: 8px; text-align: center; margin: 24px 0;">
      <span style="font-size: 24px; font-weight: 700; color: #be185d;">${couponCode}</span>
    </div>
    <p>Apply this code at checkout to claim your discount.</p>
  `;
  const cta = `<a href="https://sreedharstore.com" class="btn">Shop Now</a>`;
  return sendMail({ to, subject: "You received a special coupon!", html: getBaseEmailTemplate("Special Offer", content, cta) });
}

export async function sendPromotionalOffer(to: string, title: string, description: string, url: string) {
  const content = `
    <p>Hi there,</p>
    <p>${description}</p>
  `;
  const cta = `<a href="${url}" class="btn">Check it out</a>`;
  return sendMail({ to, subject: title, html: getBaseEmailTemplate(title, content, cta) });
}

export async function sendLowStockAlert(adminEmail: string, productName: string, stock: number) {
  const content = `
    <p>Hello Admin,</p>
    <p>The following product is running critically low on stock:</p>
    <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 4px; margin: 24px 0;">
      <p style="margin: 0;"><strong>${productName}</strong> - Only ${stock} units remaining!</p>
    </div>
    <p>Please restock this item soon to avoid out-of-stock scenarios.</p>
  `;
  const cta = `<a href="https://sreedharstore.com/admin/inventory" class="btn">Manage Inventory</a>`;
  return sendMail({ to: adminEmail, subject: `Low Stock Alert: ${productName}`, html: getBaseEmailTemplate("Inventory Alert", content, cta) });
}

export async function sendPaymentSuccess(to: string, name: string, amount: string, transactionId: string) {
  const content = `
    <p>Hi ${name},</p>
    <p>We successfully received your payment of <strong>₹${amount}</strong>.</p>
    <p><strong>Transaction ID:</strong> ${transactionId}</p>
    <p>Thank you for your purchase.</p>
  `;
  return sendMail({ to, subject: "Payment Successful", html: getBaseEmailTemplate("Payment Received", content) });
}

export async function sendPaymentFailed(to: string, name: string, orderNumber: string) {
  const content = `
    <p>Hi ${name},</p>
    <p>Unfortunately, your recent payment attempt for order <strong>#${orderNumber}</strong> has failed.</p>
    <p>Please try again or use a different payment method to complete your purchase.</p>
  `;
  const cta = `<a href="https://sreedharstore.com/account/orders/${orderNumber}" class="btn">Retry Payment</a>`;
  return sendMail({ to, subject: "Payment Failed", html: getBaseEmailTemplate("Payment Failed", content, cta) });
}
