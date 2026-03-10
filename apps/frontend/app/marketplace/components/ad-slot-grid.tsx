'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getAdSlots } from '@/lib/api';
import { GridSkeleton } from '@/app/components/ui';

const typeColors: Record<string, string> = {
  DISPLAY: 'bg-blue-100 text-blue-700',
  VIDEO: 'bg-red-100 text-red-700',
  NEWSLETTER: 'bg-purple-100 text-purple-700',
  PODCAST: 'bg-orange-100 text-orange-700',
};

interface AdSlot {
  id: string;
  name: string;
  type: string;
  description?: string;
  basePrice: number;
  isAvailable: boolean;
  publisher?: {
    name: string;
  };
}

export function AdSlotGrid() {
  const [adSlots, setAdSlots] = useState<AdSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdSlots()
      .then(setAdSlots)
      .catch(() => setError('Failed to load ad slots'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <GridSkeleton count={6} />;
  }

  if (error) {
    return (
      <motion.div
        className="rounded border border-red-200 bg-red-50 p-4 text-red-600"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {error}
      </motion.div>
    );
  }

  if (adSlots.length === 0) {
    return (
      <motion.div
        className="rounded-lg border border-dashed border-[--color-border] p-12 text-center text-[--color-muted]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        No ad slots available at the moment.
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      initial="initial"
      animate="animate"
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
    >
      <AnimatePresence mode="popLayout">
        {adSlots.map((slot, index) => (
          <motion.div
            key={slot.id}
            variants={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
            }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
              ease: [0.19, 1, 0.22, 1],
            }}
            whileHover={{ y: -4 }}
          >
            <Link
              href={`/marketplace/${slot.id}`}
              className="block rounded-lg border border-[--color-border] p-4 transition-all duration-200 hover:shadow-md h-full"
            >
              <div className="mb-2 flex items-start justify-between">
                <h3 className="font-semibold">{slot.name}</h3>
                <motion.span
                  className={`rounded px-2 py-0.5 text-xs ${typeColors[slot.type] || 'bg-gray-100'}`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  {slot.type}
                </motion.span>
              </div>

              {slot.publisher && (
                <p className="mb-2 text-sm text-[--color-muted]">by {slot.publisher.name}</p>
              )}

              {slot.description && (
                <p className="mb-3 text-sm text-[--color-muted] line-clamp-2">{slot.description}</p>
              )}

              <div className="flex items-center justify-between">
                <motion.span
                  className={`text-sm ${slot.isAvailable ? 'text-green-600' : 'text-[--color-muted]'}`}
                  animate={{
                    scale: slot.isAvailable ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: slot.isAvailable ? Infinity : 0,
                    ease: 'easeInOut',
                  }}
                >
                  {slot.isAvailable ? 'Available' : 'Booked'}
                </motion.span>
                <span className="font-semibold text-[--color-primary]">
                  ${Number(slot.basePrice).toLocaleString()}/mo
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
