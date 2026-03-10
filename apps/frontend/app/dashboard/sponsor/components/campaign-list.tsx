import { CampaignCard } from './campaign-card';

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
      <div className="rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-background-secondary)] p-12 text-center">
        <div className="mx-auto max-w-sm">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
            No campaigns yet
          </h3>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Create your first campaign to start advertising your products and services.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}
