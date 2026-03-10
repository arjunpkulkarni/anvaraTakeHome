import type { Metadata } from 'next';
import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { CampaignList } from './components/campaign-list';
import { CreateCampaignButton } from './components/create-campaign-button';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

export const metadata: Metadata = {
  title: 'My Campaigns - Sponsor Dashboard',
  description: 'Manage your advertising campaigns, track performance, and optimize your sponsorship strategy. View campaign analytics and booking details.',
  robots: {
    index: false, // Dashboard pages should not be indexed
    follow: false,
  },
};

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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)]">My Campaigns</h1>
          <CreateCampaignButton />
        </div>
        <p className="text-[var(--color-text-secondary)]">
          Manage your advertising campaigns and track their performance
        </p>
      </header>

      <CampaignList campaigns={campaigns} />
    </div>
  );
}
