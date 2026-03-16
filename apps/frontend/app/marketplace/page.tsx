'use client';

import { useState, useEffect } from 'react';
import { AdSlotGrid } from './components/ad-slot-grid';
import { NewsletterSignup } from '../components/newsletter-signup';
import { FilterBar } from '../components/filter-bar';
import { getAdSlots } from '@/lib/api';

type FilterType = 'all' | 'available' | 'premium';

export default function MarketplacePage() {
  const [filter, setFilter] = useState<FilterType>('available');
  const [availableCount, setAvailableCount] = useState<number | null>(null);
  const [isLoadingCount, setIsLoadingCount] = useState(true);

  // Fetch available count
  useEffect(() => {
    const fetchAvailableCount = async () => {
      try {
        const adSlots = await getAdSlots();
        const available = adSlots.filter(slot => slot.isAvailable).length;
        setAvailableCount(available);
      } catch (error) {
        console.error('Failed to fetch available count:', error);
        setAvailableCount(null);
      } finally {
        setIsLoadingCount(false);
      }
    };

    fetchAvailableCount();
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <h1
              style={{
                fontSize: '36px',
                fontWeight: '700',
                color: '#111827',
                letterSpacing: '-0.02em',
              }}
            >
              Marketplace
            </h1>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#f0fdf4',
                color: '#15803d',
                border: '1px solid #86efac',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
              }}
            >
              {isLoadingCount ? (
                <span>Loading...</span>
              ) : availableCount !== null ? (
                <span>{availableCount} Available</span>
              ) : (
                <span>-- Available</span>
              )}
            </div>
          </div>
          <p style={{ fontSize: '17px', color: '#4b5563', lineHeight: '1.6', maxWidth: '640px' }}>
            Discover high-impact advertising placements with verified publishers. Reach engaged
            audiences and grow your brand with authentic sponsorships.
          </p>
        </div>

        {/* Tab Filters */}
        <FilterBar
          filters={['available', 'premium', 'all'] as const}
          activeFilter={filter}
          onFilterChange={setFilter}
        />

        {/* Newsletter Signup - Strategic placement before listings */}
        <div style={{ marginBottom: '32px' }}>
          <NewsletterSignup placement="marketplace_top" />
        </div>

        <AdSlotGrid filter={filter} />
      </div>
    </div>
  );
}
