import type { Metadata } from 'next';
import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { AdSlotList } from './components/ad-slot-list';
import { CreateAdSlotButton } from './components/create-ad-slot-button';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

export const metadata: Metadata = {
  title: 'My Ad Slots - Publisher Dashboard',
  description:
    'Manage your advertising inventory, monitor bookings, and maximize your monetization. Track ad slot performance and availability.',
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
          }}
        >
          <h1 style={{ fontSize: '32px', fontWeight: '600', color: '#111827' }}>Listings</h1>
          <CreateAdSlotButton />
        </div>

        {/* Tab Filters */}
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              display: 'inline-flex',
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '4px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
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
              Active
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
              Draft
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
              Archived
            </button>
          </div>
        </div>

        <AdSlotList adSlots={adSlots} />
      </div>
    </div>
  );
}
