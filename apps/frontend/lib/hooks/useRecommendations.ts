import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RecommendationPublisher {
  id: string;
  name: string;
  category: string | null;
  monthlyViews: number;
  subscriberCount: number;
}

export interface ScoreBreakdown {
  audienceOverlap: number;
  priceEfficiency: number;
  historicalPerformance: number;
  contentCategoryMatch: number;
}

export interface Recommendation {
  adSlotId: string;
  adSlotName: string;
  adSlotType: string;
  description: string | null;
  basePrice: number;
  matchScore: number;
  matchPercentage: number;
  estimatedReach: number;
  publisher: RecommendationPublisher;
  scoreBreakdown: ScoreBreakdown;
  reasons: string[];
}

export interface RecommendationsResponse {
  campaignId: string;
  recommendations: Recommendation[];
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useRecommendations(campaignId: string | null) {
  return useQuery<RecommendationsResponse, Error>({
    queryKey: ['recommendations', campaignId],
    queryFn: () =>
      api<RecommendationsResponse>(`/api/campaigns/${campaignId}/recommendations`),
    enabled: !!campaignId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // soft refresh every 5 minutes
  });
}
