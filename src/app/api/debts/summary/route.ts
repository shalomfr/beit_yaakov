import { NextResponse } from "next/server";
import { DebtService } from "@/services/debt.service";

/**
 * GET /api/debts/summary
 * Get debt summary statistics
 */
export async function GET() {
  try {
    const summary = await DebtService.getSummary();

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (error: any) {
    console.error("GET /api/debts/summary error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch debt summary",
      },
      { status: 500 }
    );
  }
}
