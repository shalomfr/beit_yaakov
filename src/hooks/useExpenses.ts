import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Expense {
  id: string;
  frameworkId: string;
  categoryId: string;
  amount: number;
  description: string;
  expenseDate: string;
  expenseType: "FIXED" | "OCCASIONAL";
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
  framework?: {
    id: string;
    name: string;
    type: string;
  };
  category?: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
}

export interface CreateExpenseInput {
  frameworkId: string;
  categoryId: string;
  amount: number;
  description: string;
  expenseDate: string;
  expenseType: "FIXED" | "OCCASIONAL";
  receiptUrl?: string;
}

export interface UpdateExpenseInput {
  categoryId?: string;
  amount?: number;
  description?: string;
  expenseDate?: string;
  expenseType?: "FIXED" | "OCCASIONAL";
  receiptUrl?: string;
}

// Fetch all expenses
export function useExpenses(frameworkId?: string) {
  return useQuery({
    queryKey: ["expenses", frameworkId],
    queryFn: async () => {
      const url = frameworkId
        ? `/api/expenses?frameworkId=${frameworkId}`
        : "/api/expenses";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch expenses");
      const data = await response.json();
      return data.data as Expense[];
    },
  });
}

// Fetch single expense
export function useExpense(id: string) {
  return useQuery({
    queryKey: ["expenses", id],
    queryFn: async () => {
      const response = await fetch(`/api/expenses/${id}`);
      if (!response.ok) throw new Error("Failed to fetch expense");
      const data = await response.json();
      return data.data as Expense;
    },
    enabled: !!id,
  });
}

// Create expense mutation
export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateExpenseInput) => {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!response.ok) throw new Error("Failed to create expense");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["frameworks"] });
    },
  });
}

// Update expense mutation
export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateExpenseInput }) => {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update expense");
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenses", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["frameworks"] });
    },
  });
}

// Delete expense mutation
export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete expense");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["frameworks"] });
    },
  });
}
