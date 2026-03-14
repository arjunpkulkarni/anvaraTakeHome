'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { deleteCampaign, updateCampaignStatus } from '../actions';
import { CampaignForm } from './campaign-form';
import { Card, CardContent } from '@/app/components/ui';
import { useToast } from '@/app/components/ui';

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
  PENDING_REVIEW: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-indigo-100 text-indigo-700',
  ACTIVE: 'bg-green-100 text-green-700',
  PAUSED: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const formatStatus = (status: string): string => {
  return status
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

export function CampaignCard({ campaign }: CampaignCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  const progress =
    campaign.budget > 0 ? (Number(campaign.spent) / Number(campaign.budget)) * 100 : 0;

  const handleToggleStatus = () => {
    const newStatus = campaign.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    startTransition(async () => {
      const result = await updateCampaignStatus(
        campaign.id,
        newStatus as 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED'
      );
      if (result.error) {
        setError(result.error);
        showToast(result.error, 'error');
      } else {
        showToast(`Campaign ${newStatus.toLowerCase()}`, 'success');
      }
    });
  };

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this campaign?')) {
      return;
    }

    setIsDeleting(true);
    startTransition(async () => {
      const result = await deleteCampaign(campaign.id);
      if (result.error) {
        setError(result.error);
        setIsDeleting(false);
        showToast(result.error, 'error');
      } else {
        showToast('Campaign deleted successfully', 'success');
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
            onSuccess={() => {
              setIsEditing(false);
              showToast('Campaign updated successfully', 'success');
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

              {/* Header with Title and Status */}
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)] truncate">{campaign.name}</h3>
                  {campaign.description && (
                    <p className="mt-1 text-sm text-[var(--color-text-secondary)] line-clamp-2">{campaign.description}</p>
                  )}
                </div>
                <motion.span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusColors[campaign.status] || 'bg-gray-100'}`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {formatStatus(campaign.status)}
                </motion.span>
              </div>

              {/* Stats Grid */}
              <div className="mb-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="text-xs text-[var(--color-text-secondary)] mb-1">Budget</div>
                  <div className="text-base font-bold text-[var(--color-text-primary)]">
                    ${Number(campaign.budget).toLocaleString()}
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="text-xs text-[var(--color-text-secondary)] mb-1">Spent</div>
                  <div className="text-base font-bold text-[var(--color-text-primary)]">
                    ${Number(campaign.spent).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-[var(--color-text-secondary)]">Budget Used</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    {Math.min(progress, 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[var(--color-background-secondary)] overflow-hidden">
                  <motion.div
                    className={`h-2 rounded-full ${progress >= 100 ? 'bg-red-500' : progress >= 80 ? 'bg-amber-500' : 'bg-[var(--color-primary)]'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="mb-4 flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>
                  {new Date(campaign.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(campaign.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                <button
                  onClick={() => setIsEditing(true)}
                  disabled={isPending}
                  style={{
                    flex: 1,
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    cursor: isPending ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: isPending ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isPending) {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                      e.currentTarget.style.borderColor = '#d1d5db';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isPending) {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }
                  }}
                >
                  Edit
                </button>
                {(campaign.status === 'ACTIVE' || campaign.status === 'PAUSED') && (
                  <button
                    onClick={handleToggleStatus}
                    disabled={isPending}
                    style={{
                      flex: 1,
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      backgroundColor: '#ffffff',
                      color: '#374151',
                      cursor: isPending ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      opacity: isPending ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!isPending) {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                        e.currentTarget.style.borderColor = '#d1d5db';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isPending) {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                      }
                    }}
                  >
                    {isPending ? '...' : campaign.status === 'ACTIVE' ? 'Pause' : 'Activate'}
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  disabled={isPending}
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    borderRadius: '8px',
                    border: '1px solid #fecaca',
                    backgroundColor: '#ffffff',
                    color: '#dc2626',
                    cursor: isPending ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: isPending ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isPending) {
                      e.currentTarget.style.backgroundColor = '#fef2f2';
                      e.currentTarget.style.borderColor = '#fca5a5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isPending) {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.borderColor = '#fecaca';
                    }
                  }}
                >
                  {isPending ? '...' : 'Delete'}
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
