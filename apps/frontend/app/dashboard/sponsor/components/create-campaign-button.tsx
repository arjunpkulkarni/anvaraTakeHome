'use client';

import { useState } from 'react';
import { CampaignForm } from './campaign-form';

export function CreateCampaignButton() {
  const [isOpen, setIsOpen] = useState(false);

  if (isOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Create Campaign</h2>
          <CampaignForm onSuccess={() => setIsOpen(false)} onCancel={() => setIsOpen(false)} />
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="rounded bg-[--color-primary] px-4 py-2 text-white hover:opacity-90"
    >
      Create Campaign
    </button>
  );
}
