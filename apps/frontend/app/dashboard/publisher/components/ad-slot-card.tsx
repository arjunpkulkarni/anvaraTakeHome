'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { deleteAdSlot, toggleAdSlotAvailability } from '../actions';
import { AdSlotForm } from './ad-slot-form';
import { Button, Card, CardContent, useToast } from '@/app/components/ui';

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
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  const handleToggleAvailability = () => {
    startTransition(async () => {
      const result = await toggleAdSlotAvailability(adSlot.id, adSlot.isAvailable);
      if (result.error) {
        setError(result.error);
        showToast(result.error, 'error');
      } else {
        showToast(
          `Ad slot marked as ${adSlot.isAvailable ? 'booked' : 'available'}`,
          'success'
        );
      }
    });
  };

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this ad slot?')) {
      return;
    }

    setIsDeleting(true);
    startTransition(async () => {
      const result = await deleteAdSlot(adSlot.id);
      if (result.error) {
        setError(result.error);
        setIsDeleting(false);
        showToast(result.error, 'error');
      } else {
        showToast('Ad slot deleted successfully', 'success');
      }
    });
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)]">Edit Ad Slot</h3>
          <AdSlotForm
            adSlot={adSlot}
            onSuccess={() => {
              setIsEditing(false);
              showToast('Ad slot updated successfully', 'success');
            }}
            onCancel={() => setIsEditing(false)}
          />
        </Card>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!isDeleting && (
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -100, height: 0 }}
          transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
        >
          <Card hover animate>
            <CardContent>
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="mb-3 rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-[var(--color-error)]"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mb-3 flex items-start justify-between">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{adSlot.name}</h3>
                <motion.span 
                  className={`rounded-full px-3 py-1 text-xs font-medium ${typeColors[adSlot.type] || 'bg-gray-100'}`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {adSlot.type}
                </motion.span>
              </div>

              {adSlot.description && (
                <p className="mb-4 text-sm text-[var(--color-text-secondary)] line-clamp-2">{adSlot.description}</p>
              )}

              <div className="flex items-center justify-between mb-4">
                <motion.span
                  className={`text-sm font-medium ${adSlot.isAvailable ? 'text-[var(--color-success)]' : 'text-[var(--color-text-muted)]'}`}
                  animate={{ 
                    scale: adSlot.isAvailable ? [1, 1.1, 1] : 1,
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: adSlot.isAvailable ? Infinity : 0,
                    ease: 'easeInOut',
                  }}
                >
                  ● {adSlot.isAvailable ? 'Available' : 'Booked'}
                </motion.span>
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
