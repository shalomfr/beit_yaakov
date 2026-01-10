import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Debt {
  id: string;
  employeeId: string;
  amount: number;
  reason: string;
  debtType: "ADVANCE" | "LOAN" | "EXPENSE_REFUND";
  status: "OPEN" | "PAID" | "PARTIAL";
  paidAmount: number;
  dueDate?: string;
  paidDate?: string;
  createdAt: string;
  updatedAt: string;
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
  };
}

export interface CreateDebtInput {
  employeeId: string;
  amount: number;
  reason: string;
  debtType: "ADVANCE" | "LOAN" | "EXPENSE_REFUND";
  dueDate?: string;
}

export interface UpdateDebtInput {
  amount?: number;
  reason?: string;
  debtType?: "ADVANCE" | "LOAN" | "EXPENSE_REFUND";
  dueDate?: string;
}

export interface PayDebtInput {
  amount: number;
}

// Fetch all debts
export function useDebts(employeeId?: string) {
  return useQuery({
    queryKey: ["debts", employeeId],
    queryFn: async () => {
      const url = employeeId
        ? `/api/debts?employeeId=${employeeId}`
        : "/api/debts";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch debts");
      const data = await response.json();
      return data.data as Debt[];
    },
  });
}

// Fetch single debt
export function useDebt(id: string) {
  return useQuery({
    queryKey: ["debts", id],
    queryFn: async () => {
      const response = await fetch(`/api/debts/${id}`);
      if (!response.ok) throw new Error("Failed to fetch debt");
      const data = await response.json();
      return data.data as Debt;
    },
    enabled: !!id,
  });
}

// Create debt mutation
export function useCreateDebt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateDebtInput) => {
      const response = await fetch("/api/debts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!response.ok) throw new Error("Failed to create debt");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

// Update debt mutation
export function useUpdateDebt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateDebtInput }) => {
      const response = await fetch(`/api/debts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update debt");
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      queryClient.invalidateQueries({ queryKey: ["debts", variables.id] });
    },
  });
}

// Pay debt mutation
export function usePayDebt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount: number }) => {
      const response = await fetch(`/api/debts/${id}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (!response.ok) throw new Error("Failed to pay debt");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

// Delete debt mutation
export function useDeleteDebt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/debts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete debt");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}
