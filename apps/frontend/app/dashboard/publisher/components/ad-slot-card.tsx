'use client';

import { useState, useTransition } from 'react';
import { deleteAdSlot, toggleAdSlotAvailability } from '../actions';
import { AdSlotForm } from './ad-slot-form';

interface AdSlotCardProps {
  adSlot: {
    id: string;
    name: string;
    description?: string;
    type: string;
    basePrice: number;
    isAvailable: boolean;
  };
}

const typeColors: Record<string, string> = {
  DISPLAY: 'bg-blue-100 text-blue-700',
  VIDEO: 'bg-red-100 text-red-700',
  NEWSLETTER: 'bg-purple-100 text-purple-700',
  PODCAST: 'bg-orange-100 text-orange-700',
  NATIVE: 'bg-green-100 text-green-700',
};

export function AdSlotCard({ adSlot }: AdSlotCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleToggleAvailability = () => {
    startTransition(async () => {
      const result = await toggleAdSlotAvailability(adSlot.id, adSlot.isAvailable);
      if (result.error) {
        setError(result.error);
      }
    });
  };

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this ad slot?')) {
      return;
    }

    startTransition(async () => {
      const result = await deleteAdSlot(adSlot.id);
      if (result.error) {
        setError(result.error);
      }
    });
  };

  if (isEditing) {
    return (
      <div className="rounded-lg border border-[--color-border] p-4">
        <h3 className="font-semibold mb-4">Edit Ad Slot</h3>
        <AdSlotForm
          adSlot={adSlot as any}
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
        <h3 className="font-semibold">{adSlot.name}</h3>
        <span className={`rounded px-2 py-0.5 text-xs ${typeColors[adSlot.type] || 'bg-gray-100'}`}>
          {adSlot.type}
        </span>
      </div>

      {adSlot.description && (
        <p className="mb-3 text-sm text-[--color-muted] line-clamp-2">{adSlot.description}</p>
      )}

      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-sm ${adSlot.isAvailable ? 'text-green-600' : 'text-[--color-muted]'}`}
        >
          {adSlot.isAvailable ? 'Available' : 'Booked'}
        </span>
        <span className="font-semibold text-[--color-primary]">
          ${Number(adSlot.basePrice).toLocaleString()}/mo
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          disabled={isPending}
          className="flex-1 rounded border border-[--color-border] px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          Edit
        </button>
        <button
          onClick={handleToggleAvailability}
          disabled={isPending}
          className="flex-1 rounded border border-[--color-border] px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          {isPending ? '...' : adSlot.isAvailable ? 'Mark Booked' : 'Mark Available'}
        </button>
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
