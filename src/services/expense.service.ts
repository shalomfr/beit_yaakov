import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export interface CreateExpenseInput {
  frameworkId: string;
  categoryId: string;
  amount: number;
  description: string;
  expenseDate: Date;
  expenseType: "FIXED" | "OCCASIONAL";
  receiptUrl?: string;
}

export interface UpdateExpenseInput {
  frameworkId?: string;
  categoryId?: string;
  amount?: number;
  description?: string;
  expenseDate?: Date;
  expenseType?: "FIXED" | "OCCASIONAL";
  receiptUrl?: string;
}

export interface ExpenseFilters {
  frameworkId?: string;
  categoryId?: string;
  expenseType?: "FIXED" | "OCCASIONAL";
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

export class ExpenseService {
  /**
   * Get all expenses with optional filters
   */
  static async getExpenses(filters?: ExpenseFilters) {
    const where: Prisma.ExpenseWhereInput = {};

    if (filters?.frameworkId) {
      where.frameworkId = filters.frameworkId;
    }

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.expenseType) {
      where.expenseType = filters.expenseType;
    }

    if (filters?.startDate || filters?.endDate) {
      where.expenseDate = {};
      if (filters.startDate) {
        where.expenseDate.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.expenseDate.lte = filters.endDate;
      }
    }

    if (filters?.search) {
      where.description = {
        contains: filters.search,
      };
    }

    const expenses = await prisma.expense.findMany({
      where,
      include: {
        framework: true,
        category: true,
      },
      orderBy: {
        expenseDate: "desc",
      },
    });

    return expenses;
  }

  /**
   * Get a single expense by ID
   */
  static async getExpenseById(id: string) {
    const expense = await prisma.expense.findUnique({
      where: { id },
      include: {
        framework: true,
        category: true,
      },
    });

    if (!expense) {
      throw new Error("Expense not found");
    }

    return expense;
  }

  /**
   * Create a new expense
   */
  static async createExpense(data: CreateExpenseInput) {
    // Verify framework exists
    const framework = await prisma.framework.findUnique({
      where: { id: data.frameworkId },
    });

    if (!framework) {
      throw new Error("Framework not found");
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    // Create expense
    const expense = await prisma.expense.create({
      data: {
        frameworkId: data.frameworkId,
        categoryId: data.categoryId,
        amount: data.amount,
        description: data.description,
        expenseDate: data.expenseDate,
        expenseType: data.expenseType,
        receiptUrl: data.receiptUrl,
      },
      include: {
        framework: true,
        category: true,
      },
    });

    // Update framework balance
    await prisma.framework.update({
      where: { id: data.frameworkId },
      data: {
        currentBalance: {
          decrement: data.amount,
        },
      },
    });

    return expense;
  }

  /**
   * Update an expense
   */
  static async updateExpense(id: string, data: UpdateExpenseInput) {
    const existingExpense = await prisma.expense.findUnique({
      where: { id },
    });

    if (!existingExpense) {
      throw new Error("Expense not found");
    }

    // If amount or framework changed, update balances
    if (data.amount !== undefined || data.frameworkId) {
      const oldAmount = existingExpense.amount;
      const newAmount = data.amount ?? oldAmount;
      const oldFrameworkId = existingExpense.frameworkId;
      const newFrameworkId = data.frameworkId ?? oldFrameworkId;

      // Restore old framework balance
      await prisma.framework.update({
        where: { id: oldFrameworkId },
        data: {
          currentBalance: {
            increment: oldAmount,
          },
        },
      });

      // Deduct from new framework balance
      await prisma.framework.update({
        where: { id: newFrameworkId },
        data: {
          currentBalance: {
            decrement: newAmount,
          },
        },
      });
    }

    const expense = await prisma.expense.update({
      where: { id },
      data,
      include: {
        framework: true,
        category: true,
      },
    });

    return expense;
  }

  /**
   * Delete an expense
   */
  static async deleteExpense(id: string) {
    const expense = await prisma.expense.findUnique({
      where: { id },
    });

    if (!expense) {
      throw new Error("Expense not found");
    }

    // Restore framework balance
    await prisma.framework.update({
      where: { id: expense.frameworkId },
      data: {
        currentBalance: {
          increment: expense.amount,
        },
      },
    });

    await prisma.expense.delete({
      where: { id },
    });

    return { success: true };
  }

  /**
   * Get expense summary statistics
   */
  static async getSummary(frameworkId?: string, startDate?: Date, endDate?: Date) {
    const where: Prisma.ExpenseWhereInput = {};

    if (frameworkId) {
      where.frameworkId = frameworkId;
    }

    if (startDate || endDate) {
      where.expenseDate = {};
      if (startDate) {
        where.expenseDate.gte = startDate;
      }
      if (endDate) {
        where.expenseDate.lte = endDate;
      }
    }

    const [
      totalExpenses,
      fixedExpenses,
      occasionalExpenses,
      expensesByCategory,
      expensesByFramework,
    ] = await Promise.all([
      prisma.expense.aggregate({
        where,
        _sum: {
          amount: true,
        },
        _count: true,
      }),
      prisma.expense.aggregate({
        where: {
          ...where,
          expenseType: "FIXED",
        },
        _sum: {
          amount: true,
        },
      }),
      prisma.expense.aggregate({
        where: {
          ...where,
          expenseType: "OCCASIONAL",
        },
        _sum: {
          amount: true,
        },
      }),
      prisma.expense.groupBy({
        by: ["categoryId"],
        where,
        _sum: {
          amount: true,
        },
        _count: true,
      }),
      prisma.expense.groupBy({
        by: ["frameworkId"],
        where,
        _sum: {
          amount: true,
        },
        _count: true,
      }),
    ]);

    return {
      total: totalExpenses._sum.amount || 0,
      count: totalExpenses._count,
      fixed: fixedExpenses._sum.amount || 0,
      occasional: occasionalExpenses._sum.amount || 0,
      byCategory: expensesByCategory,
      byFramework: expensesByFramework,
    };
  }
}
