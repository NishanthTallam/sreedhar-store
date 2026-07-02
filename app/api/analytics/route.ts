import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/rbac";
import { subDays, startOfDay, endOfDay, format } from "date-fns";

export async function GET() {
  try {
    await requireAdmin();

    // 1. KPI Data
    const [totalOrders, pendingOrders, activeCustomers] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "PLACED" } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
    ]);

    const revenueResult = await prisma.order.aggregate({
      where: { status: { notIn: ["CANCELLED", "REJECTED"] } },
      _sum: { totalAmount: true },
    });
    const totalRevenue = revenueResult._sum.totalAmount?.toNumber() || 0;

    // 2. Time-series data for the last 30 days
    const thirtyDaysAgo = subDays(new Date(), 30);
    const recentOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        status: { notIn: ["CANCELLED", "REJECTED"] },
      },
      select: {
        createdAt: true,
        totalAmount: true,
      },
    });

    // Group by day
    const salesByDay = Array.from({ length: 30 }).map((_, i) => {
      const date = subDays(new Date(), 29 - i);
      const dateStr = format(date, "MMM dd");
      return {
        date: dateStr,
        sales: 0,
        orders: 0,
        rawDate: startOfDay(date).getTime(),
      };
    });

    recentOrders.forEach(order => {
      const orderDate = startOfDay(order.createdAt).getTime();
      const dayData = salesByDay.find(d => d.rawDate === orderDate);
      if (dayData) {
        dayData.sales += order.totalAmount.toNumber();
        dayData.orders += 1;
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        kpi: {
          totalOrders,
          pendingOrders,
          activeCustomers,
          totalRevenue,
        },
        chartData: salesByDay.map(({ date, sales, orders }) => ({ date, sales, orders })),
      },
    });
  } catch (error) {
    console.error("[ANALYTICS_GET]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 });
  }
}