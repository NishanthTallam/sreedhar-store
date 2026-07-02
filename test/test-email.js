// test/test-email.js
// Run with: node test/test-email.js

const nodemailer = require("nodemailer");
require("dotenv").config(); // loads .env from project root

// ─── Config (reads from .env) ─────────────────────────────────────────────────
const SMTP_HOST      = process.env.SMTP_HOST      || "smtp.gmail.com";
const SMTP_PORT      = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER      = process.env.SMTP_USER;
const SMTP_PASS      = process.env.SMTP_PASS;
const SMTP_FROM      = process.env.SMTP_FROM_EMAIL || SMTP_USER;

// ─── Change this to the email address you want to send a test mail to ─────────
const TEST_RECIPIENT = SMTP_USER; // sends to yourself by default

// ─── Transport ───────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,     // true for 465 (SSL), false for 587 (TLS)
  requireTLS: true,
  tls: { rejectUnauthorized: false }, // handles network proxy cert issues
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// ─── Test Email HTML ──────────────────────────────────────────────────────────
const html = `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 8px;">
    <h2 style="color: #2563eb; margin-bottom: 8px;">✅ Email Test Successful!</h2>
    <p style="color: #374151;">
      This is a test email from your <strong>General Store</strong> application.
    </p>
    <div style="background: #f3f4f6; padding: 16px; border-radius: 6px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px; color: #6b7280;">Sent from</p>
      <p style="margin: 4px 0 0; font-size: 16px; font-weight: bold; color: #111827;">${SMTP_FROM}</p>
    </div>
    <p style="color: #6b7280; font-size: 13px;">
      Sent at: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
    </p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
    <p style="color: #9ca3af; font-size: 12px;">
      If you received this, your Nodemailer + Gmail SMTP setup is working correctly 🎉
    </p>
  </div>
`;

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("──────────────────────────────────────────");
  console.log("  General Store — Email Test");
  console.log("──────────────────────────────────────────");
  console.log(`  SMTP Host : ${SMTP_HOST}`);
  console.log(`  SMTP Port : ${SMTP_PORT}`);
  console.log(`  From      : ${SMTP_FROM}`);
  console.log(`  To        : ${TEST_RECIPIENT}`);
  console.log("──────────────────────────────────────────");

  // 1. Verify SMTP connection
  console.log("\n[1/2] Verifying SMTP connection...");
  try {
    await transporter.verify();
    console.log("      ✅ SMTP connection verified!");
  } catch (err) {
    console.error("      ❌ SMTP connection failed:", err.message);
    process.exit(1);
  }

  // 2. Send test email
  console.log("\n[2/2] Sending test email...");
  try {
    const info = await transporter.sendMail({
      from: `"General Store Test" <${SMTP_FROM}>`,
      to: TEST_RECIPIENT,
      subject: "✅ General Store — Email Test",
      html,
    });
    console.log("      ✅ Email sent successfully!");
    console.log(`      Message ID : ${info.messageId}`);
    console.log(`\n🎉 Check your inbox at: ${TEST_RECIPIENT}`);
  } catch (err) {
    console.error("      ❌ Failed to send email:", err.message);
    process.exit(1);
  }
}

main();
