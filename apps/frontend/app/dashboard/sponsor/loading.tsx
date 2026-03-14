export default function Loading() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="h-10 w-64 bg-[var(--color-background-secondary)] rounded-lg animate-pulse" />
          <div className="h-10 w-32 bg-[var(--color-background-secondary)] rounded-lg animate-pulse" />
        </div>
        <div className="h-5 w-96 bg-[var(--color-background-secondary)] rounded animate-pulse" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white border border-[var(--color-border)] rounded-lg p-4 shadow-sm"
          >
            <div className="h-6 w-3/4 bg-[var(--color-background-secondary)] rounded mb-3 animate-pulse" />
            <div className="h-4 w-full bg-[var(--color-background-secondary)] rounded mb-2 animate-pulse" />
            <div className="h-4 w-2/3 bg-[var(--color-background-secondary)] rounded mb-4 animate-pulse" />
            <div className="h-10 w-full bg-[var(--color-background-secondary)] rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
