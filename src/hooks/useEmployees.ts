import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  frameworkId: string;
  isActive: boolean;
  createdAt: string;
  framework?: {
    id: string;
    name: string;
    type: string;
  };
  debts?: Array<{
    id: string;
    amount: number;
    paidAmount: number;
    status: string;
  }>;
}

export interface CreateEmployeeInput {
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  frameworkId: string;
}

export interface UpdateEmployeeInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
  frameworkId?: string;
  isActive?: boolean;
}

// Fetch all employees
export function useEmployees(frameworkId?: string) {
  return useQuery({
    queryKey: ["employees", frameworkId],
    queryFn: async () => {
      const url = frameworkId
        ? `/api/employees?frameworkId=${frameworkId}`
        : "/api/employees";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch employees");
      const data = await response.json();
      return data.data as Employee[];
    },
  });
}

// Fetch single employee
export function useEmployee(id: string) {
  return useQuery({
    queryKey: ["employees", id],
    queryFn: async () => {
      const response = await fetch(`/api/employees/${id}`);
      if (!response.ok) throw new Error("Failed to fetch employee");
      const data = await response.json();
      return data.data as Employee;
    },
    enabled: !!id,
  });
}

// Create employee mutation
export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateEmployeeInput) => {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!response.ok) throw new Error("Failed to create employee");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

// Update employee mutation
export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateEmployeeInput }) => {
      const response = await fetch(`/api/employees/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update employee");
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employees", variables.id] });
    },
  });
}

// Delete employee mutation
export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/employees/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete employee");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}
