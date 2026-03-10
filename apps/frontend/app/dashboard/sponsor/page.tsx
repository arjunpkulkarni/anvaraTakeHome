import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { CampaignList } from './components/campaign-list';
import { CreateCampaignButton } from './components/create-campaign-button';

// eslint-disable-next-line no-process-env
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

async function getCampaigns(sponsorId: string) {
  try {
    const res = await fetch(`${API_URL}/api/campaigns?sponsorId=${sponsorId}`, {
      cache: 'no-store',
      headers: {
        Cookie: (await cookies()).toString(),
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch campaigns');
    }

    return await res.json();
  } catch (error) {
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

  // Fetch campaigns on the server
  const campaigns = roleData.sponsorId ? await getCampaigns(roleData.sponsorId) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Campaigns</h1>
        <CreateCampaignButton />
      </div>

      <CampaignList campaigns={campaigns} />
    </div>
  );
}
