import { NextRequest, NextResponse } from "next/server";
import { DebtService } from "@/services/debt.service";

/**
 * GET /api/debts
 * Get all debts with optional status filter
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") as "OPEN" | "PAID" | "PARTIAL" | null;

    const debts = await DebtService.getDebts(status || undefined);

    return NextResponse.json({
      success: true,
      data: debts,
      count: debts.length,
    });
  } catch (error: any) {
    console.error("GET /api/debts error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch debts",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/debts
 * Create a new debt
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.employeeId || !body.amount || !body.reason || !body.debtType) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: employeeId, amount, reason, debtType",
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

    // Validate debtType
    if (!["ADVANCE", "LOAN", "EXPENSE_REFUND"].includes(body.debtType)) {
      return NextResponse.json(
        {
          success: false,
          error: "debtType must be ADVANCE, LOAN, or EXPENSE_REFUND",
        },
        { status: 400 }
      );
    }

    const debt = await DebtService.createDebt({
      employeeId: body.employeeId,
      amount: parseFloat(body.amount),
      reason: body.reason,
      debtType: body.debtType,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        data: debt,
        message: "Debt created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/debts error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create debt",
      },
      { status: 400 }
    );
  }
}
