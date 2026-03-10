'use client';

import { motion } from 'framer-motion';
import { skeletonAnimation } from '@/lib/animations';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

export function Skeleton({ 
  width = '100%', 
  height = '20px', 
  borderRadius = '4px',
  className = '' 
}: SkeletonProps) {
  return (
    <motion.div
      animate={skeletonAnimation}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: '#e5e7eb',
      }}
      className={className}
    />
  );
}

export function CardSkeleton() {
  return (
    <div
      style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <Skeleton width="60%" height="24px" />
        <Skeleton width="80px" height="24px" borderRadius="12px" />
      </div>
      <Skeleton width="100%" height="16px" style={{ marginBottom: '8px' }} />
      <Skeleton width="80%" height="16px" style={{ marginBottom: '16px' }} />
      <div style={{ marginBottom: '12px' }}>
        <Skeleton width="100%" height="8px" borderRadius="4px" />
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Skeleton width="33%" height="36px" borderRadius="6px" />
        <Skeleton width="33%" height="36px" borderRadius="6px" />
        <Skeleton width="33%" height="36px" borderRadius="6px" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      style={{
        display: 'grid',
        gap: '16px',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            gap: '12px',
            padding: '12px',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        >
          <Skeleton width="40px" height="40px" borderRadius="50%" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Skeleton width="70%" height="16px" />
            <Skeleton width="50%" height="14px" />
          </div>
          <Skeleton width="80px" height="16px" />
        </div>
      ))}
    </div>
  );
}
