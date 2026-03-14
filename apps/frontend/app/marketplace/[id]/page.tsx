import type { Metadata } from 'next';
import { AdSlotDetail } from './components/ad-slot-detail';

interface Props {
  params: Promise<{ id: string }>;
}

interface AdSlot {
  id: string;
  name: string;
  description?: string;
  type: string;
  basePrice: number;
  isAvailable: boolean;
  publisher?: {
    id: string;
    name: string;
    website?: string;
  };
}

async function getAdSlot(id: string): Promise<AdSlot | null> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';
    const res = await fetch(`${API_URL}/api/ad-slots/${id}`, {
      cache: 'no-store', // Always fetch fresh data for metadata
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch {
    return null;
  }
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  // Fetch the ad slot data for dynamic metadata
  const adSlot = await getAdSlot(id);

  if (!adSlot) {
    return {
      title: 'Ad Slot Not Found | Anvara Marketplace',
      description: 'The advertising placement you are looking for could not be found.',
    };
  }

  const title = `${adSlot.name} by ${adSlot.publisher?.name || 'Publisher'}`;
  const description =
    adSlot.description ||
    `Premium ${adSlot.type.toLowerCase()} advertising placement. ${formatPrice(adSlot.basePrice)} per month. ${adSlot.isAvailable ? 'Available now' : 'Currently booked'}.`;

  const shortDescription =
    description.length > 160 ? description.slice(0, 157) + '...' : description;

  return {
    title,
    description: shortDescription,
    openGraph: {
      title: `${title} | Anvara Marketplace`,
      description: shortDescription,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: shortDescription,
    },
  };
}

export default async function AdSlotPage({ params }: Props) {
  const { id } = await params;

  return <AdSlotDetail id={id} />;
}
