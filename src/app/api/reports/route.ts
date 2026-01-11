import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ReportType, ReportData, ReportDataItem, ChartData } from "@/types/reports";

/**
 * POST /api/reports
 * Generate a report based on filters
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, startDate, endDate, frameworkId, categoryId } = body;

    if (!type) {
      return NextResponse.json(
        { success: false, error: "Report type is required" },
        { status: 400 }
      );
    }

    let reportData: ReportData;

    switch (type as ReportType) {
      case 'monthly':
        reportData = await generateMonthlyReport(startDate, endDate, frameworkId);
        break;
      case 'by-framework':
        reportData = await generateFrameworkReport(startDate, endDate);
        break;
      case 'by-category':
        reportData = await generateCategoryReport(startDate, endDate, frameworkId);
        break;
      case 'trends':
        reportData = await generateTrendsReport(startDate, endDate, frameworkId);
        break;
      case 'employee-debts':
        reportData = await generateEmployeeDebtsReport(frameworkId);
        break;
      default:
        return NextResponse.json(
          { success: false, error: "Invalid report type" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: reportData,
    });
  } catch (error: any) {
    console.error("POST /api/reports error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate report" },
      { status: 500 }
    );
  }
}

async function generateMonthlyReport(
  startDate?: string,
  endDate?: string,
  frameworkId?: string
): Promise<ReportData> {
  const where: any = {};

  if (startDate || endDate) {
    where.expenseDate = {};
    if (startDate) where.expenseDate.gte = new Date(startDate);
    if (endDate) where.expenseDate.lte = new Date(endDate);
  }
  if (frameworkId) where.frameworkId = frameworkId;

  const expenses = await prisma.expense.findMany({
    where,
    include: {
      category: true,
      framework: true,
    },
    orderBy: { expenseDate: 'desc' },
  });

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const fixedTotal = expenses.filter(e => e.expenseType === 'FIXED').reduce((sum, e) => sum + e.amount, 0);
  const occasionalTotal = expenses.filter(e => e.expenseType === 'OCCASIONAL').reduce((sum, e) => sum + e.amount, 0);

  // Group by category for chart
  const categoryTotals = expenses.reduce((acc, e) => {
    const catName = e.category.name;
    acc[catName] = (acc[catName] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData: ChartData = {
    type: 'pie',
    title: 'פילוח לפי קטגוריות',
    data: Object.entries(categoryTotals).map(([name, value]) => ({ name, value })),
  };

  return {
    title: 'דוח חודשי',
    generatedAt: new Date().toISOString(),
    filters: { type: 'monthly', startDate, endDate, frameworkId },
    summary: {
      'סה"כ הוצאות': total,
      'הוצאות קבועות': fixedTotal,
      'הוצאות מזדמנות': occasionalTotal,
      'מספר רשומות': expenses.length,
    },
    data: expenses.map(e => ({
      id: e.id,
      description: e.description,
      amount: e.amount,
      date: e.expenseDate.toISOString(),
      category: e.category.name,
      categoryIcon: e.category.icon,
      framework: e.framework.name,
      frameworkType: e.framework.type,
    })),
    charts: [chartData],
  };
}

async function generateFrameworkReport(
  startDate?: string,
  endDate?: string
): Promise<ReportData> {
  const where: any = {};

  if (startDate || endDate) {
    where.expenseDate = {};
    if (startDate) where.expenseDate.gte = new Date(startDate);
    if (endDate) where.expenseDate.lte = new Date(endDate);
  }

  const expenses = await prisma.expense.findMany({
    where,
    include: {
      category: true,
      framework: true,
    },
    orderBy: { expenseDate: 'desc' },
  });

  const frameworks = await prisma.framework.findMany();

  const frameworkTotals = expenses.reduce((acc, e) => {
    const name = e.framework.name;
    acc[name] = (acc[name] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData: ChartData = {
    type: 'bar',
    title: 'השוואת הוצאות לפי מסגרת',
    data: frameworks.map(f => ({
      name: f.name,
      value: frameworkTotals[f.name] || 0,
      color: f.type === 'KINDERGARTEN' ? '#3b82f6' : '#f59e0b',
    })),
  };

  return {
    title: 'דוח לפי מסגרת',
    generatedAt: new Date().toISOString(),
    filters: { type: 'by-framework', startDate, endDate },
    summary: {
      ...frameworkTotals,
      'סה"כ': Object.values(frameworkTotals).reduce((a, b) => a + b, 0),
    },
    data: expenses.map(e => ({
      id: e.id,
      description: e.description,
      amount: e.amount,
      date: e.expenseDate.toISOString(),
      category: e.category.name,
      categoryIcon: e.category.icon,
      framework: e.framework.name,
      frameworkType: e.framework.type,
    })),
    charts: [chartData],
  };
}

async function generateCategoryReport(
  startDate?: string,
  endDate?: string,
  frameworkId?: string
): Promise<ReportData> {
  const where: any = {};

  if (startDate || endDate) {
    where.expenseDate = {};
    if (startDate) where.expenseDate.gte = new Date(startDate);
    if (endDate) where.expenseDate.lte = new Date(endDate);
  }
  if (frameworkId) where.frameworkId = frameworkId;

  const expenses = await prisma.expense.findMany({
    where,
    include: {
      category: true,
      framework: true,
    },
    orderBy: { expenseDate: 'desc' },
  });

  const categoryTotals = expenses.reduce((acc, e) => {
    const name = e.category.name;
    acc[name] = {
      total: (acc[name]?.total || 0) + e.amount,
      count: (acc[name]?.count || 0) + 1,
      icon: e.category.icon,
      color: e.category.color,
    };
    return acc;
  }, {} as Record<string, { total: number; count: number; icon: string; color: string }>);

  const chartData: ChartData = {
    type: 'pie',
    title: 'פילוח הוצאות לפי קטגוריות',
    data: Object.entries(categoryTotals).map(([name, data]) => ({
      name,
      value: data.total,
      color: data.color,
    })),
  };

  const summary: Record<string, number> = {};
  Object.entries(categoryTotals).forEach(([name, data]) => {
    summary[name] = data.total;
  });
  summary['סה"כ'] = Object.values(categoryTotals).reduce((a, b) => a + b.total, 0);

  return {
    title: 'דוח לפי קטגוריה',
    generatedAt: new Date().toISOString(),
    filters: { type: 'by-category', startDate, endDate, frameworkId },
    summary,
    data: expenses.map(e => ({
      id: e.id,
      description: e.description,
      amount: e.amount,
      date: e.expenseDate.toISOString(),
      category: e.category.name,
      categoryIcon: e.category.icon,
      framework: e.framework.name,
      frameworkType: e.framework.type,
    })),
    charts: [chartData],
  };
}

async function generateTrendsReport(
  startDate?: string,
  endDate?: string,
  frameworkId?: string
): Promise<ReportData> {
  const where: any = {};

  // Default to last 6 months if no dates provided
  const end = endDate ? new Date(endDate) : new Date();
  const start = startDate ? new Date(startDate) : new Date(end.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);

  where.expenseDate = {
    gte: start,
    lte: end,
  };
  if (frameworkId) where.frameworkId = frameworkId;

  const expenses = await prisma.expense.findMany({
    where,
    include: {
      category: true,
      framework: true,
    },
    orderBy: { expenseDate: 'asc' },
  });

  // Group by month
  const monthlyTotals = expenses.reduce((acc, e) => {
    const month = e.expenseDate.toISOString().substring(0, 7); // YYYY-MM
    acc[month] = (acc[month] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData: ChartData = {
    type: 'line',
    title: 'מגמות הוצאות לאורך זמן',
    data: Object.entries(monthlyTotals)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, value]) => ({ name, value })),
  };

  return {
    title: 'דוח מגמות',
    generatedAt: new Date().toISOString(),
    filters: { type: 'trends', startDate: start.toISOString(), endDate: end.toISOString(), frameworkId },
    summary: {
      'סה"כ בתקופה': Object.values(monthlyTotals).reduce((a, b) => a + b, 0),
      'ממוצע חודשי': Math.round(Object.values(monthlyTotals).reduce((a, b) => a + b, 0) / Math.max(Object.keys(monthlyTotals).length, 1)),
      'מספר חודשים': Object.keys(monthlyTotals).length,
    },
    data: expenses.map(e => ({
      id: e.id,
      description: e.description,
      amount: e.amount,
      date: e.expenseDate.toISOString(),
      category: e.category.name,
      categoryIcon: e.category.icon,
      framework: e.framework.name,
      frameworkType: e.framework.type,
    })),
    charts: [chartData],
  };
}

async function generateEmployeeDebtsReport(frameworkId?: string): Promise<ReportData> {
  const where: any = {};
  if (frameworkId) {
    where.employee = { frameworkId };
  }

  const debts = await prisma.debt.findMany({
    where,
    include: {
      employee: {
        include: {
          framework: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalDebt = debts.reduce((sum, d) => sum + d.amount, 0);
  const totalPaid = debts.reduce((sum, d) => sum + d.paidAmount, 0);
  const openDebts = debts.filter(d => d.status === 'OPEN');
  const partialDebts = debts.filter(d => d.status === 'PARTIAL');

  // Group by employee
  const employeeTotals = debts.reduce((acc, d) => {
    const name = `${d.employee.firstName} ${d.employee.lastName}`;
    acc[name] = (acc[name] || 0) + (d.amount - d.paidAmount);
    return acc;
  }, {} as Record<string, number>);

  const chartData: ChartData = {
    type: 'bar',
    title: 'חובות לפי עובד',
    data: Object.entries(employeeTotals)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value })),
  };

  return {
    title: 'דוח חובות עובדים',
    generatedAt: new Date().toISOString(),
    filters: { type: 'employee-debts', frameworkId },
    summary: {
      'סה"כ חובות': totalDebt,
      'סה"כ שולם': totalPaid,
      'יתרה לגבייה': totalDebt - totalPaid,
      'חובות פתוחים': openDebts.length,
      'חובות בתשלום חלקי': partialDebts.length,
    },
    data: debts.map(d => ({
      id: d.id,
      description: d.reason,
      amount: d.amount - d.paidAmount,
      date: d.createdAt.toISOString(),
      employeeName: `${d.employee.firstName} ${d.employee.lastName}`,
      framework: d.employee.framework.name,
      frameworkType: d.employee.framework.type,
      status: d.status,
    })),
    charts: [chartData],
  };
}
