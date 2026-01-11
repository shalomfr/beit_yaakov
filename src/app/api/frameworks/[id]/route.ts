import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/frameworks/:id
 * Get a single framework by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const framework = await prisma.framework.findUnique({
      where: { id },
    });

    if (!framework) {
      return NextResponse.json(
        { success: false, error: "Framework not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: framework,
    });
  } catch (error: any) {
    console.error("GET /api/frameworks/:id error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch framework" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/frameworks/:id
 * Update a framework (name, balance)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { name, currentBalance } = body;

    // Validate at least one field is provided
    if (name === undefined && currentBalance === undefined) {
      return NextResponse.json(
        { success: false, error: "No fields to update" },
        { status: 400 }
      );
    }

    // Validate balance is not negative
    if (currentBalance !== undefined && currentBalance < 0) {
      return NextResponse.json(
        { success: false, error: "Balance cannot be negative" },
        { status: 400 }
      );
    }

    // Check framework exists
    const existing = await prisma.framework.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Framework not found" },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: { name?: string; currentBalance?: number } = {};
    if (name !== undefined) updateData.name = name;
    if (currentBalance !== undefined) updateData.currentBalance = currentBalance;

    const framework = await prisma.framework.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: framework,
    });
  } catch (error: any) {
    console.error("PUT /api/frameworks/:id error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update framework" },
      { status: 500 }
    );
  }
}
