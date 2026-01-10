import { NextRequest, NextResponse } from "next/server";
import { DebtService } from "@/services/debt.service";

/**
 * GET /api/debts/[id]
 * Get a single debt by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const debt = await DebtService.getDebtById(params.id);

    return NextResponse.json({
      success: true,
      data: debt,
    });
  } catch (error: any) {
    console.error(`GET /api/debts/${params.id} error:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch debt",
      },
      { status: error.message === "Debt not found" ? 404 : 500 }
    );
  }
}

/**
 * PUT /api/debts/[id]
 * Update a debt
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validate amount if provided
    if (body.amount !== undefined && body.amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Amount must be greater than 0",
        },
        { status: 400 }
      );
    }

    // Validate debtType if provided
    if (body.debtType && !["ADVANCE", "LOAN", "EXPENSE_REFUND"].includes(body.debtType)) {
      return NextResponse.json(
        {
          success: false,
          error: "debtType must be ADVANCE, LOAN, or EXPENSE_REFUND",
        },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (body.amount !== undefined) updateData.amount = parseFloat(body.amount);
    if (body.reason) updateData.reason = body.reason;
    if (body.debtType) updateData.debtType = body.debtType;
    if (body.dueDate !== undefined) updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null;

    const debt = await DebtService.updateDebt(params.id, updateData);

    return NextResponse.json({
      success: true,
      data: debt,
      message: "Debt updated successfully",
    });
  } catch (error: any) {
    console.error(`PUT /api/debts/${params.id} error:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update debt",
      },
      { status: error.message === "Debt not found" ? 404 : 400 }
    );
  }
}

/**
 * DELETE /api/debts/[id]
 * Delete a debt
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await DebtService.deleteDebt(params.id);

    return NextResponse.json({
      success: true,
      message: "Debt deleted successfully",
    });
  } catch (error: any) {
    console.error(`DELETE /api/debts/${params.id} error:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete debt",
      },
      { status: error.message === "Debt not found" ? 404 : 400 }
    );
  }
}
