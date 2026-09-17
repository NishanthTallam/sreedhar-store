// lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { sendMail, sendPasswordReset as sendPasswordResetEmail, sendEmailVerification } from "./mailer";

export const auth = betterAuth({
  trustedOrigins: [
    "http://localhost:3000",
    "https://sreedhar-store.vercel.app",
    process.env.NEXT_PUBLIC_APP_URL || "",
    process.env.BETTER_AUTH_URL || ""
  ].filter(Boolean) as string[],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail(user.email, user.name || "there", url);
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmailVerification(user.email, user.name || "there", url);
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
