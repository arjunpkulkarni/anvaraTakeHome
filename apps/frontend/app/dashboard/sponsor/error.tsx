'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Campaigns</h1>
      <div className="rounded border border-red-200 bg-red-50 p-4 text-red-600">
        <p className="font-semibold">Failed to load campaigns</p>
        <p className="mt-1 text-sm">{error.message}</p>
        <button
          onClick={reset}
          className="mt-3 rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
