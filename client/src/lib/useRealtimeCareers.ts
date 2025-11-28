import { useQuery } from "@tanstack/react-query";
import type { Career } from "@shared/schema";

export function useRealtimeCareers() {
  return useQuery<Career[]>({
    queryKey: ["/api/careers-realtime"],
    queryFn: async () => {
      const res = await fetch("/api/careers-realtime", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch careers");
      return await res.json();
    },
    staleTime: 1000 * 60 * 60, // 1 hour cache
    retry: 2,
  });
}
