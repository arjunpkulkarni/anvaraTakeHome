import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { AdSlotList } from './components/ad-slot-list';
import { CreateAdSlotButton } from './components/create-ad-slot-button';

// eslint-disable-next-line no-process-env
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Ad Slots</h1>
        <CreateAdSlotButton />
      </div>

      <AdSlotList adSlots={adSlots} />
    </div>
  );
}
