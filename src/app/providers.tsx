"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ProductTour } from "@/components/tour/ProductTour";
import { WelcomeModal } from "@/components/tour/WelcomeModal";
import { useTourInit } from "@/hooks/useTourInit";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // Initialize tour
  useTourInit();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ProductTour />
      <WelcomeModal />
    </QueryClientProvider>
  );
}
