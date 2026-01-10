import { NextRequest, NextResponse } from "next/server";
import { TransferService } from "@/services/transfer.service";

/**
 * PUT /api/transfers/[id]/complete
 * Complete a transfer (update balances)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const transfer = await TransferService.completeTransfer(params.id);

    return NextResponse.json({
      success: true,
      data: transfer,
      message: "Transfer completed successfully",
    });
  } catch (error: any) {
    console.error(`PUT /api/transfers/${params.id}/complete error:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to complete transfer",
      },
      { status: error.message === "Transfer not found" ? 404 : 400 }
    );
  }
}
