'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getAdSlots } from '@/lib/api';
import { GridSkeleton, Pagination, EmptyState, ErrorState, Card, CardContent } from '@/app/components/ui';

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

const ITEMS_PER_PAGE = 9;

export function AdSlotGrid() {
  const [allAdSlots, setAllAdSlots] = useState<AdSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const loadAdSlots = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdSlots();
      setAllAdSlots(data);
    } catch {
      setError('Failed to load ad slots. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdSlots();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(allAdSlots.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentAdSlots = allAdSlots.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <GridSkeleton count={6} />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={loadAdSlots}
      />
    );
  }

  if (allAdSlots.length === 0) {
    return (
      <EmptyState
        icon="🏪"
        title="No ad slots available"
        description="Check back soon! Publishers are constantly adding new advertising opportunities."
      />
    );
  }

  return (
    <div>
      <motion.div
        className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
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
          {currentAdSlots.map((slot, index) => (
            <motion.div
              key={`${slot.id}-${currentPage}`}
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
              }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: [0.19, 1, 0.22, 1],
              }}
            >
              <Link href={`/marketplace/${slot.id}`} className="block h-full">
                <Card hover animate className="h-full">
                  <CardContent>
                    {/* Header with title and type badge */}
                    <div className="mb-3 flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-[var(--color-text-primary)] line-clamp-1">
                        {slot.name}
                      </h3>
                      <motion.span
                        className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ml-2 ${
                          typeColors[slot.type] || 'bg-gray-100 text-gray-700'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        {slot.type}
                      </motion.span>
                    </div>

                    {/* Publisher info */}
                    {slot.publisher && (
                      <p className="mb-3 text-sm text-[var(--color-text-secondary)]">
                        by <span className="font-medium">{slot.publisher.name}</span>
                      </p>
                    )}

                    {/* Description */}
                    {slot.description && (
                      <p className="mb-4 text-sm text-[var(--color-text-secondary)] line-clamp-2">
                        {slot.description}
                      </p>
                    )}

                    {/* Footer with availability and price */}
                    <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
                      <motion.div
                        className="flex items-center gap-2"
                        animate={{
                          scale: slot.isAvailable ? [1, 1.05, 1] : 1,
                        }}
                        transition={{
                          duration: 2,
                          repeat: slot.isAvailable ? Infinity : 0,
                          ease: 'easeInOut',
                        }}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            slot.isAvailable ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            slot.isAvailable ? 'text-green-600' : 'text-[var(--color-text-secondary)]'
                          }`}
                        >
                          {slot.isAvailable ? 'Available' : 'Booked'}
                        </span>
                      </motion.div>
                      <span className="text-lg font-semibold text-[var(--color-primary)]">
                        ${Number(slot.basePrice).toLocaleString()}
                        <span className="text-sm font-normal text-[var(--color-text-secondary)]">/mo</span>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={allAdSlots.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
