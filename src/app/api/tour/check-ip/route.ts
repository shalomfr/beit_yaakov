import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/tour/check-ip
 * Check if the visitor's IP has seen the tour
 */
export async function GET(request: NextRequest) {
  try {
    // Get IP from headers (works with proxies like Render, Vercel, etc.)
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";

    // Check if this IP has seen the tour
    const visitor = await prisma.tourVisitor.findUnique({
      where: { ipAddress: ip },
    });

    // If visitor exists and has seen tour, don't show it
    if (visitor?.seenTour) {
      return NextResponse.json({
        success: true,
        shouldShowTour: false,
        ip,
      });
    }

    // New visitor or hasn't seen tour - show it
    return NextResponse.json({
      success: true,
      shouldShowTour: true,
      ip,
    });
  } catch (error: any) {
    console.error("GET /api/tour/check-ip error:", error);
    // On error, default to not showing tour to avoid annoying users
    return NextResponse.json({
      success: false,
      shouldShowTour: false,
      error: error.message,
    });
  }
}
