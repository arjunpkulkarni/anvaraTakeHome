import { prisma } from '../db.js';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ScoreBreakdown {
  audienceOverlap: number;
  priceEfficiency: number;
  historicalPerformance: number;
  contentCategoryMatch: number;
}

export interface RecommendationPublisher {
  id: string;
  name: string;
  category: string | null;
  monthlyViews: number;
  subscriberCount: number;
}

export interface RecommendationResult {
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
  recommendations: RecommendationResult[];
}

// ── Related category map ───────────────────────────────────────────────────────
// Extend this map as new publisher categories are added.

const RELATED_CATEGORIES: Record<string, string[]> = {
  technology: ['saas', 'startups', 'business', 'software', 'tech', 'engineering', 'dev'],
  business: ['finance', 'startups', 'entrepreneurship', 'marketing', 'technology'],
  health: ['wellness', 'fitness', 'lifestyle', 'nutrition', 'medical'],
  finance: ['business', 'investing', 'wealth', 'fintech', 'economics'],
  marketing: ['business', 'advertising', 'growth', 'content', 'seo'],
  lifestyle: ['health', 'wellness', 'fashion', 'travel', 'food'],
  education: ['learning', 'e-learning', 'tutorials', 'academic', 'edtech'],
  entertainment: ['gaming', 'media', 'streaming', 'culture', 'music'],
};

// ── Scoring helpers (exported for unit testing) ────────────────────────────────

export function toNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  return parseFloat(String(value)) || 0;
}

/**
 * Audience overlap score (0–30).
 * Direct category match = 30, related = 20, none = 5.
 */
export function scoreAudienceOverlap(
  targetCategories: string[],
  publisherCategory: string | null,
): number {
  if (!publisherCategory) return 5;

  const pubCat = publisherCategory.toLowerCase().trim();
  const targets = targetCategories.map((c) => c.toLowerCase().trim());

  if (targets.includes(pubCat)) return 30;

  for (const target of targets) {
    const related = RELATED_CATEGORIES[target] ?? [];
    if (related.includes(pubCat)) return 20;

    // Reverse: publisher category's related list overlaps with targets
    const pubRelated = RELATED_CATEGORIES[pubCat] ?? [];
    if (pubRelated.some((r) => targets.includes(r))) return 20;
  }

  return 5;
}

/**
 * Price efficiency score (0–25).
 * Based on basePrice as a fraction of remaining campaign budget.
 */
export function scorePriceEfficiency(basePrice: number, remainingBudget: number): number {
  if (remainingBudget <= 0) return 0;
  const ratio = basePrice / remainingBudget;
  if (ratio < 0.1) return 25;
  if (ratio < 0.2) return 20;
  if (ratio < 0.35) return 15;
  return 5;
}

/**
 * Historical performance score (0–20).
 * Based on aggregate CTR across past placements for this slot.
 * Returns neutral fallback of 10 when no placement data exists.
 */
export function scoreHistoricalPerformance(
  placements: Array<{ impressions: number; clicks: number }>,
): number {
  const valid = placements.filter((p) => p.impressions > 0);
  if (valid.length === 0) return 10;

  const totalImpressions = valid.reduce((sum, p) => sum + p.impressions, 0);
  const totalClicks = valid.reduce((sum, p) => sum + p.clicks, 0);
  const ctr = totalClicks / totalImpressions;

  if (ctr > 0.02) return 20;
  if (ctr > 0.01) return 15;
  if (ctr > 0.005) return 10;
  return 5;
}

/**
 * Reach/content quality score (0–25).
 * Uses publisher monthlyViews as a proxy for audience size.
 */
export function scoreReach(monthlyViews: number): number {
  if (monthlyViews > 500_000) return 25;
  if (monthlyViews > 100_000) return 20;
  if (monthlyViews > 50_000) return 15;
  return 8;
}

// ── Reason generation ─────────────────────────────────────────────────────────

