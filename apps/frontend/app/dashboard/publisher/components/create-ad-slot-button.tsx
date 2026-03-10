'use client';

import { useState } from 'react';
import { AdSlotForm } from './ad-slot-form';

export function CreateAdSlotButton() {
  const [isOpen, setIsOpen] = useState(false);

  if (isOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-4">Create Ad Slot</h2>
          <AdSlotForm onSuccess={() => setIsOpen(false)} onCancel={() => setIsOpen(false)} />
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="rounded bg-[--color-primary] px-4 py-2 text-white hover:opacity-90"
    >
      Create Ad Slot
    </button>
  );
}
