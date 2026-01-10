import { NextRequest, NextResponse } from "next/server";
import { ExpenseService } from "@/services/expense.service";

/**
 * GET /api/expenses/summary
 * Get expense summary statistics
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const frameworkId = searchParams.get("frameworkId") || undefined;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const summary = await ExpenseService.getSummary(
      frameworkId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (error: any) {
    console.error("GET /api/expenses/summary error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch expense summary",
      },
      { status: 500 }
    );
  }
}
