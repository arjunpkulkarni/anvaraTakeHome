import type { Metadata } from 'next';
import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { SponsorDashboardClient } from './components/sponsor-dashboard-client';

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

  return <SponsorDashboardClient campaigns={campaigns} />;
}
