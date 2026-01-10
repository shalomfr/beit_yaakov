import { NextRequest, NextResponse } from "next/server";
import { TransferService } from "@/services/transfer.service";

/**
 * PUT /api/transfers/[id]/complete
 * Complete a transfer (update balances)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const transfer = await TransferService.completeTransfer(id);

    return NextResponse.json({
      success: true,
      data: transfer,
      message: "Transfer completed successfully",
    });
  } catch (error: any) {
    const { id } = await params;
    console.error(`PUT /api/transfers/${id}/complete error:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to complete transfer",
      },
      { status: error.message === "Transfer not found" ? 404 : 400 }
    );
  }
}
