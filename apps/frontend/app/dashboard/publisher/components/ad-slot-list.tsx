import { AdSlotCard } from './ad-slot-card';

interface AdSlot {
  id: string;
  name: string;
  description?: string;
  type: 'DISPLAY' | 'VIDEO' | 'NATIVE' | 'NEWSLETTER' | 'PODCAST';
  basePrice: number;
  isAvailable: boolean;
}

interface AdSlotListProps {
  adSlots: AdSlot[];
}

export function AdSlotList({ adSlots }: AdSlotListProps) {
  if (adSlots.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-background-secondary)] p-12 text-center">
        <div className="mx-auto max-w-sm">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
            No ad slots yet
          </h3>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Create your first ad slot to start earning from advertisers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {adSlots.map((slot) => (
        <AdSlotCard key={slot.id} adSlot={slot} />
      ))}
    </div>
  );
}