function buildReasons(
  breakdown: ScoreBreakdown,
  campaignTargets: string[],
  publisherCategory: string | null,
  monthlyViews: number,
  basePrice: number,
  remainingBudget: number,
  placements: Array<{ impressions: number; clicks: number }>,
): string[] {
  const reasons: string[] = [];

  // Audience
  if (breakdown.audienceOverlap >= 30) {
    const target = campaignTargets[0] ? capitalize(campaignTargets[0]) : 'your';
    reasons.push(`Perfect audience match for ${target} campaigns`);
  } else if (breakdown.audienceOverlap >= 20) {
    const cat = publisherCategory ? capitalize(publisherCategory) : 'this publisher\'s';
    reasons.push(`Related audience fit — ${cat} audience overlaps your campaign targets`);
  }

  // Price
  if (breakdown.priceEfficiency >= 25 && remainingBudget > 0) {
    const pct = ((basePrice / remainingBudget) * 100).toFixed(1);
    reasons.push(`Excellent value — only ${pct}% of remaining campaign budget`);
  } else if (breakdown.priceEfficiency >= 20 && remainingBudget > 0) {
    const pct = ((basePrice / remainingBudget) * 100).toFixed(1);
    reasons.push(`Good value — ${pct}% of remaining campaign budget`);
  }

  // Reach
  if (monthlyViews > 100_000) {
    const views =
      monthlyViews >= 1_000_000
        ? `${(monthlyViews / 1_000_000).toFixed(1)}M`
        : `${Math.round(monthlyViews / 1_000)}K`;
    reasons.push(`Strong reach — ${views} monthly views`);
  }

  // Performance
  const valid = placements.filter((p) => p.impressions > 0);
  if (valid.length === 0) {
    reasons.push('New inventory with promising audience fit');
  } else {
    const totalImpressions = valid.reduce((s, p) => s + p.impressions, 0);
    const totalClicks = valid.reduce((s, p) => s + p.clicks, 0);
    const ctr = totalClicks / totalImpressions;
    if (ctr > 0.005) {
      reasons.push(`Good performance — ${(ctr * 100).toFixed(1)}% average CTR`);
    }
  }

  return reasons.slice(0, 4);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── Main service function ──────────────────────────────────────────────────────

/**
 * Returns the top 5 recommended ad slots for a campaign, or null if the
 * campaign doesn't exist / isn't owned by sponsorId.
 */
export async function getRecommendations(
  campaignId: string,
  sponsorId: string,
): Promise<RecommendationsResponse | null> {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    select: {
      id: true,
      sponsorId: true,
      budget: true,
      spent: true,
      targetCategories: true,
      placements: { select: { adSlotId: true } },
    },
  });

  if (!campaign || campaign.sponsorId !== sponsorId) return null;

  const bookedSlotIds = new Set(campaign.placements.map((p) => p.adSlotId));
  const remainingBudget = toNumber(campaign.budget) - toNumber(campaign.spent);

  const adSlots = await prisma.adSlot.findMany({
    where: { isAvailable: true },
    select: {
      id: true,
      name: true,
      type: true,
      description: true,
      basePrice: true,
      publisher: {
        select: {
          id: true,
          name: true,
          category: true,
          monthlyViews: true,
          subscriberCount: true,
        },
      },
      placements: {
        select: { impressions: true, clicks: true },
      },
    },
  });

  const recommendations: RecommendationResult[] = adSlots
    .filter((slot) => slot.publisher !== null && !bookedSlotIds.has(slot.id))
    .map((slot) => {
      const publisher = slot.publisher!;
      const basePrice = toNumber(slot.basePrice);

      const breakdown: ScoreBreakdown = {
        audienceOverlap: scoreAudienceOverlap(campaign.targetCategories, publisher.category),
        priceEfficiency: scorePriceEfficiency(basePrice, remainingBudget),
        historicalPerformance: scoreHistoricalPerformance(slot.placements),
        contentCategoryMatch: scoreReach(publisher.monthlyViews),
      };

      const matchScore =
        breakdown.audienceOverlap +
        breakdown.priceEfficiency +
        breakdown.historicalPerformance +
        breakdown.contentCategoryMatch;

      const reasons = buildReasons(
        breakdown,
        campaign.targetCategories,
        publisher.category,
        publisher.monthlyViews,
        basePrice,
        remainingBudget,
        slot.placements,
      );

      return {
        adSlotId: slot.id,
        adSlotName: slot.name,
        adSlotType: slot.type,
        description: slot.description,
        basePrice,
        matchScore,
        matchPercentage: matchScore, // max score is 100
        estimatedReach: publisher.monthlyViews,
        publisher: {
          id: publisher.id,
          name: publisher.name,
          category: publisher.category,
          monthlyViews: publisher.monthlyViews,
          subscriberCount: publisher.subscriberCount,
        },
        scoreBreakdown: breakdown,
        reasons,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);

  return { campaignId, recommendations };
}
