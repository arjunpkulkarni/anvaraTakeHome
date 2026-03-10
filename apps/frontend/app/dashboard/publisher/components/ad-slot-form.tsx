'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { createAdSlot, updateAdSlot } from '../actions';

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
      className="rounded bg-[--color-primary] px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
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
      {formState.error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {formState.error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={adSlot?.name}
          className="w-full rounded border border-[--color-border] px-3 py-2"
          placeholder="Homepage Banner"
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
          defaultValue={adSlot?.description}
          rows={3}
          className="w-full rounded border border-[--color-border] px-3 py-2"
          placeholder="Premium placement above the fold..."
        />
        {formState.fieldErrors?.description && (
          <p className="mt-1 text-sm text-red-600">{formState.fieldErrors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium mb-1">
          Type *
        </label>
        <select
          id="type"
          name="type"
          defaultValue={adSlot?.type}
          className="w-full rounded border border-[--color-border] px-3 py-2"
        >
          <option value="">Select type...</option>
          <option value="DISPLAY">Display</option>
          <option value="VIDEO">Video</option>
          <option value="NATIVE">Native</option>
          <option value="NEWSLETTER">Newsletter</option>
          <option value="PODCAST">Podcast</option>
        </select>
        {formState.fieldErrors?.type && (
          <p className="mt-1 text-sm text-red-600">{formState.fieldErrors.type}</p>
        )}
      </div>

      <div>
        <label htmlFor="basePrice" className="block text-sm font-medium mb-1">
          Base Price ($/month) *
        </label>
        <input
          type="number"
          id="basePrice"
          name="basePrice"
          defaultValue={adSlot?.basePrice}
          min="0"
          step="0.01"
          className="w-full rounded border border-[--color-border] px-3 py-2"
          placeholder="500"
        />
        {formState.fieldErrors?.basePrice && (
          <p className="mt-1 text-sm text-red-600">{formState.fieldErrors.basePrice}</p>
        )}
      </div>

      {isEdit && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isAvailable"
            name="isAvailable"
            value="true"
            defaultChecked={adSlot.isAvailable}
            className="rounded border-[--color-border]"
          />
          <label htmlFor="isAvailable" className="text-sm">
            Available for booking
          </label>
        </div>
      )}

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
