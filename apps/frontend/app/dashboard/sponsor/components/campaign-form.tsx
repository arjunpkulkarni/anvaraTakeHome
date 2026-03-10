'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { createCampaign, updateCampaign } from '../actions';

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
      className="rounded bg-[--color-primary] px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
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
      {formState.error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {formState.error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Campaign Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={campaign?.name}
          className="w-full rounded border border-[--color-border] px-3 py-2"
          placeholder="Summer 2026 Campaign"
        />
        {formState.fieldErrors?.name && (
          <p className="mt-1 text-sm text-red-600">{formState.fieldErrors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={campaign?.description}
          rows={3}
          className="w-full rounded border border-[--color-border] px-3 py-2"
          placeholder="Describe your campaign goals..."
        />
        {formState.fieldErrors?.description && (
          <p className="mt-1 text-sm text-red-600">{formState.fieldErrors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="budget" className="block text-sm font-medium mb-1">
            Budget ($) *
          </label>
          <input
            type="number"
            id="budget"
            name="budget"
            defaultValue={campaign?.budget}
            min="0"
            step="0.01"
            className="w-full rounded border border-[--color-border] px-3 py-2"
            placeholder="5000"
          />
          {formState.fieldErrors?.budget && (
            <p className="mt-1 text-sm text-red-600">{formState.fieldErrors.budget}</p>
          )}
        </div>

        {isEdit && (
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={campaign.status}
              className="w-full rounded border border-[--color-border] px-3 py-2"
            >
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="cpmRate" className="block text-sm font-medium mb-1">
            CPM Rate ($)
          </label>
          <input
            type="number"
            id="cpmRate"
            name="cpmRate"
            defaultValue={campaign?.cpmRate}
            min="0"
            step="0.01"
            className="w-full rounded border border-[--color-border] px-3 py-2"
            placeholder="2.50"
          />
          {formState.fieldErrors?.cpmRate && (
            <p className="mt-1 text-sm text-red-600">{formState.fieldErrors.cpmRate}</p>
          )}
        </div>

        <div>
          <label htmlFor="cpcRate" className="block text-sm font-medium mb-1">
            CPC Rate ($)
          </label>
          <input
            type="number"
            id="cpcRate"
            name="cpcRate"
            defaultValue={campaign?.cpcRate}
            min="0"
            step="0.01"
            className="w-full rounded border border-[--color-border] px-3 py-2"
            placeholder="0.50"
          />
          {formState.fieldErrors?.cpcRate && (
            <p className="mt-1 text-sm text-red-600">{formState.fieldErrors.cpcRate}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium mb-1">
            Start Date *
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            defaultValue={formatDate(campaign?.startDate)}
            className="w-full rounded border border-[--color-border] px-3 py-2"
          />
          {formState.fieldErrors?.startDate && (
            <p className="mt-1 text-sm text-red-600">{formState.fieldErrors.startDate}</p>
          )}
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium mb-1">
            End Date *
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            defaultValue={formatDate(campaign?.endDate)}
            className="w-full rounded border border-[--color-border] px-3 py-2"
          />
          {formState.fieldErrors?.endDate && (
            <p className="mt-1 text-sm text-red-600">{formState.fieldErrors.endDate}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-[--color-border] px-4 py-2 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <SubmitButton isEdit={isEdit} />
      </div>
    </form>
  );
}
