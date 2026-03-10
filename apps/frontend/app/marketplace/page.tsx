import type { Metadata } from 'next';
import { AdSlotGrid } from './components/ad-slot-grid';

export const metadata: Metadata = {
  title: 'Marketplace - Browse Ad Slots',
  description: 'Browse available advertising slots from premium publishers. Find the perfect placement for your campaigns across video, display, podcast, and newsletter formats.',
  openGraph: {
    title: 'Marketplace - Browse Ad Slots | Anvara',
    description: 'Discover premium advertising opportunities from top publishers. Connect with your target audience through curated ad placements.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marketplace - Browse Ad Slots | Anvara',
    description: 'Discover premium advertising opportunities from top publishers.',
  },
};

export default function MarketplacePage() {
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
              style={{
                padding: '8px 24px',
                borderRadius: '8px',
                backgroundColor: 'white',
                color: '#111827',
                fontWeight: '500',
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              All
            </button>
            <button
              style={{
                padding: '8px 24px',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                color: '#6b7280',
                fontWeight: '500',
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Available
            </button>
            <button
              style={{
                padding: '8px 24px',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                color: '#6b7280',
                fontWeight: '500',
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Premium
            </button>
          </div>
        </div>

        <AdSlotGrid />
      </div>
    </div>
  );
}
