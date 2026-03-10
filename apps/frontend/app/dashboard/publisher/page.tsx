import type { Metadata } from 'next';
import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { AdSlotList } from './components/ad-slot-list';
import { CreateAdSlotButton } from './components/create-ad-slot-button';

// eslint-disable-next-line no-process-env
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

export const metadata: Metadata = {
  title: 'My Ad Slots - Publisher Dashboard',
  description: 'Manage your advertising inventory, monitor bookings, and maximize your monetization. Track ad slot performance and availability.',
  robots: {
    index: false, // Dashboard pages should not be indexed
    follow: false,
  },
};

interface AdSlot {
  id: string;
  name: string;
  description?: string;
  type: 'DISPLAY' | 'VIDEO' | 'NATIVE' | 'NEWSLETTER' | 'PODCAST';
  basePrice: number;
  isAvailable: boolean;
  publisher?: {
    id: string;
    name: string;
  };
}

async function getAdSlots(publisherId: string): Promise<AdSlot[]> {
  try {
    const res = await fetch(`${API_URL}/api/ad-slots?publisherId=${publisherId}`, {
      cache: 'no-store',
      headers: {
        Cookie: (await cookies()).toString(),
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch ad slots');
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching ad slots:', error);
    return [];
  }
}

export default async function PublisherDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  // Verify user has 'publisher' role
  const roleData = await getUserRole(session.user.id);
  if (roleData.role !== 'publisher') {
    redirect('/');
  }

  // Fetch ad slots on the server
  const adSlots = roleData.publisherId ? await getAdSlots(roleData.publisherId) : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)]">My Ad Slots</h1>
          <CreateAdSlotButton />
        </div>
        <p className="text-[var(--color-text-secondary)]">
          Manage your available ad slots and monitor bookings
        </p>
      </header>

      <AdSlotList adSlots={adSlots} />
    </div>
  );
}
