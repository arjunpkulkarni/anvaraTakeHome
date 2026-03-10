'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { createCampaign, updateCampaign } from '../actions';
import { Button, Input, Textarea, Select, FormError } from '@/app/components/ui';

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
    <Button type="submit" disabled={pending} fullWidth>
      {pending ? 'Saving...' : isEdit ? 'Update Campaign' : 'Create Campaign'}
    </Button>
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
      onSuccess?.();
    }
  }, [formState.success, onSuccess]);

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

      <div className="flex gap-2 justify-end pt-2">
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="secondary">
            Cancel
          </Button>
        )}
        <SubmitButton isEdit={isEdit} />
      </div>
    </form>
  );
}
