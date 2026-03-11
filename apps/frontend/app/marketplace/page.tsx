'use client';

import { useState } from 'react';
import { AdSlotGrid } from './components/ad-slot-grid';
import { NewsletterSignup } from '../components/newsletter-signup';
import { FilterBar } from '../components/filter-bar';

type FilterType = 'all' | 'available' | 'premium';

export default function MarketplacePage() {
  const [filter, setFilter] = useState<FilterType>('all');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: '700', color: '#111827', letterSpacing: '-0.02em' }}>
              Marketplace
            </h1>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px',
              backgroundColor: '#f0fdf4',
              color: '#15803d',
              border: '1px solid #86efac',
              padding: '4px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              <span>24 Available</span>
            </div>
          </div>
          <p style={{ fontSize: '17px', color: '#4b5563', lineHeight: '1.6', maxWidth: '640px' }}>
            Discover high-impact advertising placements with verified publishers. Reach engaged audiences and grow your brand with authentic sponsorships.
          </p>
          
          {/* Trust signals */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '24px', 
            marginTop: '16px',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg style={{ width: '16px', height: '16px', color: '#10b981' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Verified publishers</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg style={{ width: '16px', height: '16px', color: '#f59e0b' }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>4.8 avg rating</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg style={{ width: '16px', height: '16px', color: '#8b5cf6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>2.5-3x avg ROI</span>
            </div>
          </div>
        </div>

        {/* Tab Filters */}
        <FilterBar
          filters={['all', 'available', 'premium'] as const}
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
