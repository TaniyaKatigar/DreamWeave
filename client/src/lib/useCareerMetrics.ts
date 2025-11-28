import { useQuery } from "@tanstack/react-query";

export interface CareerMetrics {
  salaryRange: { min: number; max: number };
  growthPotential: number;
  stressIndex: number;
  mismatchProbability: number;
  industryTrends: string;
  personalityMatch: number;
  skillsMatch: number;
  interestsMatch: number;
  careerFitAnalysis: string;
}

export function useCareerMetrics(careerName: string | null) {
  return useQuery<CareerMetrics>({
    queryKey: ["/api/career-metrics", careerName],
    queryFn: async () => {
      if (!careerName) throw new Error("Career name required");
      const res = await fetch(`/api/career-metrics/${encodeURIComponent(careerName)}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch metrics");
      return await res.json();
    },
    enabled: !!careerName,
    staleTime: 1000 * 60 * 60, // 1 hour cache
    retry: 2,
  });
}
