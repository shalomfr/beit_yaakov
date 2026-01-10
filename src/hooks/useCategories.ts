import { useQuery } from "@tanstack/react-query";

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isActive: boolean;
  createdAt: string;
}

// Fetch all categories
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      return data.data as Category[];
    },
  });
}

// Fetch single category
export function useCategory(id: string) {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: async () => {
      const response = await fetch(`/api/categories/${id}`);
      if (!response.ok) throw new Error("Failed to fetch category");
      const data = await response.json();
      return data.data as Category;
    },
    enabled: !!id,
  });
}
