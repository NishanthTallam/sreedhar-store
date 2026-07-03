"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markPaymentAsCompleted(paymentId: string) {
  await prisma.payment.update({
    where: { id: paymentId },
    data: { status: "COMPLETED" }
  });
  revalidatePath("/admin/payments");
}

export async function updatePaymentStatus(paymentId: string, status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED") {
  await prisma.payment.update({
    where: { id: paymentId },
    data: { status }
  });
  revalidatePath("/admin/payments");
}
