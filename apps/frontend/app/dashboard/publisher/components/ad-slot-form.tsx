'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { createAdSlot, updateAdSlot } from '../actions';
import { Button, Input, Textarea, Select, FormError } from '@/app/components/ui';

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
    <Button type="submit" disabled={pending} fullWidth>
      {pending ? 'Saving...' : isEdit ? 'Update Ad Slot' : 'Create Ad Slot'}
    </Button>
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
