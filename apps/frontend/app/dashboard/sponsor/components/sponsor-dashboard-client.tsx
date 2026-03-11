'use client';

import { useState } from 'react';
import { CampaignList } from './campaign-list';
import { CreateCampaignButton } from './create-campaign-button';
import { CustomButton } from '@/app/components/custom-button';

interface Campaign {
  id: string;
  name: string;
  description?: string;
  budget: number;
  spent: number;
  status: string;
  startDate: string;
  endDate: string;
}

interface SponsorDashboardClientProps {
  campaigns: Campaign[];
}

type FilterType = 'all' | 'active' | 'draft' | 'completed';

export function SponsorDashboardClient({ campaigns }: SponsorDashboardClientProps) {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredCampaigns = campaigns.filter(campaign => {
    if (filter === 'all') return true;
    if (filter === 'active') return campaign.status === 'ACTIVE';
    if (filter === 'draft') return campaign.status === 'DRAFT';
    if (filter === 'completed') return campaign.status === 'COMPLETED' || campaign.status === 'PAUSED';
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
              Campaigns
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              {campaigns.length} total campaign{campaigns.length !== 1 ? 's' : ''}
            </p>
          </div>
          <CreateCampaignButton />
        </div>

        {/* Tab Filters */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', backgroundColor: 'white', borderRadius: '12px', padding: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', gap: '4px' }}>
            <CustomButton
              variant={filter === 'all' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </CustomButton>
            <CustomButton
              variant={filter === 'active' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('active')}
            >
              Active
            </CustomButton>
            <CustomButton
              variant={filter === 'draft' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('draft')}
            >
              Draft
            </CustomButton>
            <CustomButton
              variant={filter === 'completed' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Completed
            </CustomButton>
          </div>
        </div>

        <CampaignList campaigns={filteredCampaigns} />
      </div>
    </div>
  );
}
