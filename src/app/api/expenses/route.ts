import { NextRequest, NextResponse } from "next/server";
import { ExpenseService } from "@/services/expense.service";

/**
 * GET /api/expenses
 * Get all expenses with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const frameworkId = searchParams.get("frameworkId") || undefined;
    const categoryId = searchParams.get("categoryId") || undefined;
    const expenseType = searchParams.get("expenseType") as "FIXED" | "OCCASIONAL" | undefined;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const search = searchParams.get("search") || undefined;

    const filters = {
      frameworkId,
      categoryId,
      expenseType,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      search,
    };

    const expenses = await ExpenseService.getExpenses(filters);

    return NextResponse.json({
      success: true,
      data: expenses,
      count: expenses.length,
    });
  } catch (error: any) {
    console.error("GET /api/expenses error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch expenses",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/expenses
 * Create a new expense
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.frameworkId || !body.categoryId || !body.amount || !body.description || !body.expenseDate || !body.expenseType) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: frameworkId, categoryId, amount, description, expenseDate, expenseType",
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

    // Validate expenseType
    if (!["FIXED", "OCCASIONAL"].includes(body.expenseType)) {
      return NextResponse.json(
        {
          success: false,
          error: "expenseType must be either FIXED or OCCASIONAL",
        },
        { status: 400 }
      );
    }

    const expense = await ExpenseService.createExpense({
      frameworkId: body.frameworkId,
      categoryId: body.categoryId,
      amount: parseFloat(body.amount),
      description: body.description,
      expenseDate: new Date(body.expenseDate),
      expenseType: body.expenseType,
      receiptUrl: body.receiptUrl,
    });

    return NextResponse.json(
      {
        success: true,
        data: expense,
        message: "Expense created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/expenses error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create expense",
      },
      { status: 400 }
    );
  }
}
