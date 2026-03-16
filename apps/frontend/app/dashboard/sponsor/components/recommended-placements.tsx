'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecommendations, type Recommendation } from '@/lib/hooks/useRecommendations';
import { Skeleton, ErrorState, EmptyState } from '@/app/components/ui';
import { staggerContainer, fadeInUp } from '@/lib/animations';

interface RecommendedPlacementsProps {
  campaignId: string;
  campaignName?: string;
}

// ── Match badge ───────────────────────────────────────────────────────────────

function MatchBadge({ pct }: { pct: number }) {
  const color =
    pct >= 70
      ? { bg: '#dcfce7', text: '#15803d' }
      : pct >= 40
        ? { bg: '#fef9c3', text: '#a16207' }
        : { bg: '#f3f4f6', text: '#6b7280' };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 10px',
        borderRadius: '9999px',
        fontSize: '13px',
        fontWeight: '600',
        backgroundColor: color.bg,
        color: color.text,
      }}
    >
      {pct}% match
    </span>
  );
}

// ── Type badge ────────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: '600',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        backgroundColor: '#f3f4f6',
        color: '#374151',
      }}
    >
      {type}
    </span>
  );
}

// ── Skeleton for a single recommendation card ─────────────────────────────────

function RecommendationCardSkeleton() {
  return (
    <div
      style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <Skeleton width="55%" height="20px" />
        <Skeleton width="80px" height="22px" borderRadius="9999px" />
      </div>
      <div style={{ marginBottom: '6px' }}><Skeleton width="40%" height="14px" /></div>
      <div style={{ marginBottom: '16px' }}><Skeleton width="30%" height="14px" /></div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <Skeleton width="60px" height="20px" borderRadius="4px" />
        <Skeleton width="80px" height="20px" borderRadius="4px" />
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <Skeleton width="50%" height="36px" borderRadius="8px" />
        <Skeleton width="50%" height="36px" borderRadius="8px" />
      </div>
    </div>
  );
}

// ── Single recommendation card ────────────────────────────────────────────────

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const [expanded, setExpanded] = useState(false);

  const reach =
    rec.estimatedReach >= 1_000_000
      ? `${(rec.estimatedReach / 1_000_000).toFixed(1)}M`
      : rec.estimatedReach >= 1_000
        ? `${Math.round(rec.estimatedReach / 1_000)}K`
        : String(rec.estimatedReach);

  return (
    <motion.div
      variants={fadeInUp}
      style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div>
          <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '2px' }}>
            {rec.adSlotName}
          </p>
          <p style={{ fontSize: '13px', color: '#6b7280' }}>
            {rec.publisher.name}
            {rec.publisher.category ? ` · ${rec.publisher.category}` : ''}
          </p>
        </div>
        <MatchBadge pct={rec.matchPercentage} />
      </div>

      {/* Badges row */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <TypeBadge type={rec.adSlotType} />
        {rec.publisher.category && (
          <span
            style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '500',
              backgroundColor: '#eff6ff',
              color: '#1d4ed8',
            }}
          >
            {rec.publisher.category}
          </span>
        )}
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '20px' }}>
        <div>
          <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '2px' }}>Price</p>
          <p style={{ fontSize: '15px', fontWeight: '600', color: '#111827' }}>
            ${rec.basePrice.toLocaleString()}
          </p>
        </div>
        <div>
          <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '2px' }}>Monthly Reach</p>
          <p style={{ fontSize: '15px', fontWeight: '600', color: '#111827' }}>{reach}</p>
        </div>
        <div>
          <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '2px' }}>Subscribers</p>
          <p style={{ fontSize: '15px', fontWeight: '600', color: '#111827' }}>
            {rec.publisher.subscriberCount >= 1_000
              ? `${Math.round(rec.publisher.subscriberCount / 1_000)}K`
              : rec.publisher.subscriberCount}
          </p>
        </div>
      </div>

      {/* Expandable reasons */}
      <div>
        <button
          onClick={() => setExpanded((v) => !v)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '13px',
            fontWeight: '500',
            color: '#4f46e5',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0',
          }}
        >
          <span>{expanded ? '▾' : '▸'}</span>
          Why recommended?
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                marginTop: '8px',
                paddingLeft: '0',
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              {rec.reasons.map((reason, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: '13px',
                    color: '#374151',
                    display: 'flex',
                    gap: '6px',
                    alignItems: 'flex-start',
                  }}
                >
                  <span style={{ color: '#10b981', flexShrink: 0, marginTop: '1px' }}>✓</span>
                  {reason}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* CTA */}
      <div style={{ marginTop: 'auto', paddingTop: '4px' }}>
        <a
          href={`/marketplace/${rec.adSlotId}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '10px 16px',
            borderRadius: '8px',
            backgroundColor: '#111827',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            textDecoration: 'none',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#1f2937')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#111827')}
        >
          Book Placement
        </a>
      </div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function RecommendedPlacements({ campaignId, campaignName }: RecommendedPlacementsProps) {
  const { data, isLoading, isError, error, refetch } = useRecommendations(campaignId);

  return (
    <section style={{ marginTop: '48px' }}>
      {/* Section header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', marginBottom: '6px' }}>
          Recommended Placements
          {campaignName ? ` for "${campaignName}"` : ''}
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280', maxWidth: '560px' }}>
          Recommended because these placements align with your campaign audience, budget, and
          expected reach.
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <RecommendationCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <ErrorState
          message={error?.message ?? 'Could not load recommendations.'}
          onRetry={() => refetch()}
        />
      )}

      {/* Empty */}
      {!isLoading && !isError && data?.recommendations.length === 0 && (
        <EmptyState
          title="No recommendations yet"
          description="Add target categories and budget to your campaign to receive personalised placement recommendations."
        />
      )}

      {/* Cards */}
      {!isLoading && !isError && data && data.recommendations.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          {data.recommendations.map((rec) => (
            <RecommendationCard key={rec.adSlotId} rec={rec} />
          ))}
        </motion.div>
      )}
    </section>
  );
}
