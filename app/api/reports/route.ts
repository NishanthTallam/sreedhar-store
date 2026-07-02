import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Stub response for API route: app/api/reports/route.ts",
    status: 200
  });
}