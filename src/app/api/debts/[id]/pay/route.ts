import { NextRequest, NextResponse } from "next/server";
import { DebtService } from "@/services/debt.service";

/**
 * PUT /api/debts/[id]/pay
 * Pay a debt (full or partial)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.amount || !body.paidDate) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: amount, paidDate",
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

    const debt = await DebtService.payDebt(params.id, {
      amount: parseFloat(body.amount),
      paidDate: new Date(body.paidDate),
    });

    return NextResponse.json({
      success: true,
      data: debt,
      message: "Payment recorded successfully",
    });
  } catch (error: any) {
    console.error(`PUT /api/debts/${params.id}/pay error:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to record payment",
      },
      { status: error.message === "Debt not found" ? 404 : 400 }
    );
  }
}
