'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { createCampaign, updateCampaign } from '../actions';
import { Input, Textarea, Select, FormError } from '@/app/components/ui';
import { trackFormSubmit } from '@/lib/analytics';

interface Campaign {
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

interface CampaignFormProps {
  campaign?: Campaign;
  onSuccess?: () => void;
  onCancel?: () => void;
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        width: '100%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        backgroundColor: pending ? '#93c5fd' : '#2563eb',
        padding: '12px 16px',
        fontSize: '16px',
        fontWeight: '600',
        color: '#ffffff',
        border: 'none',
        cursor: pending ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
      onMouseEnter={(e) => {
        if (!pending) {
          e.currentTarget.style.backgroundColor = '#1d4ed8';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (!pending) {
          e.currentTarget.style.backgroundColor = '#2563eb';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }
      }}
    >
      {pending ? 'Saving...' : isEdit ? 'Update Campaign' : 'Create Campaign'}
    </button>
  );
}

export function CampaignForm({ campaign, onSuccess, onCancel }: CampaignFormProps) {
  const isEdit = !!campaign;
  const [formState, formAction] = useActionState(
    isEdit ? updateCampaign.bind(null, campaign.id) : createCampaign,
    {}
  );

  useEffect(() => {
    if (formState.success) {
      // Track successful form submission
      trackFormSubmit(isEdit ? 'update_campaign' : 'create_campaign', true);
      onSuccess?.();
    } else if (formState.error) {
      // Track failed form submission
      trackFormSubmit(isEdit ? 'update_campaign' : 'create_campaign', false);
    }
  }, [formState.success, formState.error, onSuccess, isEdit]);

  // Format dates for input[type="date"]
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0];
  };

  return (
    <form action={formAction} className="space-y-4">
      <FormError error={formState.error} />

      <Input
        name="name"
        label="Campaign Name"
        defaultValue={campaign?.name}
        placeholder="Summer 2026 Campaign"
        error={formState.fieldErrors?.name}
        required
      />

      <Textarea
        name="description"
        label="Description"
        defaultValue={campaign?.description}
        placeholder="Describe your campaign goals..."
        error={formState.fieldErrors?.description}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          name="budget"
          label="Budget ($)"
          defaultValue={campaign?.budget}
          min="0"
          step="0.01"
          placeholder="5000"
          error={formState.fieldErrors?.budget}
          required
        />

        {isEdit && (
          <Select name="status" label="Status" defaultValue={campaign.status}>
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="COMPLETED">Completed</option>
          </Select>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          name="cpmRate"
          label="CPM Rate ($)"
          defaultValue={campaign?.cpmRate}
          min="0"
          step="0.01"
          placeholder="2.50"
          error={formState.fieldErrors?.cpmRate}
        />

        <Input
          type="number"
          name="cpcRate"
          label="CPC Rate ($)"
          defaultValue={campaign?.cpcRate}
          min="0"
          step="0.01"
          placeholder="0.50"
          error={formState.fieldErrors?.cpcRate}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="date"
          name="startDate"
          label="Start Date"
          defaultValue={formatDate(campaign?.startDate)}
          error={formState.fieldErrors?.startDate}
          required
        />

        <Input
          type="date"
          name="endDate"
          label="End Date"
          defaultValue={formatDate(campaign?.endDate)}
          error={formState.fieldErrors?.endDate}
          required
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '16px' }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151',
              backgroundColor: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            Cancel
          </button>
        )}
        <SubmitButton isEdit={isEdit} />
      </div>
    </form>
  );
}
