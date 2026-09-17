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
const BRAND_COLOR = "#2563eb";
const BRAND_DARK = "#1d4ed8";

/**
 * Email-safe CTA button using table-based layout.
 * This pattern works reliably across all email clients including iOS Mail, Gmail, Outlook.
 */
function getCtaButton(href: string, text: string) {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 0 auto;">
      <tr>
        <td align="center" style="border-radius: 8px; background: ${BRAND_COLOR};">
          <a href="${href}" target="_blank" rel="noopener noreferrer" style="display: block; padding: 16px 36px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 8px; text-align: center; mso-padding-alt: 0;">
            ${text}
          </a>
        </td>
      </tr>
    </table>
    <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 16px 0 0; line-height: 1.5;">
      If the button doesn't work, copy and paste this link into your browser:<br/>
      <a href="${href}" style="color: ${BRAND_COLOR}; word-break: break-all;">${href}</a>
    </p>
  `;
}

/**
 * Premium Email Template for Sreedhar Store
 * Uses table-based layout for maximum email client compatibility (including iOS Mail).
 */
function getBaseEmailTemplate(title: string, content: string, ctaHtml?: string) {
  return `
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="x-apple-disable-message-reformatting">
      <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
      <title>${title}</title>
      <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <![endif]-->
      <style>
        /* Reset */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f1f5f9; }
        a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
        /* iOS Blue Links */
        a { color: ${BRAND_COLOR}; }
        /* Responsive */
        @media only screen and (max-width: 620px) {
          .email-container { width: 100% !important; margin: auto !important; }
          .fluid { max-width: 100% !important; height: auto !important; margin-left: auto !important; margin-right: auto !important; }
          .stack-column { display: block !important; width: 100% !important; max-width: 100% !important; }
          .content-padding { padding: 24px 20px !important; }
          .header-padding { padding: 28px 20px !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <!-- Visually Hidden Preview Text -->
      <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all;">
        ${title} - ${STORE_NAME}
      </div>

      <!-- Full Width Wrapper -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f1f5f9;">
        <tr>
          <td align="center" style="padding: 32px 16px;">

            <!-- Email Container -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">

              <!-- Header -->
              <tr>
                <td class="header-padding" style="background: linear-gradient(135deg, ${BRAND_COLOR} 0%, ${BRAND_DARK} 100%); padding: 36px 40px; text-align: center;">
                  <!-- Logo Icon -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                    <tr>
                      <td style="padding-right: 12px; vertical-align: middle;">
                        <img src="https://sreedharstore.com/Sreedhar-store.svg" alt="Logo" width="40" height="40" style="display: block; width: 40px; height: 40px; border: 0; outline: none; text-decoration: none;" />
                      </td>
                      <td style="vertical-align: middle;">
                        <span style="font-size: 24px; font-weight: 800; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; text-decoration: none; letter-spacing: -0.5px;">
                          ${STORE_NAME}
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td class="content-padding" style="padding: 40px 40px 16px;">
                  <h1 style="margin: 0 0 24px; font-size: 24px; font-weight: 700; color: #0f172a; line-height: 1.3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                    ${title}
                  </h1>
                  <div style="font-size: 15px; line-height: 1.7; color: #475569; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                    ${content}
                  </div>
                </td>
              </tr>

              <!-- CTA Button -->
              ${ctaHtml ? `
              <tr>
                <td class="content-padding" style="padding: 8px 40px 32px;">
                  ${ctaHtml}
                </td>
              </tr>
              ` : ''}

              <!-- Sign-off -->
              <tr>
                <td class="content-padding" style="padding: 8px 40px 32px;">
                  <p style="font-size: 15px; line-height: 1.7; color: #475569; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                    Best regards,<br/>
                    <strong style="color: #0f172a;">The ${STORE_NAME} Team</strong>
                  </p>
                </td>
              </tr>

              <!-- Divider -->
              <tr>
                <td style="padding: 0 40px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td style="border-top: 1px solid #e2e8f0;"></td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td class="content-padding" style="padding: 28px 40px 32px; text-align: center;">
                  <p style="margin: 0 0 6px; font-size: 14px; font-weight: 600; color: #334155; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                    ${STORE_NAME}
                  </p>
                  <p style="margin: 0 0 16px; font-size: 13px; color: #94a3b8; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                    ${STORE_ADDRESS}
                  </p>
                  <p style="margin: 0 0 16px; font-size: 13px; color: #94a3b8; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                    <a href="mailto:${STORE_EMAIL}" style="color: ${BRAND_COLOR}; text-decoration: none;">${STORE_EMAIL}</a>
                    &nbsp;&middot;&nbsp;
                    ${STORE_PHONE}
                  </p>
                  <p style="margin: 0; font-size: 12px; color: #cbd5e1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                    &copy; ${new Date().getFullYear()} ${STORE_NAME}. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
            <!-- /Email Container -->

          </td>
        </tr>
      </table>
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
  const cta = getCtaButton("https://sreedharstore.com/shop", "Start Shopping");
  return sendMail({ to, subject: `Welcome to ${STORE_NAME}!`, html: getBaseEmailTemplate("Welcome Aboard!", content, cta) });
}

export async function sendEmailVerification(to: string, name: string, verifyUrl: string) {
  const content = `
    <p>Hi ${name},</p>
    <p>Please verify your email address to complete your registration and unlock all features of your ${STORE_NAME} account.</p>
    <p>This link will expire in 24 hours.</p>
  `;
  const cta = getCtaButton(verifyUrl, "Verify Email Address");
  return sendMail({ to, subject: "Verify Your Email", html: getBaseEmailTemplate("Verify Your Email", content, cta) });
}

export async function sendOtpVerification(to: string, name: string, otpCode: string) {
  const content = `
    <p>Hi ${name},</p>
    <p>Your One-Time Password (OTP) for verification is:</p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td style="background-color: #f1f5f9; padding: 24px; border-radius: 12px; text-align: center;">
          <span style="font-size: 36px; font-weight: 700; letter-spacing: 10px; color: #0f172a; font-family: 'Courier New', monospace;">${otpCode}</span>
        </td>
      </tr>
    </table>
    <p style="margin-top: 16px;">Please enter this code on the verification page. Do not share this code with anyone.</p>
  `;
  return sendMail({ to, subject: "Your Verification Code", html: getBaseEmailTemplate("Verification Code", content) });
}

export async function sendPasswordReset(to: string, name: string, resetUrl: string) {
  const content = `
    <p>Hi ${name},</p>
    <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
    <p>To reset your password, click the button below:</p>
  `;
  const cta = getCtaButton(resetUrl, "Reset Password");
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
  const cta = getCtaButton("https://sreedharstore.com/login", "Log In Now");
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
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td style="background-color: #eff6ff; border-left: 4px solid ${BRAND_COLOR}; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 16px 0;">
          <p style="margin: 0; font-size: 14px; color: #1e3a8a;"><strong>Order Number:</strong> #${orderNumber}</p>
          <p style="margin: 4px 0 0; font-size: 14px; color: #1e3a8a;"><strong>Total Amount:</strong> ₹${amount}</p>
        </td>
      </tr>
    </table>
    <p>We will notify you once your order ships.</p>
  `;
  const cta = getCtaButton(`https://sreedharstore.com/account/orders/${orderNumber}`, "View Order Status");
  return sendMail({ to, subject: `Order Confirmation - #${orderNumber}`, html: getBaseEmailTemplate("Order Confirmed", content, cta) });
}

export async function sendOrderStatusEmail(to: string, orderNumber: string, status: string, customerName: string) {
  const formattedStatus = status.replace(/_/g, " ");
  const content = `
    <p>Hi ${customerName},</p>
    <p>Your order <strong>#${orderNumber}</strong> has been updated.</p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px 20px; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; color: #1e3a8a; font-size: 14px;">New Status: <strong>${formattedStatus.toUpperCase()}</strong></p>
        </td>
      </tr>
    </table>
  `;
  const cta = getCtaButton(`https://sreedharstore.com/account/orders/${orderNumber}`, "Track Order");
  return sendMail({ to, subject: `Order Update: #${orderNumber} is now ${formattedStatus}`, html: getBaseEmailTemplate("Order Status Update", content, cta) });
}

export async function sendOrderCancelled(to: string, name: string, orderNumber: string) {
  const content = `
    <p>Hi ${name},</p>
    <p>Your order <strong>#${orderNumber}</strong> has been successfully cancelled as requested.</p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px 20px; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; color: #991b1b; font-size: 14px;"><strong>Order Number:</strong> #${orderNumber}</p>
          <p style="margin: 8px 0 0; color: #991b1b; font-size: 14px;"><strong>Status:</strong> Cancelled</p>
        </td>
      </tr>
    </table>
    <p>If you paid online, your refund will be processed within <strong>5–7 business days</strong> to your original payment method.</p>
    <p>If you have any questions, feel free to reach out to our support team.</p>
  `;
  const cta = getCtaButton("https://sreedharstore.com/account/orders", "View My Orders");
  return sendMail({ to, subject: `Order Cancelled - #${orderNumber}`, html: getBaseEmailTemplate("Order Cancelled", content, cta) });
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
  const cta = getCtaButton(invoiceUrl, "Download Invoice");
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
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td style="background-color: #f1f5f9; padding: 16px 20px; border-radius: 8px;">
          <p style="margin: 0; font-style: italic; color: #475569;">"${message}"</p>
        </td>
      </tr>
    </table>
  `;
  const cta = getCtaButton("https://sreedharstore.com/admin/enquiries", "View Enquiries");
  return sendMail({ to: adminEmail, subject: "New Contact Enquiry Received", html: getBaseEmailTemplate("New Enquiry", content, cta) });
}

export async function sendNewsletterSubscription(to: string) {
  const content = `
    <p>Hi there,</p>
    <p>Thank you for subscribing to our newsletter! You'll be the first to know about our latest products, exclusive offers, and store updates.</p>
  `;
  const cta = getCtaButton("https://sreedharstore.com", "Explore Store");
  return sendMail({ to, subject: `Welcome to the ${STORE_NAME} Newsletter!`, html: getBaseEmailTemplate("Subscription Confirmed", content, cta) });
}

export async function sendCouponReceived(to: string, name: string, couponCode: string, discountDesc: string) {
  const content = `
    <p>Hi ${name},</p>
    <p>We're sending a special gift your way! Enjoy <strong>${discountDesc}</strong> on your next purchase.</p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td style="background-color: #fdf2f8; border: 2px dashed #db2777; padding: 24px; border-radius: 12px; text-align: center;">
          <span style="font-size: 28px; font-weight: 700; color: #be185d; letter-spacing: 4px; font-family: 'Courier New', monospace;">${couponCode}</span>
        </td>
      </tr>
    </table>
    <p>Apply this code at checkout to claim your discount.</p>
  `;
  const cta = getCtaButton("https://sreedharstore.com", "Shop Now");
  return sendMail({ to, subject: "You received a special coupon!", html: getBaseEmailTemplate("Special Offer", content, cta) });
}

export async function sendPromotionalOffer(to: string, title: string, description: string, url: string) {
  const content = `
    <p>Hi there,</p>
    <p>${description}</p>
  `;
  const cta = getCtaButton(url, "Check it out");
  return sendMail({ to, subject: title, html: getBaseEmailTemplate(title, content, cta) });
}

export async function sendLowStockAlert(adminEmail: string, productName: string, stock: number) {
  const content = `
    <p>Hello Admin,</p>
    <p>The following product is running critically low on stock:</p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px 20px; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; font-size: 14px;"><strong>${productName}</strong> - Only ${stock} units remaining!</p>
        </td>
      </tr>
    </table>
    <p>Please restock this item soon to avoid out-of-stock scenarios.</p>
  `;
  const cta = getCtaButton("https://sreedharstore.com/admin/inventory", "Manage Inventory");
  return sendMail({ to: adminEmail, subject: `Low Stock Alert: ${productName}`, html: getBaseEmailTemplate("Inventory Alert", content, cta) });
}

export async function sendPaymentSuccess(to: string, name: string, amount: string, transactionId: string) {
  const content = `
    <p>Hi ${name},</p>
    <p>We successfully received your payment of <strong>₹${amount}</strong>.</p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px 20px; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; font-size: 14px; color: #166534;"><strong>Transaction ID:</strong> ${transactionId}</p>
        </td>
      </tr>
    </table>
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
  const cta = getCtaButton(`https://sreedharstore.com/account/orders/${orderNumber}`, "Retry Payment");
  return sendMail({ to, subject: "Payment Failed", html: getBaseEmailTemplate("Payment Failed", content, cta) });
}
