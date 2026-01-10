import { NextRequest, NextResponse } from "next/server";
import { TransferService } from "@/services/transfer.service";

/**
 * GET /api/transfers
 * Get all transfers
 */
export async function GET() {
  try {
    const transfers = await TransferService.getTransfers();

    return NextResponse.json({
      success: true,
      data: transfers,
      count: transfers.length,
    });
  } catch (error: any) {
    console.error("GET /api/transfers error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch transfers",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/transfers
 * Create a new transfer
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.sourceFrameworkId || !body.targetFrameworkId || !body.amount || !body.description || !body.transferDate) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: sourceFrameworkId, targetFrameworkId, amount, description, transferDate",
        },
        { status: 400 }
      );
    }

    // Validate amount is positive
    if (body.amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Amount must be greater than 0",
        },
        { status: 400 }
      );
    }

    const transfer = await TransferService.createTransfer({
      sourceFrameworkId: body.sourceFrameworkId,
      targetFrameworkId: body.targetFrameworkId,
      amount: parseFloat(body.amount),
      description: body.description,
      transferDate: new Date(body.transferDate),
    });

    return NextResponse.json(
      {
        success: true,
        data: transfer,
        message: "Transfer created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/transfers error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create transfer",
      },
      { status: 400 }
    );
  }
}
