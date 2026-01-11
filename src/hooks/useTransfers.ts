import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface InternalTransfer {
  id: string;
  sourceFrameworkId: string;
  targetFrameworkId: string;
  amount: number;
  description: string;
  transferDate: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  sourceFramework?: {
    id: string;
    name: string;
    type: string;
  };
  targetFramework?: {
    id: string;
    name: string;
    type: string;
  };
}

export interface CreateTransferInput {
  sourceFrameworkId: string;
  targetFrameworkId: string;
  amount: number;
  description: string;
  transferDate: string;
}

// Fetch all transfers
export function useTransfers(frameworkId?: string) {
  return useQuery({
    queryKey: ["transfers", frameworkId],
    queryFn: async () => {
      const url = frameworkId
        ? `/api/transfers?frameworkId=${frameworkId}`
        : "/api/transfers";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch transfers");
      const data = await response.json();
      return data.data as InternalTransfer[];
    },
  });
}

// Fetch single transfer
export function useTransfer(id: string) {
  return useQuery({
    queryKey: ["transfers", id],
    queryFn: async () => {
      const response = await fetch(`/api/transfers/${id}`);
      if (!response.ok) throw new Error("Failed to fetch transfer");
      const data = await response.json();
      return data.data as InternalTransfer;
    },
    enabled: !!id,
  });
}

// Create transfer mutation
export function useCreateTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTransferInput) => {
      const response = await fetch("/api/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!response.ok) throw new Error("Failed to create transfer");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
  });
}

// Complete transfer mutation
export function useCompleteTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/transfers/${id}/complete`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error("Failed to complete transfer");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
      queryClient.invalidateQueries({ queryKey: ["frameworks"] });
    },
  });
}

// Cancel transfer mutation
export function useCancelTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/transfers/${id}/cancel`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error("Failed to cancel transfer");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
  });
}

// Delete transfer mutation
export function useDeleteTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/transfers/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete transfer");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
  });
}
