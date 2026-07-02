// lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { sendMail } from "./mailer";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    // ✅ Fix 1: Actually send the password-reset email via Gmail SMTP
    sendResetPassword: async ({ user, url }) => {
      await sendMail({
        to: user.email,
        subject: "Reset your General Store password",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h2 style="color: #2563eb;">Reset Your Password</h2>
            <p>Hi ${user.name || "there"},</p>
            <p>We received a request to reset your password. Click the button below to choose a new one.</p>
            <a href="${url}" style="display:inline-block; margin: 20px 0; padding: 12px 24px; background:#2563eb; color:#fff; border-radius:6px; text-decoration:none; font-weight:bold;">
              Reset Password
            </a>
            <p style="color:#6b7280; font-size:13px;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
            <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;" />
            <p style="color:#9ca3af; font-size:12px;">© ${new Date().getFullYear()} General Store</p>
          </div>
        `,
      });
    },
  },

  // ✅ Fix 2: Send verification email on signup
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendMail({
        to: user.email,
        subject: "Verify your General Store email",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h2 style="color: #2563eb;">Verify Your Email Address</h2>
            <p>Hi ${user.name || "there"},</p>
            <p>Thanks for signing up! Please verify your email address to activate your account.</p>
            <a href="${url}" style="display:inline-block; margin: 20px 0; padding: 12px 24px; background:#2563eb; color:#fff; border-radius:6px; text-decoration:none; font-weight:bold;">
              Verify Email
            </a>
            <p style="color:#6b7280; font-size:13px;">If you didn't create an account with General Store, please ignore this email.</p>
            <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;" />
            <p style="color:#9ca3af; font-size:12px;">© ${new Date().getFullYear()} General Store</p>
          </div>
        `,
      });
    },
    autoSignInAfterVerification: true,
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        input: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      isBlocked: {
        type: "boolean",
        defaultValue: false,
        input: false,
      },
    },
  },
});

// Export the auth type for use in other files
export type Session = typeof auth.$Infer.Session;
