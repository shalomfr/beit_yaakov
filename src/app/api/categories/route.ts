import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/categories
 * Get all active categories
 */
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error: any) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch categories",
      },
      { status: 500 }
    );
  }
}
