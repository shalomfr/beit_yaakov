// Types for the Beit Yaakov Financial System

export type FrameworkType = "KINDERGARTEN" | "SCHOOL";
export type ExpenseType = "FIXED" | "OCCASIONAL";
export type TransferStatus = "PENDING" | "COMPLETED" | "CANCELLED";
export type DebtType = "ADVANCE" | "LOAN" | "EXPENSE_REFUND";
export type DebtStatus = "OPEN" | "PAID" | "PARTIAL";
export type UserRole = "ADMIN" | "MANAGER" | "VIEWER";

export interface Framework {
  id: string;
  name: string;
  type: FrameworkType;
  currentBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Expense {
  id: string;
  frameworkId: string;
  categoryId: string;
  amount: number;
  description: string;
  expenseDate: Date;
  expenseType: ExpenseType;
  receiptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  framework?: Framework;
  category?: Category;
}

export interface InternalTransfer {
  id: string;
  sourceFrameworkId: string;
  targetFrameworkId: string;
  amount: number;
  description: string;
  transferDate: Date;
  status: TransferStatus;
  createdAt: Date;
  sourceFramework?: Framework;
  targetFramework?: Framework;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  frameworkId: string;
  isActive: boolean;
  createdAt: Date;
  framework?: Framework;
}

export interface Debt {
  id: string;
  employeeId: string;
  amount: number;
  reason: string;
  debtType: DebtType;
  status: DebtStatus;
  paidAmount: number;
  dueDate?: Date;
  paidDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  employee?: Employee;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Stats Types
export interface ExpenseStats {
  totalKindergarten: number;
  totalSchool: number;
  totalMonth: number;
  fixedAmount: number;
  occasionalAmount: number;
  changeFromLastMonth: number;
}

export interface DebtStats {
  totalOpen: number;
  totalPaidThisMonth: number;
  openCount: number;
  paidCount: number;
  employeesWithDebt: number;
}

export interface TransferBalance {
  kindergartenBalance: number;
  schoolBalance: number;
  kindergartenOwesToSchool: number;
  schoolOwesToKindergarten: number;
}

// Form Types
export interface CreateExpenseInput {
  frameworkId: string;
  categoryId: string;
  amount: number;
  description: string;
  expenseDate: string;
  expenseType: ExpenseType;
}

export interface CreateTransferInput {
  sourceFrameworkId: string;
  targetFrameworkId: string;
  amount: number;
  description: string;
  transferDate: string;
}

export interface CreateDebtInput {
  employeeId: string;
  amount: number;
  reason: string;
  debtType: DebtType;
  dueDate?: string;
}

export interface CreateEmployeeInput {
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  frameworkId: string;
}
