import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/frameworks
 * Get all frameworks
 */
export async function GET() {
  try {
    const frameworks = await prisma.framework.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: frameworks,
      count: frameworks.length,
    });
  } catch (error: any) {
    console.error("GET /api/frameworks error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch frameworks",
      },
      { status: 500 }
    );
  }
}
