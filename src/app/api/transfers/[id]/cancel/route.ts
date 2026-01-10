import { NextRequest, NextResponse } from "next/server";
import { TransferService } from "@/services/transfer.service";

/**
 * PUT /api/transfers/[id]/cancel
 * Cancel a transfer
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const transfer = await TransferService.cancelTransfer(id);

    return NextResponse.json({
      success: true,
      data: transfer,
      message: "Transfer cancelled successfully",
    });
  } catch (error: any) {
    const { id } = await params;
    console.error(`PUT /api/transfers/${id}/cancel error:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to cancel transfer",
      },
      { status: error.message === "Transfer not found" ? 404 : 400 }
    );
  }
}
