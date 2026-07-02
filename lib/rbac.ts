// lib/rbac.ts
import { auth } from "./auth";
import { headers } from "next/headers";

/**
 * Get the current authenticated session user, or null if not authenticated.
 */
export async function getSessionUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch {
    return null;
  }
}

/**
 * Require authentication. Throws if no valid session exists.
 */
export async function requireAuth() {
  const session = await getSessionUser();
  if (!session) {
    throw new Error("Unauthorized: You must be logged in.");
  }
  return session;
}

/**
 * Require CUSTOMER role. Throws if user is not a customer.
 */
export async function requireCustomer() {
  const session = await requireAuth();
  if ((session.user as Record<string, unknown>).role !== "CUSTOMER") {
    throw new Error("Forbidden: Customer access required.");
  }
  return session;
}

/**
 * Require ADMIN role. Throws if user is not an admin.
 */
export async function requireAdmin() {
  const session = await requireAuth();
  if ((session.user as Record<string, unknown>).role !== "ADMIN") {
    throw new Error("Forbidden: Admin access required.");
  }
  return session;
}

/**
 * Require DELIVERY_BOY role. Throws if user is not a delivery boy.
 */
export async function requireDeliveryBoy() {
  const session = await requireAuth();
  if ((session.user as Record<string, unknown>).role !== "DELIVERY_BOY") {
    throw new Error("Forbidden: Delivery boy access required.");
  }
  return session;
}

/**
 * Check if the current user has a specific role without throwing.
 */
export async function hasRole(role: "CUSTOMER" | "ADMIN" | "DELIVERY_BOY") {
  const session = await getSessionUser();
  if (!session) return false;
  return (session.user as Record<string, unknown>).role === role;
}
