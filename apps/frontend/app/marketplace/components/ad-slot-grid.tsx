'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getAdSlots } from '@/lib/api';
import { GridSkeleton, Pagination, EmptyState, ErrorState } from '@/app/components/ui';
import { trackMarketplaceEvent } from '@/lib/analytics';

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

type FilterType = 'all' | 'available' | 'premium';

interface AdSlotGridProps {
  filter: FilterType;
}

export function AdSlotGrid({ filter }: AdSlotGridProps) {
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

  // Auto-refresh every 45 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadAdSlots();
    }, 45000); // 45 seconds

    return () => clearInterval(interval);
  }, []);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
    // Track filter change
    trackMarketplaceEvent.filterMarketplace('status', filter);
  }, [filter]);

  // Filter logic
  const filteredAdSlots = allAdSlots.filter((slot) => {
    if (filter === 'available') {
      return slot.isAvailable;
    }
    if (filter === 'premium') {
      // Premium = price >= $2000/mo
      return Number(slot.basePrice) >= 2000;
    }
    return true; // 'all'
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredAdSlots.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentAdSlots = filteredAdSlots.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <GridSkeleton count={6} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadAdSlots} />;
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

  if (filteredAdSlots.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title={`No ${filter} ad slots found`}
        description={
          filter === 'available'
            ? 'All slots are currently booked. Check back soon for new opportunities!'
            : 'No premium ad slots match your criteria. Try adjusting your filters.'
        }
      />
    );
  }

  return (
    <div>
      <motion.div
        className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
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
              <Link
                href={`/marketplace/${slot.id}`}
                className="block h-full group"
                onClick={() => trackMarketplaceEvent.viewAdSlot(slot.id, slot.name)}
              >
                <div
                  className="relative bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-indigo-300 hover:shadow-lg"
                  style={{
                    height: '380px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Availability Badge - Prominent if available */}
                  {slot.isAvailable && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="flex items-center gap-1.5 bg-emerald-500 text-white px-2.5 py-1 rounded-full shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span className="text-[10px] font-semibold uppercase tracking-wide">
                          Available
                        </span>
                      </div>
                    </div>
                  )}

                  {!slot.isAvailable && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="flex items-center gap-1.5 bg-gray-500 text-white px-2.5 py-1 rounded-full">
                        <span className="text-[10px] font-semibold uppercase tracking-wide">
                          Booked
                        </span>
                      </div>
                    </div>
                  )}

                  <div
                    className="p-6"
                    style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                  >
                    {/* Type Badge */}
                    <div className="mb-3">
                      <span
                        className={`inline-block text-[10px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                          slot.type === 'DISPLAY'
                            ? 'bg-blue-100 text-blue-700'
                            : slot.type === 'VIDEO'
                              ? 'bg-red-100 text-red-700'
                              : slot.type === 'NEWSLETTER'
                                ? 'bg-purple-100 text-purple-700'
                                : slot.type === 'PODCAST'
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {slot.type}
                      </span>
                    </div>

                    {/* Title - More prominent */}
                    <h3
                      className="text-[17px] font-bold text-gray-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors"
                      style={{ minHeight: '48px' }}
                    >
                      {slot.name}
                    </h3>

                    {/* Publisher - More visible */}
                    {slot.publisher && (
                      <div className="flex items-center gap-1.5 mb-3 mt-2">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
                          {slot.publisher.name.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-[12px] font-medium text-gray-700">
                          {slot.publisher.name}
                        </p>
                      </div>
                    )}

                    {/* Description */}
                    <div style={{ minHeight: '40px', marginBottom: '16px' }}>
                      {slot.description && (
                        <p className="text-[12px] text-gray-600 line-clamp-2 leading-relaxed">
                          {slot.description}
                        </p>
                      )}
                    </div>

                    {/* Price Section - More prominent */}
                    <div className="pt-4 mt-auto border-t border-gray-200">
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-[11px] text-gray-500 mb-0.5">Starting at</div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-[22px] font-bold text-gray-900">
                              ${Number(slot.basePrice).toLocaleString()}
                            </span>
                            <span className="text-[13px] font-medium text-gray-500">/mo</span>
                          </div>
                        </div>

                        {/* CTA indicator */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#4f46e5',
                            transition: 'gap 0.2s ease-in-out',
                          }}
                          className="group-hover:gap-3"
                        >
                          <span style={{ fontSize: '13px', fontWeight: '700' }}>View</span>
                          <svg
                            style={{ width: '16px', height: '16px' }}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Hover CTA overlay */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-0 opacity-0 group-hover:h-14 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(to top, #4f46e5 0%, #6366f1 100%)',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      <span className="text-white font-bold text-sm flex items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-200 ease-in-out">
                        View Details & Book
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredAdSlots.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
