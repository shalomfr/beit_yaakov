import { NextRequest, NextResponse } from "next/server";
import { TransferService } from "@/services/transfer.service";

/**
 * PUT /api/transfers/[id]/cancel
 * Cancel a transfer
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const transfer = await TransferService.cancelTransfer(params.id);

    return NextResponse.json({
      success: true,
      data: transfer,
      message: "Transfer cancelled successfully",
    });
  } catch (error: any) {
    console.error(`PUT /api/transfers/${params.id}/cancel error:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to cancel transfer",
      },
      { status: error.message === "Transfer not found" ? 404 : 400 }
    );
  }
}
