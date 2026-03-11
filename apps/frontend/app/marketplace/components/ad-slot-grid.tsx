'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getAdSlots } from '@/lib/api';
import { GridSkeleton, Pagination, EmptyState, ErrorState } from '@/app/components/ui';

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

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // Filter logic
  const filteredAdSlots = allAdSlots.filter(slot => {
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
              <Link href={`/marketplace/${slot.id}`} className="block h-full group">
                <motion.div
                  className="relative h-full bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:border-gray-400 hover:shadow-md"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-6">
                    {/* Header: Type and Availability */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[9px] font-medium px-2 py-0.5 rounded uppercase tracking-wider ${
                        slot.type === 'DISPLAY' ? 'bg-blue-50 text-blue-700' :
                        slot.type === 'VIDEO' ? 'bg-red-50 text-red-700' :
                        slot.type === 'NEWSLETTER' ? 'bg-purple-50 text-purple-700' :
                        slot.type === 'PODCAST' ? 'bg-orange-50 text-orange-700' :
                        'bg-gray-50 text-gray-700'
                      }`}>
                        {slot.type}
                      </span>

                      <div className={`flex items-center gap-1 ${
                        slot.isAvailable ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          slot.isAvailable ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                        <span className="text-[9px]">
                          {slot.isAvailable ? 'Available' : 'Booked'}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-[15px] font-semibold text-gray-900 mb-1 line-clamp-1">
                      {slot.name}
                    </h3>

                    {/* Publisher */}
                    {slot.publisher && (
                      <p className="text-[11px] text-gray-500" style={{marginBottom: '6px'}}>
                        {slot.publisher.name}
                      </p>
                    )}

                    {/* Description */}
                    {slot.description && (
                      <p className="text-[11px] text-gray-600 line-clamp-2 mb-5 leading-relaxed">
                        {slot.description}
                      </p>
                    )}

                    {/* Price */}
                    <div className="flex items-baseline justify-between pt-3 border-t border-gray-100">
                      <div className="text-[15px] font-semibold text-gray-900">
                        ${Number(slot.basePrice).toLocaleString()}
                        <span className="text-[11px] font-normal text-gray-500">/mo</span>
                      </div>

                      <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-900 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                </motion.div>
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
