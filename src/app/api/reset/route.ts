import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/reset
 * Reset employees and debts data - clean start
 */
export async function POST() {
  try {
    // Delete all debts first (due to foreign key constraints)
    const deletedDebts = await prisma.debt.deleteMany({});

    // Delete all employees
    const deletedEmployees = await prisma.employee.deleteMany({});

    // Also reset tour visitors so new IPs will see the tour
    await prisma.tourVisitor.deleteMany({});

    return NextResponse.json({
      success: true,
      message: 'הנתונים נמחקו בהצלחה',
      deleted: {
        employees: deletedEmployees.count,
        debts: deletedDebts.count,
      }
    });
  } catch (error: any) {
    console.error('Error resetting data:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to reset data' },
      { status: 500 }
    );
  }
}
