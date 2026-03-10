import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { CampaignList } from './components/campaign-list';

// eslint-disable-next-line turbo/no-undeclared-env-vars
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

async function getCampaigns(sponsorId: string, requestHeaders: Headers) {
  try {
    // Forward cookies to the backend for authentication
    const cookieHeader = requestHeaders.get('cookie') || '';

    const res = await fetch(`${API_URL}/api/campaigns?sponsorId=${sponsorId}`, {
      cache: 'no-store', // Always fetch fresh data
      headers: {
        Cookie: cookieHeader,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch campaigns');
    }

    return await res.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching campaigns:', error);
    return [];
  }
}

export default async function SponsorDashboard() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session?.user) {
    redirect('/login');
  }

  // Verify user has 'sponsor' role
  const roleData = await getUserRole(session.user.id);
  if (roleData.role !== 'sponsor') {
    redirect('/');
  }

  // Fetch campaigns on the server, passing headers for authentication
  const campaigns = roleData.sponsorId ? await getCampaigns(roleData.sponsorId, headersList) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Campaigns</h1>
        {/* TODO: Add CreateCampaignButton here */}
      </div>

      <CampaignList campaigns={campaigns} />
    </div>
  );
}
