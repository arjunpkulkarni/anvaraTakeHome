import { describe, it, expect } from 'vitest';
import {
  scoreAudienceOverlap,
  scorePriceEfficiency,
  scoreHistoricalPerformance,
  scoreReach,
} from './services/recommendationService.js';

describe('Recommendation scoring', () => {
  describe('scoreAudienceOverlap', () => {
    it('returns 30 for a direct category match', () => {
      expect(scoreAudienceOverlap(['technology'], 'technology')).toBe(30);
    });

    it('returns 20 for a related category match', () => {
      // 'startups' is in the related list for 'technology'
      expect(scoreAudienceOverlap(['technology'], 'startups')).toBe(20);
    });

    it('returns 20 for a reverse-related match', () => {
      // 'business' maps technology as a related category
      expect(scoreAudienceOverlap(['business'], 'technology')).toBe(20);
    });

    it('returns 5 when there is no category match', () => {
      expect(scoreAudienceOverlap(['technology'], 'fashion')).toBe(5);
    });

    it('returns 5 when publisher category is null', () => {
      expect(scoreAudienceOverlap(['technology'], null)).toBe(5);
    });

    it('handles multiple target categories and matches any', () => {
      expect(scoreAudienceOverlap(['health', 'technology'], 'startups')).toBe(20);
    });
  });

  describe('scorePriceEfficiency', () => {
    it('returns 25 when price is under 10% of remaining budget', () => {
      expect(scorePriceEfficiency(50, 1000)).toBe(25);
    });

    it('returns 20 when price is between 10% and 20% of remaining budget', () => {
      expect(scorePriceEfficiency(150, 1000)).toBe(20);
    });

    it('returns 15 when price is between 20% and 35% of remaining budget', () => {
      expect(scorePriceEfficiency(250, 1000)).toBe(15);
    });

    it('returns 5 when price exceeds 35% of remaining budget', () => {
      expect(scorePriceEfficiency(400, 1000)).toBe(5);
    });

    it('returns 0 when remaining budget is 0', () => {
      expect(scorePriceEfficiency(100, 0)).toBe(0);
    });

    it('returns 0 when remaining budget is negative', () => {
      expect(scorePriceEfficiency(100, -500)).toBe(0);
    });
  });

  describe('scoreHistoricalPerformance', () => {
    it('returns neutral fallback of 10 when no placement data exists', () => {
      expect(scoreHistoricalPerformance([])).toBe(10);
    });

    it('ignores placements with 0 impressions', () => {
      expect(scoreHistoricalPerformance([{ impressions: 0, clicks: 5 }])).toBe(10);
    });

    it('returns 20 for CTR above 2%', () => {
      expect(scoreHistoricalPerformance([{ impressions: 1000, clicks: 25 }])).toBe(20);
    });

    it('returns 15 for CTR between 1% and 2%', () => {
      expect(scoreHistoricalPerformance([{ impressions: 1000, clicks: 15 }])).toBe(15);
    });

    it('returns 10 for CTR between 0.5% and 1%', () => {
      expect(scoreHistoricalPerformance([{ impressions: 1000, clicks: 7 }])).toBe(10);
    });

    it('returns 5 for CTR below 0.5%', () => {
      expect(scoreHistoricalPerformance([{ impressions: 10_000, clicks: 10 }])).toBe(5);
    });

    it('aggregates multiple placements correctly', () => {
      // combined: 2000 impressions, 50 clicks = 2.5% CTR
      expect(
        scoreHistoricalPerformance([
          { impressions: 1000, clicks: 25 },
          { impressions: 1000, clicks: 25 },
        ]),
      ).toBe(20);
    });
  });

  describe('scoreReach', () => {
    it('returns 25 for over 500K monthly views', () => {
      expect(scoreReach(600_000)).toBe(25);
    });

    it('returns 20 for 100K–500K monthly views', () => {
      expect(scoreReach(250_000)).toBe(20);
    });

    it('returns 15 for 50K–100K monthly views', () => {
      expect(scoreReach(75_000)).toBe(15);
    });

    it('returns 8 for under 50K monthly views', () => {
      expect(scoreReach(10_000)).toBe(8);
    });
  });

  describe('overall ranking logic', () => {
    it('direct category match outranks no match', () => {
      const directMatch = scoreAudienceOverlap(['technology'], 'technology');
      const noMatch = scoreAudienceOverlap(['technology'], 'fashion');
      expect(directMatch).toBeGreaterThan(noMatch);
    });

    it('cheap, well-matched slot outranks expensive, poor-fit slot', () => {
      // Slot A: perfect fit, cheap, high reach, good history
      const slotAScore =
        scoreAudienceOverlap(['technology'], 'technology') + // 30
        scorePriceEfficiency(50, 1000) + // 25
        scoreHistoricalPerformance([{ impressions: 1000, clicks: 25 }]) + // 20
        scoreReach(600_000); // 25 → total 100

      // Slot B: no fit, expensive, low reach, no history
      const slotBScore =
        scoreAudienceOverlap(['technology'], 'fashion') + // 5
        scorePriceEfficiency(900, 1000) + // 5
        scoreHistoricalPerformance([]) + // 10
        scoreReach(5_000); // 8 → total 28

      expect(slotAScore).toBeGreaterThan(slotBScore);
    });

    it('max possible score is 100', () => {
      const maxScore =
        scoreAudienceOverlap(['technology'], 'technology') + // 30
        scorePriceEfficiency(10, 1000) + // 25
        scoreHistoricalPerformance([{ impressions: 1000, clicks: 30 }]) + // 20
        scoreReach(600_000); // 25
      expect(maxScore).toBe(100);
    });
  });
});
