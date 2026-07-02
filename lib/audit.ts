// lib/audit.ts
import { prisma } from "./prisma";

interface AuditLogInput {
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown> | null;
}

/**
 * Write an entry to the AuditLog table.
 *
 * Call this from every admin mutation (product CRUD, order status changes,
 * settings updates, etc.) so the admin Audit Logs screen has real data.
 *
 * @example
 * await writeAuditLog({
 *   userId: session.user.id,
 *   action: "PRODUCT_CREATED",
 *   entityType: "Product",
 *   entityId: product.id,
 *   metadata: { name: product.name },
 * });
 */
export async function writeAuditLog({
  userId,
  action,
  entityType,
  entityId,
  metadata,
}: AuditLogInput) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId ?? null,
        action,
        entityType,
        entityId: entityId ?? null,
        metadata: (metadata ?? undefined) as import("@prisma/client").Prisma.InputJsonValue | undefined,
      },
    });
  } catch (error) {
    // Audit logging should never crash the main operation.
    // Log the error but don't throw.
    console.error("[AuditLog] Failed to write audit log:", error);
  }
}
