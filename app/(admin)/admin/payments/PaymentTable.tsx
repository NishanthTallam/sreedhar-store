"use client";

import { useState, useTransition } from "react";
import { updatePaymentStatus } from "./actions";
import { CheckCircle, Clock, XCircle, RefreshCcw } from "lucide-react";

interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: string;
  status: string;
  createdAt: Date;
  order: { orderNumber: string };
}

export function PaymentTable({ payments }: { payments: Payment[] }) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (id: string, status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED") => {
    startTransition(() => {
      updatePaymentStatus(id, status);
    });
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "COMPLETED": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "PENDING": return <Clock className="w-4 h-4 text-yellow-500" />;
      case "FAILED": return <XCircle className="w-4 h-4 text-red-500" />;
      case "REFUNDED": return <RefreshCcw className="w-4 h-4 text-blue-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "COMPLETED": return "bg-green-50 text-green-700 border-green-200";
      case "PENDING": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "FAILED": return "bg-red-50 text-red-700 border-red-200";
      case "REFUNDED": return "bg-blue-50 text-blue-700 border-blue-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500">
              <th className="py-4 px-6">Order</th>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6">Method</th>
              <th className="py-4 px-6">Amount</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">No payments found.</td>
              </tr>
            ) : (
              payments.map(payment => (
                <tr key={payment.id} className="hover:bg-gray-50/50">
                  <td className="py-4 px-6 font-medium text-gray-900">{payment.order.orderNumber}</td>
                  <td className="py-4 px-6 text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium uppercase tracking-wider">
                      {payment.method}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-900">
                    ${Number(payment.amount).toFixed(2)}
                  </td>
                  <td className="py-4 px-6">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      {payment.status}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    {payment.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleStatusChange(payment.id, "COMPLETED")}
                          disabled={isPending}
                          className="text-sm text-green-600 hover:text-green-800 font-medium px-3 py-1 rounded hover:bg-green-50 transition-colors"
                        >
                          Mark Paid
                        </button>
                        <button
                          onClick={() => handleStatusChange(payment.id, "FAILED")}
                          disabled={isPending}
                          className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
                        >
                          Failed
                        </button>
                      </>
                    )}
                    {payment.status === "COMPLETED" && (
                      <button
                        onClick={() => handleStatusChange(payment.id, "REFUNDED")}
                        disabled={isPending}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
