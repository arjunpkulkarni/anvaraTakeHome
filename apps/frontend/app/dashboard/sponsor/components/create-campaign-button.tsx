'use client';

import { useState } from 'react';
import { CampaignForm } from './campaign-form';
import { Button } from '@/app/components/ui';

export function CreateCampaignButton() {
  const [isOpen, setIsOpen] = useState(false);

  if (isOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-6 text-[var(--color-text-primary)]">Create Campaign</h2>
          <CampaignForm onSuccess={() => setIsOpen(false)} onCancel={() => setIsOpen(false)} />
        </div>
      </div>
    );
  }

  return (
    <Button variant="dark" onClick={() => setIsOpen(true)}>
      Create Campaign
    </Button>
  );
}
