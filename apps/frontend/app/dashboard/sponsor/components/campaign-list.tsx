'use client';

import { CampaignCard } from './campaign-card';
import { EmptyState } from '@/app/components/ui';

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

interface CampaignListProps {
  campaigns: Campaign[];
}

export function CampaignList({ campaigns }: CampaignListProps) {
  if (campaigns.length === 0) {
    return (
      <EmptyState
        icon="📢"
        title="No campaigns yet"
        description="Create your first campaign to start reaching your target audience and growing your business."
        action={{
          label: 'Create Your First Campaign',
          onClick: () => {
            // Trigger the create campaign button
            document.querySelector<HTMLButtonElement>('[data-create-campaign]')?.click();
          },
        }}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}
