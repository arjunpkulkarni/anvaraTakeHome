'use client';

import { useState } from 'react';
import { AdSlotForm } from './ad-slot-form';
import { Button } from '@/app/components/ui';

export function CreateAdSlotButton() {
  const [isOpen, setIsOpen] = useState(false);

  if (isOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
          <h2 className="text-2xl font-semibold mb-6 text-[var(--color-text-primary)]">Create Ad Slot</h2>
          <AdSlotForm onSuccess={() => setIsOpen(false)} onCancel={() => setIsOpen(false)} />
        </div>
      </div>
    );
  }

  return (
    <Button onClick={() => setIsOpen(true)}>
      Create Ad Slot
    </Button>
  );
}
