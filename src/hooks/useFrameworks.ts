import { useQuery } from "@tanstack/react-query";

export interface Framework {
  id: string;
  name: string;
  type: "KINDERGARTEN" | "SCHOOL";
  currentBalance: number;
  createdAt: string;
  updatedAt: string;
}

// Fetch all frameworks
export function useFrameworks() {
  return useQuery({
    queryKey: ["frameworks"],
    queryFn: async () => {
      const response = await fetch("/api/frameworks");
      if (!response.ok) throw new Error("Failed to fetch frameworks");
      const data = await response.json();
      return data.data as Framework[];
    },
  });
}

// Fetch single framework
export function useFramework(id: string) {
  return useQuery({
    queryKey: ["frameworks", id],
    queryFn: async () => {
      const response = await fetch(`/api/frameworks/${id}`);
      if (!response.ok) throw new Error("Failed to fetch framework");
      const data = await response.json();
      return data.data as Framework;
    },
    enabled: !!id,
  });
}
