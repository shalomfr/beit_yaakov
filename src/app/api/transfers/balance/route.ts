import { NextResponse } from "next/server";
import { TransferService } from "@/services/transfer.service";

/**
 * GET /api/transfers/balance
 * Get balance summary between frameworks
 */
export async function GET() {
  try {
    const summary = await TransferService.getBalanceSummary();

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (error: any) {
    console.error("GET /api/transfers/balance error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch balance summary",
      },
      { status: 500 }
    );
  }
}
