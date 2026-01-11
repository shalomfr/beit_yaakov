import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/tour/mark-seen
 * Mark the visitor's IP as having seen the tour
 */
export async function POST(request: NextRequest) {
  try {
    // Get IP from headers (works with proxies like Render, Vercel, etc.)
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";

    // Upsert visitor record - create if doesn't exist, update if does
    const visitor = await prisma.tourVisitor.upsert({
      where: { ipAddress: ip },
      create: {
        ipAddress: ip,
        seenTour: true,
      },
      update: {
        seenTour: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: visitor,
      message: "Tour marked as seen for this IP",
    });
  } catch (error: any) {
    console.error("POST /api/tour/mark-seen error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to mark tour as seen",
      },
      { status: 500 }
    );
  }
}
