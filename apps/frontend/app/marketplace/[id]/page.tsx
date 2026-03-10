import type { Metadata } from 'next';
import { AdSlotDetail } from './components/ad-slot-detail';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Await params to satisfy Next.js requirements
  await params;
  
  // In a real app, you would fetch the ad slot data here to generate dynamic metadata
  // For now, we'll use a generic template
  return {
    title: 'Ad Slot Details',
    description: 'View detailed information about this advertising slot including pricing, specifications, and availability.',
    openGraph: {
      title: 'Ad Slot Details | Anvara Marketplace',
      description: 'Explore this premium advertising opportunity. View pricing, audience metrics, and booking details.',
      type: 'website',
    },
  };
}

export default async function AdSlotPage({ params }: Props) {
  const { id } = await params;

  return <AdSlotDetail id={id} />;
}
