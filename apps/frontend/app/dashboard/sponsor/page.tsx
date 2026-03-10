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
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '600', color: '#111827' }}>
            Campaigns
          </h1>
          <CreateCampaignButton />
        </div>

        {/* Tab Filters */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', backgroundColor: 'white', borderRadius: '12px', padding: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
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

        <CampaignList campaigns={campaigns} />
      </div>
    </div>
  );
}
