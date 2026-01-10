import { NextRequest, NextResponse } from "next/server";
import { ExpenseService } from "@/services/expense.service";

/**
 * GET /api/expenses/[id]
 * Get a single expense by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const expense = await ExpenseService.getExpenseById(id);

    return NextResponse.json({
      success: true,
      data: expense,
    });
  } catch (error: any) {
    const { id } = await params;
    console.error(`GET /api/expenses/${id} error:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch expense",
      },
      { status: error.message === "Expense not found" ? 404 : 500 }
    );
  }
}

/**
 * PUT /api/expenses/[id]
 * Update an expense
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Validate expenseType if provided
    if (body.expenseType && !["FIXED", "OCCASIONAL"].includes(body.expenseType)) {
      return NextResponse.json(
        {
          success: false,
          error: "expenseType must be either FIXED or OCCASIONAL",
        },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (body.frameworkId) updateData.frameworkId = body.frameworkId;
    if (body.categoryId) updateData.categoryId = body.categoryId;
    if (body.amount !== undefined) updateData.amount = parseFloat(body.amount);
    if (body.description) updateData.description = body.description;
    if (body.expenseDate) updateData.expenseDate = new Date(body.expenseDate);
    if (body.expenseType) updateData.expenseType = body.expenseType;
    if (body.receiptUrl !== undefined) updateData.receiptUrl = body.receiptUrl;

    const expense = await ExpenseService.updateExpense(id, updateData);

    return NextResponse.json({
      success: true,
      data: expense,
      message: "Expense updated successfully",
    });
  } catch (error: any) {
    const { id } = await params;
    console.error(`PUT /api/expenses/${id} error:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update expense",
      },
      { status: error.message === "Expense not found" ? 404 : 400 }
    );
  }
}

/**
 * DELETE /api/expenses/[id]
 * Delete an expense
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await ExpenseService.deleteExpense(id);

    return NextResponse.json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error: any) {
    const { id } = await params;
    console.error(`DELETE /api/expenses/${id} error:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete expense",
      },
      { status: error.message === "Expense not found" ? 404 : 400 }
    );
  }
}
