import type { Metadata } from 'next';
import { AdSlotGrid } from './components/ad-slot-grid';

// FIXME: This page fetches all ad slots client-side. Consider:
// 1. Server-side pagination with searchParams
// 2. Filtering by category, price range, slot type
// 3. Search functionality

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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="space-y-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)]">Marketplace</h1>
          <p className="text-[var(--color-text-secondary)] mt-2">Browse available ad slots from our publishers</p>
          {/* TODO: Add search input and filter controls */}
        </div>
      </header>

      <AdSlotGrid />
    </div>
  );
}
