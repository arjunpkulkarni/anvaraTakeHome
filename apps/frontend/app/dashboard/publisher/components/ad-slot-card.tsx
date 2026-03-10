'use client';

import { useState, useTransition } from 'react';
import { deleteAdSlot, toggleAdSlotAvailability } from '../actions';
import { AdSlotForm } from './ad-slot-form';
import { Button, Card, CardContent } from '@/app/components/ui';

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
      <Card>
        <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)]">Edit Ad Slot</h3>
        <AdSlotForm
          adSlot={adSlot as any}
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
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{adSlot.name}</h3>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${typeColors[adSlot.type] || 'bg-gray-100'}`}>
            {adSlot.type}
          </span>
        </div>

        {adSlot.description && (
          <p className="mb-4 text-sm text-[var(--color-text-secondary)] line-clamp-2">{adSlot.description}</p>
        )}

        <div className="flex items-center justify-between mb-4">
          <span
            className={`text-sm font-medium ${adSlot.isAvailable ? 'text-[var(--color-success)]' : 'text-[var(--color-text-muted)]'}`}
          >
            {adSlot.isAvailable ? '● Available' : '● Booked'}
          </span>
          <span className="text-lg font-semibold text-[var(--color-primary)]">
            ${Number(adSlot.basePrice).toLocaleString()}/mo
          </span>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setIsEditing(true)} disabled={isPending} variant="secondary" size="sm" className="flex-1">
            Edit
          </Button>
          <Button
            onClick={handleToggleAvailability}
            disabled={isPending}
            variant="secondary"
            size="sm"
            className="flex-1"
          >
            {isPending ? '...' : adSlot.isAvailable ? 'Mark Booked' : 'Mark Available'}
          </Button>
          <Button onClick={handleDelete} disabled={isPending} variant="danger" size="sm">
            {isPending ? '...' : 'Delete'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
