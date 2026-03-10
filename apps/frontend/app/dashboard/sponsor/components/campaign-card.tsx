'use client';

import { useState, useTransition } from 'react';
import { deleteCampaign, updateCampaignStatus } from '../actions';
import { CampaignForm } from './campaign-form';

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
      <div className="rounded-lg border border-[--color-border] p-4">
        <h3 className="font-semibold mb-4">Edit Campaign</h3>
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
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[--color-border] p-4">
      {error && (
        <div className="mb-3 rounded border border-red-200 bg-red-50 p-2 text-xs text-red-600">
          {error}
        </div>
      )}

      <div className="mb-2 flex items-start justify-between">
        <h3 className="font-semibold">{campaign.name}</h3>
        <span
          className={`rounded px-2 py-0.5 text-xs ${statusColors[campaign.status] || 'bg-gray-100'}`}
        >
          {campaign.status}
        </span>
      </div>

      {campaign.description && (
        <p className="mb-3 text-sm text-[--color-muted] line-clamp-2">{campaign.description}</p>
      )}

      <div className="mb-2">
        <div className="flex justify-between text-sm">
          <span className="text-[--color-muted]">Budget</span>
          <span>
            ${Number(campaign.spent).toLocaleString()} / ${Number(campaign.budget).toLocaleString()}
          </span>
        </div>
        <div className="mt-1 h-1.5 rounded-full bg-gray-200">
          <div
            className="h-1.5 rounded-full bg-[--color-primary]"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      <div className="text-xs text-[--color-muted] mb-3">
        {new Date(campaign.startDate).toLocaleDateString()} -{' '}
        {new Date(campaign.endDate).toLocaleDateString()}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          disabled={isPending}
          className="flex-1 rounded border border-[--color-border] px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          Edit
        </button>
        {(campaign.status === 'ACTIVE' || campaign.status === 'PAUSED') && (
          <button
            onClick={handleToggleStatus}
            disabled={isPending}
            className="flex-1 rounded border border-[--color-border] px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            {isPending ? '...' : campaign.status === 'ACTIVE' ? 'Pause' : 'Activate'}
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="rounded border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          {isPending ? '...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
