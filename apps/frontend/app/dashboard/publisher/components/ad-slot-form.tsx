'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { createAdSlot, updateAdSlot } from '../actions';
import { Input, Textarea, Select, FormError } from '@/app/components/ui';

interface AdSlot {
  id: string;
  name: string;
  description?: string;
  type: 'DISPLAY' | 'VIDEO' | 'NATIVE' | 'NEWSLETTER' | 'PODCAST';
  basePrice: number;
  isAvailable: boolean;
}

interface AdSlotFormProps {
  adSlot?: AdSlot;
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
        backgroundColor: pending ? '#60a5fa' : '#2563eb',
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: '600',
        color: '#ffffff',
        border: 'none',
        cursor: pending ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        opacity: pending ? 0.7 : 1,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }}
      onMouseEnter={(e) => {
        if (!pending) e.currentTarget.style.backgroundColor = '#1d4ed8';
      }}
      onMouseLeave={(e) => {
        if (!pending) e.currentTarget.style.backgroundColor = '#2563eb';
      }}
    >
      {pending ? 'Saving...' : isEdit ? 'Update Ad Slot' : 'Create Ad Slot'}
    </button>
  );
}

export function AdSlotForm({ adSlot, onSuccess, onCancel }: AdSlotFormProps) {
  const isEdit = !!adSlot;
  const [formState, formAction] = useActionState(
    isEdit ? updateAdSlot.bind(null, adSlot.id) : createAdSlot,
    {}
  );

  useEffect(() => {
    if (formState.success) {
      onSuccess?.();
    }
  }, [formState.success, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      <FormError error={formState.error} />

      <Input
        name="name"
        label="Name"
        defaultValue={adSlot?.name}
        placeholder="Homepage Banner"
        error={formState.fieldErrors?.name}
        required
      />

      <Textarea
        name="description"
        label="Description"
        defaultValue={adSlot?.description}
        placeholder="Premium placement above the fold..."
        error={formState.fieldErrors?.description}
      />

      <Select name="type" label="Type" defaultValue={adSlot?.type} error={formState.fieldErrors?.type} required>
        <option value="">Select type...</option>
        <option value="DISPLAY">Display</option>
        <option value="VIDEO">Video</option>
        <option value="NATIVE">Native</option>
        <option value="NEWSLETTER">Newsletter</option>
        <option value="PODCAST">Podcast</option>
      </Select>

      <Input
        type="number"
        name="basePrice"
        label="Base Price ($/month)"
        defaultValue={adSlot?.basePrice}
        min="0"
        step="0.01"
        placeholder="500"
        error={formState.fieldErrors?.basePrice}
        required
      />

      {isEdit && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isAvailable"
            name="isAvailable"
            value="true"
            defaultChecked={adSlot.isAvailable}
            className="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
          />
          <label htmlFor="isAvailable" className="text-sm text-[var(--color-text-primary)]">
            Available for booking
          </label>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', paddingTop: '16px' }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#ffffff',
              color: '#374151',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
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
