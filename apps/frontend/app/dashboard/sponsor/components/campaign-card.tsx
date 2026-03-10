'use client';

import { useState, useTransition } from 'react';
import { deleteCampaign, updateCampaignStatus } from '../actions';
import { CampaignForm } from './campaign-form';
import { Button, Card, CardContent } from '@/app/components/ui';

interface CampaignCardProps {
  campaign: {
    id: string;
    name: string;
    description?: string;
    budget: number;
    spent: number;
    status: string;
    startDate: string;
    endDate: string;
  };
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-600',
  ACTIVE: 'bg-green-100 text-green-700',
  PAUSED: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
};

export function CampaignCard({ campaign }: CampaignCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const progress =
    campaign.budget > 0 ? (Number(campaign.spent) / Number(campaign.budget)) * 100 : 0;

  const handleToggleStatus = () => {
    const newStatus = campaign.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    startTransition(async () => {
      const result = await updateCampaignStatus(
        campaign.id,
        newStatus as 'ACTIVE' | 'PAUSED' | 'COMPLETED'
      );
      if (result.error) {
        setError(result.error);
      }
    });
  };

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this campaign?')) {
      return;
    }

    startTransition(async () => {
      const result = await deleteCampaign(campaign.id);
      if (result.error) {
        setError(result.error);
      }
    });
  };

  if (isEditing) {
    return (
      <Card>
        <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)]">Edit Campaign</h3>
        <CampaignForm
          campaign={
            campaign as unknown as {
              id: string;
              name: string;
              description?: string;
              budget: number;
              cpmRate?: number;
              cpcRate?: number;
              startDate: string;
              endDate: string;
              status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
            }
          }
          onSuccess={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
      </Card>
    );
  }

  return (
    <Card hover>
      <CardContent>
        {error && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-[var(--color-error)]">
            {error}
          </div>
        )}

        <div className="mb-3 flex items-start justify-between">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{campaign.name}</h3>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[campaign.status] || 'bg-gray-100'}`}
          >
            {campaign.status}
          </span>
        </div>

        {campaign.description && (
          <p className="mb-4 text-sm text-[var(--color-text-secondary)] line-clamp-2">{campaign.description}</p>
        )}

        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-[var(--color-text-secondary)]">Budget</span>
            <span className="font-medium text-[var(--color-text-primary)]">
              ${Number(campaign.spent).toLocaleString()} / ${Number(campaign.budget).toLocaleString()}
            </span>
          </div>
          <div className="h-2 rounded-full bg-[var(--color-background-secondary)] overflow-hidden">
            <div
              className="h-2 rounded-full bg-[var(--color-primary)] transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="text-xs text-[var(--color-text-secondary)] mb-4">
          {new Date(campaign.startDate).toLocaleDateString()} -{' '}
          {new Date(campaign.endDate).toLocaleDateString()}
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setIsEditing(true)} disabled={isPending} variant="secondary" size="sm" className="flex-1">
            Edit
          </Button>
          {(campaign.status === 'ACTIVE' || campaign.status === 'PAUSED') && (
            <Button onClick={handleToggleStatus} disabled={isPending} variant="secondary" size="sm" className="flex-1">
              {isPending ? '...' : campaign.status === 'ACTIVE' ? 'Pause' : 'Activate'}
            </Button>
          )}
          <Button onClick={handleDelete} disabled={isPending} variant="danger" size="sm">
            {isPending ? '...' : 'Delete'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
