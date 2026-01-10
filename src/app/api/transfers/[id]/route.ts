import { NextRequest, NextResponse } from "next/server";
import { TransferService } from "@/services/transfer.service";

/**
 * GET /api/transfers/[id]
 * Get a single transfer by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const transfer = await TransferService.getTransferById(params.id);

    return NextResponse.json({
      success: true,
      data: transfer,
    });
  } catch (error: any) {
    console.error(`GET /api/transfers/${params.id} error:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch transfer",
      },
      { status: error.message === "Transfer not found" ? 404 : 500 }
    );
  }
}
