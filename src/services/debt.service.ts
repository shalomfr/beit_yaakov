import { prisma } from "@/lib/prisma";

export interface CreateDebtInput {
  employeeId: string;
  amount: number;
  reason: string;
  debtType: "ADVANCE" | "LOAN" | "EXPENSE_REFUND";
  dueDate?: Date;
}

export interface PayDebtInput {
  amount: number;
  paidDate: Date;
}

export class DebtService {
  /**
   * Get all debts with optional filters
   */
  static async getDebts(status?: "OPEN" | "PAID" | "PARTIAL") {
    const where = status ? { status } : {};

    const debts = await prisma.debt.findMany({
      where,
      include: {
        employee: {
          include: {
            framework: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return debts;
  }

  /**
   * Get a single debt by ID
   */
  static async getDebtById(id: string) {
    const debt = await prisma.debt.findUnique({
      where: { id },
      include: {
        employee: {
          include: {
            framework: true,
          },
        },
      },
    });

    if (!debt) {
      throw new Error("Debt not found");
    }

    return debt;
  }

  /**
   * Get debts by employee
   */
  static async getDebtsByEmployee(employeeId: string) {
    const debts = await prisma.debt.findMany({
      where: {
        employeeId,
      },
      include: {
        employee: {
          include: {
            framework: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return debts;
  }

  /**
   * Create a new debt
   */
  static async createDebt(data: CreateDebtInput) {
    // Verify employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: data.employeeId },
    });

    if (!employee) {
      throw new Error("Employee not found");
    }

    if (!employee.isActive) {
      throw new Error("Cannot add debt for inactive employee");
    }

    const debt = await prisma.debt.create({
      data: {
        employeeId: data.employeeId,
        amount: data.amount,
        reason: data.reason,
        debtType: data.debtType,
        dueDate: data.dueDate,
        status: "OPEN",
        paidAmount: 0,
      },
      include: {
        employee: {
          include: {
            framework: true,
          },
        },
      },
    });

    return debt;
  }

  /**
   * Pay a debt (full or partial)
   */
  static async payDebt(id: string, data: PayDebtInput) {
    const debt = await prisma.debt.findUnique({
      where: { id },
    });

    if (!debt) {
      throw new Error("Debt not found");
    }

    if (debt.status === "PAID") {
      throw new Error("Debt already paid");
    }

    const remainingAmount = debt.amount - debt.paidAmount;

    if (data.amount > remainingAmount) {
      throw new Error("Payment amount exceeds remaining debt");
    }

    const newPaidAmount = debt.paidAmount + data.amount;
    const newStatus = newPaidAmount >= debt.amount ? "PAID" : "PARTIAL";

    const updatedDebt = await prisma.debt.update({
      where: { id },
      data: {
        paidAmount: newPaidAmount,
        status: newStatus,
        paidDate: newStatus === "PAID" ? data.paidDate : debt.paidDate,
      },
      include: {
        employee: {
          include: {
            framework: true,
          },
        },
      },
    });

    return updatedDebt;
  }

  /**
   * Update a debt
   */
  static async updateDebt(
    id: string,
    data: Partial<{
      amount: number;
      reason: string;
      debtType: "ADVANCE" | "LOAN" | "EXPENSE_REFUND";
      dueDate: Date | null;
    }>
  ) {
    const debt = await prisma.debt.findUnique({
      where: { id },
    });

    if (!debt) {
      throw new Error("Debt not found");
    }

    if (debt.status === "PAID") {
      throw new Error("Cannot update a paid debt");
    }

    // If amount is being changed, recalculate status
    let updateData: any = { ...data };

    if (data.amount !== undefined) {
      const newStatus = debt.paidAmount >= data.amount ? "PAID" : debt.paidAmount > 0 ? "PARTIAL" : "OPEN";
      updateData.status = newStatus;
    }

    const updatedDebt = await prisma.debt.update({
      where: { id },
      data: updateData,
      include: {
        employee: {
          include: {
            framework: true,
          },
        },
      },
    });

    return updatedDebt;
  }

  /**
   * Delete a debt
   */
  static async deleteDebt(id: string) {
    const debt = await prisma.debt.findUnique({
      where: { id },
    });

    if (!debt) {
      throw new Error("Debt not found");
    }

    if (debt.paidAmount > 0) {
      throw new Error("Cannot delete a debt with payments");
    }

    await prisma.debt.delete({
      where: { id },
    });

    return { success: true };
  }

  /**
   * Get debt summary statistics
   */
  static async getSummary() {
    const [openDebts, paidDebts, partialDebts, totalByType, totalByEmployee] =
      await Promise.all([
        prisma.debt.aggregate({
          where: {
            status: "OPEN",
          },
          _sum: {
            amount: true,
          },
          _count: true,
        }),
        prisma.debt.aggregate({
          where: {
            status: "PAID",
          },
          _sum: {
            amount: true,
            paidAmount: true,
          },
          _count: true,
        }),
        prisma.debt.aggregate({
          where: {
            status: "PARTIAL",
          },
          _sum: {
            amount: true,
            paidAmount: true,
          },
          _count: true,
        }),
        prisma.debt.groupBy({
          by: ["debtType"],
          _sum: {
            amount: true,
            paidAmount: true,
          },
          _count: true,
        }),
        prisma.debt.groupBy({
          by: ["employeeId"],
          where: {
            status: {
              in: ["OPEN", "PARTIAL"],
            },
          },
          _sum: {
            amount: true,
            paidAmount: true,
          },
          _count: true,
        }),
      ]);

    const totalOpen = openDebts._sum.amount || 0;
    const totalPaid = paidDebts._sum.paidAmount || 0;
    const partialRemaining =
      (partialDebts._sum.amount || 0) - (partialDebts._sum.paidAmount || 0);

    return {
      open: {
        total: totalOpen,
        count: openDebts._count,
      },
      paid: {
        total: totalPaid,
        count: paidDebts._count,
      },
      partial: {
        total: partialRemaining,
        count: partialDebts._count,
      },
      totalOutstanding: totalOpen + partialRemaining,
      byType: totalByType,
      employeesWithDebts: totalByEmployee.length,
    };
  }
}
