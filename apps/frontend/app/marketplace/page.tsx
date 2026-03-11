'use client';

import { useState } from 'react';
import { AdSlotGrid } from './components/ad-slot-grid';

type FilterType = 'all' | 'available' | 'premium';

export default function MarketplacePage() {
  const [filter, setFilter] = useState<FilterType>('all');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
            Marketplace
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280' }}>
            Browse available ad slots from our publishers
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', backgroundColor: 'white', borderRadius: '12px', padding: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <button
              onClick={() => setFilter('all')}
              style={{
                padding: '8px 24px',
                borderRadius: '8px',
                backgroundColor: filter === 'all' ? 'white' : 'transparent',
                color: filter === 'all' ? '#111827' : '#6b7280',
                fontWeight: '500',
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: filter === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              All
            </button>
            <button
              onClick={() => setFilter('available')}
              style={{
                padding: '8px 24px',
                borderRadius: '8px',
                backgroundColor: filter === 'available' ? 'white' : 'transparent',
                color: filter === 'available' ? '#111827' : '#6b7280',
                fontWeight: '500',
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: filter === 'available' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              Available
            </button>
            <button
              onClick={() => setFilter('premium')}
              style={{
                padding: '8px 24px',
                borderRadius: '8px',
                backgroundColor: filter === 'premium' ? 'white' : 'transparent',
                color: filter === 'premium' ? '#111827' : '#6b7280',
                fontWeight: '500',
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: filter === 'premium' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              Premium
            </button>
          </div>
        </div>

        <AdSlotGrid filter={filter} />
      </div>
    </div>
  );
}
