'use client';

import { useEffect } from 'react';
import { Button } from '@/app/components/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
            Something went wrong!
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            We encountered an error while loading your campaigns. Please try again.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>Try Again</Button>
          <Button variant="secondary" onClick={() => (window.location.href = '/')}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
