'use client';

import { useState, useTransition } from 'react';
import { deleteAdSlot, toggleAdSlotAvailability } from '../actions';
import { AdSlotForm } from './ad-slot-form';
import { useToast } from '@/app/components/ui';

interface AdSlotCardProps {
  adSlot: {
    id: string;
    name: string;
    description?: string;
    type: 'DISPLAY' | 'VIDEO' | 'NEWSLETTER' | 'PODCAST' | 'NATIVE';
    basePrice: number;
    isAvailable: boolean;
  };
}

const typeColorMap: Record<string, { bg: string; color: string }> = {
  DISPLAY: { bg: '#dbeafe', color: '#1d4ed8' },
  VIDEO: { bg: '#fee2e2', color: '#b91c1c' },
  NEWSLETTER: { bg: '#f3e8ff', color: '#7c3aed' },
  PODCAST: { bg: '#ffedd5', color: '#c2410c' },
  NATIVE: { bg: '#dcfce7', color: '#15803d' },
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
        showToast(`Ad slot marked as ${adSlot.isAvailable ? 'booked' : 'available'}`, 'success');
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

  const typeStyle = typeColorMap[adSlot.type] || { bg: '#f3f4f6', color: '#374151' };

  if (isEditing) {
    return (
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        }}
      >
        <h3
          style={{
            fontSize: '18px',
            fontWeight: '700',
            marginBottom: '24px',
            color: '#111827',
          }}
        >
          Edit Ad Slot
        </h3>
        <AdSlotForm
          adSlot={adSlot}
          onSuccess={() => {
            setIsEditing(false);
            showToast('Ad slot updated successfully', 'success');
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  if (isDeleting) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.15)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = '#c7d2fe';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow =
          '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#e5e7eb';
      }}
    >
      {/* Error message */}
      {error && (
        <div
          style={{
            marginBottom: '12px',
            borderRadius: '8px',
            border: '1px solid #fecaca',
            backgroundColor: '#fef2f2',
            padding: '8px 12px',
            fontSize: '12px',
            color: '#dc2626',
          }}
        >
          {error}
        </div>
      )}

      {/* Header: Title + Type Badge */}
      <div
        style={{
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: 0 }}>
          {adSlot.name}
        </h3>
        <span
          style={{
            borderRadius: '9999px',
            padding: '4px 12px',
            fontSize: '11px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            backgroundColor: typeStyle.bg,
            color: typeStyle.color,
            whiteSpace: 'nowrap',
          }}
        >
          {adSlot.type}
        </span>
      </div>

      {/* Description */}
      {adSlot.description && (
        <p
          style={{
            marginTop: 0,
            marginBottom: '0',
            fontSize: '14px',
            color: '#6b7280',
            lineHeight: '1.5',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {adSlot.description}
        </p>
      )}

      {/* Availability + Price Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '16px',
          marginBottom: '16px',
          paddingTop: '16px',
          paddingBottom: '16px',
          borderTop: '1px solid #f3f4f6',
          borderBottom: '1px solid #f3f4f6',
        }}
      >
        <span
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: adSlot.isAvailable ? '#10b981' : '#9ca3af',
          }}
        >
          ● {adSlot.isAvailable ? 'Available' : 'Booked'}
        </span>
        <span
          style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#4f46e5',
          }}
        >
          ${Number(adSlot.basePrice).toLocaleString()}/mo
        </span>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setIsEditing(true)}
          disabled={isPending}
          style={{
            flex: 1,
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: '600',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
            color: '#374151',
            cursor: isPending ? 'not-allowed' : 'pointer',
            opacity: isPending ? 0.6 : 1,
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          }}
          onMouseEnter={(e) => {
            if (!isPending) {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#d1d5db';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}
        >
          Edit
        </button>
        <button
          onClick={handleToggleAvailability}
          disabled={isPending}
          style={{
            flex: 1,
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: '600',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
            color: '#374151',
            cursor: isPending ? 'not-allowed' : 'pointer',
            opacity: isPending ? 0.6 : 1,
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          }}
          onMouseEnter={(e) => {
            if (!isPending) {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#d1d5db';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}
        >
          {isPending ? '...' : adSlot.isAvailable ? 'Mark Booked' : 'Mark Available'}
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          style={{
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: '600',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#ef4444',
            color: '#ffffff',
            cursor: isPending ? 'not-allowed' : 'pointer',
            opacity: isPending ? 0.6 : 1,
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          }}
          onMouseEnter={(e) => {
            if (!isPending) {
              e.currentTarget.style.backgroundColor = '#dc2626';
              e.currentTarget.style.boxShadow =
                '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ef4444';
            e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
          }}
        >
          {isPending ? '...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
