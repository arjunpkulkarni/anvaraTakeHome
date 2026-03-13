'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdSlot } from '@/lib/api';
import { authClient } from '@/auth-client';
import { QuoteRequestModal } from '@/app/components/quote-request-modal';

interface AdSlot {
  id: string;
  name: string;
  description?: string;
  type: string;
  basePrice: number;
  isAvailable: boolean;
  publisher?: {
    id: string;
    name: string;
    website?: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface RoleInfo {
  role: 'sponsor' | 'publisher' | null;
  sponsorId?: string;
  publisherId?: string;
  name?: string;
}

interface Props {
  id: string;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

function getAvailabilityStyles(isAvailable: boolean): string {
  if (isAvailable) {
    return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200';
  }
  return 'bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200';
}

function getPlatformColor(type: string): string {
  const colors: Record<string, string> = {
    VIDEO: 'bg-red-50 text-red-600 ring-1 ring-red-100',
    DISPLAY: 'bg-blue-50 text-blue-600 ring-1 ring-blue-100',
    NEWSLETTER: 'bg-purple-50 text-purple-600 ring-1 ring-purple-100',
    PODCAST: 'bg-orange-50 text-orange-600 ring-1 ring-orange-100',
    NATIVE: 'bg-green-50 text-green-600 ring-1 ring-green-100',
  };
  return colors[type] || 'bg-zinc-50 text-zinc-600 ring-1 ring-zinc-200';
}


export function AdSlotDetail({ id }: Props) {
  const [adSlot, setAdSlot] = useState<AdSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roleInfo, setRoleInfo] = useState<RoleInfo | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  useEffect(() => {
    // Fetch ad slot
    getAdSlot(id)
      .then(setAdSlot)
      .catch(() => setError('Failed to load ad slot details'))
      .finally(() => setLoading(false));

    // Check user session and fetch role
    authClient
      .getSession()
      .then(({ data }) => {
        if (data?.user) {
          const sessionUser = data.user as User;
          setUser(sessionUser);

          // Fetch role info from backend
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291'}/api/auth/role/${sessionUser.id}`,
            { credentials: 'include' }
          )
            .then((res) => res.json())
            .then((data) => setRoleInfo(data))
            .catch(() => setRoleInfo(null))
            .finally(() => setRoleLoading(false));
        } else {
          setRoleLoading(false);
        }
      })
      .catch(() => setRoleLoading(false));
  }, [id]);

  const handleBooking = async () => {
    if (!roleInfo?.sponsorId || !adSlot) return;

    setBooking(true);
    setBookingError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291'}/api/ad-slots/${adSlot.id}/book`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            sponsorId: roleInfo.sponsorId,
            message: message || undefined,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to book placement');
      }

      setBookingSuccess(true);
      setAdSlot({ ...adSlot, isAvailable: false });
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : 'Failed to book placement');
    } finally {
      setBooking(false);
    }
  };

  const handleUnbook = async () => {
    if (!adSlot) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291'}/api/ad-slots/${adSlot.id}/unbook`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to reset booking');
      }

      setBookingSuccess(false);
      setAdSlot({ ...adSlot, isAvailable: true });
      setMessage('');
    } catch (err) {
      console.error('Failed to unbook:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 rounded bg-zinc-200" />
            <div className="h-96 rounded-3xl bg-zinc-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !adSlot) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/marketplace"
            className="mb-6 inline-flex items-center text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
          >
            ← Back to marketplace
        </Link>
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-lg font-semibold text-red-900">{error || 'Ad slot not found'}</p>
            <p className="mt-2 text-sm text-red-700">
              The placement you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Map backend data to display format
  const deliverables = [
    `${adSlot.type.toLowerCase()} placement on ${adSlot.publisher?.name || 'publisher platform'}`,
    'Product demo or workflow integration',
    'Link in description or show notes',
    'One revision on messaging before publishing',
  ];

  const idealFor = [
    'Developer tools',
    'SaaS platforms',
    'Technical products',
    'B2B services',
  ];

  const guidelines = [
    'Final messaging must align with creator voice',
    'No misleading claims or overly scripted content',
    'Best results come from products that can be demonstrated',
  ];

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/marketplace"
          className="mb-6 inline-flex items-center text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
        >
          ← Back to marketplace
      </Link>

        <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          {/* Hero Header Section */}
          <div className="border-b border-zinc-200 px-6 py-8 sm:px-8">
            {/* Urgency banner */}
            {adSlot.isAvailable && (
              <div className="mb-6 rounded-2xl bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 px-5 py-3">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-amber-900">
                        High demand - Act fast!
                      </div>
                      <div className="text-xs text-amber-700">
                        12 sponsors viewed this in the last 24 hours
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-amber-700 bg-amber-100 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    Limited availability
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getPlatformColor(adSlot.type)}`}
                  >
                    {adSlot.type}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getAvailabilityStyles(adSlot.isAvailable)}`}
                  >
                    {adSlot.isAvailable ? 'Available Now' : 'Currently Booked'}
                  </span>

                  {/* Trust badges */}
                  <span className="rounded-full px-3 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100 flex items-center gap-1.5">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    4.8 Rating
                  </span>
                  <span className="rounded-full px-3 py-1 text-xs font-semibold bg-purple-50 text-purple-700 ring-1 ring-purple-100 flex items-center gap-1.5">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified Publisher
                  </span>
                </div>

                <h1 className="text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">
                  {adSlot.name}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-base text-zinc-600">
                  <span>by {adSlot.publisher?.name || 'Publisher'}</span>
                  {adSlot.publisher?.website ? (
                    <>
                      <span className="text-zinc-300">•</span>
                      <a
                        href={adSlot.publisher.website}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-700"
                      >
                        Visit creator site
                      </a>
                    </>
                  ) : null}
                </div>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-700">
                  {adSlot.description ||
                    'A premium placement opportunity to showcase your product to a highly engaged, targeted audience. Work directly with the creator for authentic integration.'}
                </p>

                {/* Enhanced stats grid with icons and better styling */}
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-indigo-200 bg-linear-to-br from-indigo-50 to-blue-50 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-indigo-900">Monthly Reach</p>
                    </div>
                    <p className="text-2xl font-bold text-indigo-900">
                      {adSlot.type === 'VIDEO' && '65k'}
                      {adSlot.type === 'NEWSLETTER' && '38k'}
                      {adSlot.type === 'PODCAST' && '22k'}
                      {(adSlot.type === 'DISPLAY' || adSlot.type === 'NATIVE') && '120k+'}
                    </p>
                    <p className="text-xs text-indigo-700 mt-1">Verified audience size</p>
                  </div>

                  <div className="rounded-2xl border border-emerald-200 bg-linear-to-br from-emerald-50 to-green-50 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-emerald-900">Avg. Engagement</p>
                    </div>
                    <p className="text-2xl font-bold text-emerald-900">
                      {adSlot.type === 'VIDEO' && '6.2%'}
                      {adSlot.type === 'NEWSLETTER' && '4.8%'}
                      {adSlot.type === 'PODCAST' && '8.5%'}
                      {(adSlot.type === 'DISPLAY' || adSlot.type === 'NATIVE') && '3.1%'}
                    </p>
                    <p className="text-xs text-emerald-700 mt-1">Above industry avg</p>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-linear-to-br from-amber-50 to-yellow-50 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-amber-900">Typical ROI</p>
                    </div>
                    <p className="text-2xl font-bold text-amber-900">2.8x</p>
                    <p className="text-xs text-amber-700 mt-1">Based on 24 sponsors</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-zinc-600">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">24h response time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">Flexible terms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">12 successful campaigns this quarter</span>
                  </div>
                </div>
              </div>

              {/* Premium Pricing Card */}
              <div className="w-full rounded-3xl border-2 border-indigo-200 bg-linear-to-br from-indigo-950 via-indigo-900 to-purple-900 p-7 text-white shadow-xl lg:max-w-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-indigo-200">Investment</p>
                  {adSlot.isAvailable && (
                    <div className="flex items-center gap-1 bg-emerald-500 px-2 py-0.5 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span className="text-[10px] font-bold">AVAILABLE</span>
                    </div>
                  )}
                </div>
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-5xl font-bold tracking-tight">
                    {formatPrice(adSlot.basePrice)}
                  </span>
                  <span className="pb-2 text-base text-indigo-200">/month</span>
                </div>
                <p className="text-sm text-indigo-300 mb-1">Starting price</p>

                {/* ROI indicator */}
                <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-indigo-200">Est. Value</span>
                    <span className="text-xs font-bold text-emerald-300">2.8x ROI</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    ~{formatPrice(Number(adSlot.basePrice) * 2.8)} return
                  </div>
                  <p className="text-[10px] text-indigo-300 mt-1">Based on similar campaigns</p>
                </div>

                <p className="mt-4 text-sm leading-6 text-indigo-100">
                  Premium placement with native integration. Reach a highly targeted audience that trusts the creator's recommendations.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <a
                    href="#request-form"
                    className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3.5 text-base font-bold text-indigo-950 transition hover:bg-indigo-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {adSlot.isAvailable ? 'Book This Placement' : 'Join Waitlist'}
                  </a>

                  <button
                    type="button"
                    onClick={() => setIsQuoteModalOpen(true)}
                    className="inline-flex items-center justify-center rounded-xl border-2 border-indigo-400 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Request Custom Quote
                  </button>
                </div>

                {/* Trust elements */}
                <div className="mt-6 pt-5 border-t border-white/20 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-indigo-200">
                    <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>No payment until publisher accepts</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-indigo-200">
                    <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Flexible payment terms available</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-indigo-200">
                    <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Direct support from publisher</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.4fr_420px]">
            <div className="space-y-8">
              {/* Why This Works */}
              <section className="rounded-3xl border border-zinc-200 bg-white p-6">
                <h2 className="text-xl font-semibold text-zinc-950">Why this placement works</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-zinc-50 p-4">
                    <p className="text-sm text-zinc-500">Audience fit</p>
                    <p className="mt-1 font-medium text-zinc-900">
                      Developers, founders, technical buyers
                    </p>
                  </div>
                  <div className="rounded-2xl bg-zinc-50 p-4">
                    <p className="text-sm text-zinc-500">Placement type</p>
                    <p className="mt-1 font-medium text-zinc-900">Native integration</p>
                  </div>
                </div>
              </section>

              {/* What's Included */}
              <section className="rounded-3xl border border-zinc-200 bg-white p-6">
                <h2 className="text-xl font-semibold text-zinc-950">What's included</h2>
                <div className="mt-4 grid gap-3">
                  {deliverables.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-2xl bg-zinc-50 p-4"
                    >
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-zinc-900" />
                      <p className="text-zinc-700">{item}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Ideal For & Guidelines */}
              <section className="grid gap-8 md:grid-cols-2">
                <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                  <h2 className="text-xl font-semibold text-zinc-950">Ideal for</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {idealFor.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                  <h2 className="text-xl font-semibold text-zinc-950">Publisher guidelines</h2>
                  <ul className="mt-4 space-y-3">
                    {guidelines.map((item) => (
                      <li key={item} className="text-sm leading-6 text-zinc-700">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Preview Section */}
              <section className="rounded-3xl border border-zinc-200 bg-white p-6">
                <div className="flex items-center justify-between gap-4">
          <div>
                    <h2 className="text-xl font-semibold text-zinc-950">Preview</h2>
                    <p className="mt-1 text-sm text-zinc-600">
                      See previous content or publisher examples.
                    </p>
                  </div>
                  {adSlot.publisher?.website ? (
                    <a
                      href={adSlot.publisher.website}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                    >
                      Open preview
                    </a>
                  ) : null}
                </div>

                <div className="mt-5 flex aspect-video items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-zinc-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mt-2">Video / screenshot preview area</p>
                  </div>
          </div>
              </section>
        </div>

            {/* Sticky Request Form */}
            <aside>
              <div
                id="request-form"
                className="sticky top-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg"
              >
                {bookingSuccess ? (
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-emerald-50 p-6 text-center border-2 border-emerald-200">
                      <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 shadow-lg">
                        <svg
                          className="h-8 w-8 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-emerald-900">
                        Request Sent!
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-emerald-700">
                        The publisher will review your request and respond within <strong>24 hours</strong>. Check your email for updates!
                      </p>

                      {/* Next steps */}
                      <div className="mt-5 pt-5 border-t border-emerald-200">
                        <p className="text-xs font-semibold text-emerald-900 mb-3">WHAT HAPPENS NEXT:</p>
                        <div className="space-y-2 text-left">
                          <div className="flex items-start gap-2 text-xs text-emerald-800">
                            <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-emerald-200 flex items-center justify-center font-bold text-emerald-900">1</span>
                            <span>Publisher reviews your campaign details</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs text-emerald-800">
                            <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-emerald-200 flex items-center justify-center font-bold text-emerald-900">2</span>
                            <span>You'll receive a response within 24h</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs text-emerald-800">
                            <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-emerald-200 flex items-center justify-center font-bold text-emerald-900">3</span>
                            <span>Finalize details & go live!</span>
                          </div>
                        </div>
                      </div>
                    </div>
              <button
                onClick={handleUnbook}
                      className="w-full text-xs text-zinc-500 underline hover:text-zinc-700 mt-3"
              >
                      Reset (for testing)
              </button>
          </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-zinc-950">
                        Request This Placement
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-zinc-600">
                        Tell the publisher about your campaign. The more details you share, the faster they can respond!
                      </p>
                    </div>

                    {/* Progress indicator */}
                    <div className="mb-6 bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                      <p className="text-xs font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        BOOKING PROCESS
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <div className="shrink-0 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">1</div>
                          <span className="font-semibold text-indigo-900">Submit request</span>
                          <span className="text-indigo-600">← You are here</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <div className="shrink-0 w-5 h-5 rounded-full bg-zinc-200 flex items-center justify-center font-bold">2</div>
                          <span>Publisher responds (24h)</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <div className="shrink-0 w-5 h-5 rounded-full bg-zinc-200 flex items-center justify-center font-bold">3</div>
                          <span>Finalize & launch</span>
                        </div>
                      </div>
                    </div>

            {roleLoading ? (
                      <div className="py-12 text-center text-sm text-zinc-500">Loading...</div>
            ) : roleInfo?.role === 'sponsor' && roleInfo?.sponsorId ? (
                      <form className="space-y-5">
                <div>
                          <label
                            htmlFor="company"
                            className="mb-2 block text-sm font-semibold text-zinc-900"
                          >
                            Your Company
                  </label>
                          <input
                            id="company"
                            name="company"
                            value={roleInfo.name || user?.name || 'Your Company'}
                            readOnly
                            className="w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 font-medium outline-none"
                          />
                </div>

                <div>
                  <label
                    htmlFor="message"
                            className="mb-2 block text-sm font-semibold text-zinc-900"
                  >
                            Campaign Details
                  </label>

                          {/* Helper text with suggestions */}
                          <div className="mb-2 text-xs text-zinc-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="font-semibold text-blue-900 mb-1 flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                              TIP: Include these details:
                            </p>
                            <ul className="space-y-0.5 ml-4 list-disc text-blue-800">
                              <li>What's your product/service?</li>
                              <li>Who's your target audience?</li>
                              <li>Campaign goals & timing</li>
                              <li>Why you're a good fit</li>
                            </ul>
                          </div>

                  <textarea
                    id="message"
                            name="message"
                            rows={8}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                            placeholder="Example: We're a B2B SaaS tool that helps developers automate testing. Our target audience is software engineers and DevOps teams. We're launching a new feature and want to reach your engaged developer community. Timeline: Next 2 months. Budget: Flexible for the right fit!"
                            className="w-full rounded-xl border-2 border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                          <p className="mt-1.5 text-xs text-zinc-500">
                            {message.length} characters • {message.length < 50 ? 'Add more details to improve response rate' : message.length < 150 ? 'Good start! Consider adding more context' : '✓ Great detail!'}
                          </p>
                </div>

                        {bookingError && (
                          <div className="rounded-xl bg-red-50 border-2 border-red-200 p-3 text-sm text-red-700">
                            <strong>⚠️ Error:</strong> {bookingError}
                          </div>
                        )}

                <button
                          type="button"
                  onClick={handleBooking}
                          disabled={booking || !adSlot.isAvailable}
                          style={{
                            display: 'inline-flex',
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '12px',
                            background: booking || !adSlot.isAvailable ? '#93c5fd' : 'linear-gradient(to right, #4f46e5, #7c3aed)',
                            padding: '16px 24px',
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#ffffff',
                            border: 'none',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                            transition: 'all 0.2s',
                            cursor: booking || !adSlot.isAvailable ? 'not-allowed' : 'pointer',
                            opacity: booking || !adSlot.isAvailable ? 0.5 : 1,
                          }}
                          onMouseEnter={(e) => {
                            if (!booking && adSlot.isAvailable) {
                              e.currentTarget.style.background = 'linear-gradient(to right, #4338ca, #6d28d9)';
                              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!booking && adSlot.isAvailable) {
                              e.currentTarget.style.background = 'linear-gradient(to right, #4f46e5, #7c3aed)';
                              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }
                          }}
                >
                          {booking ? (
                            <>
                              <svg style={{ animation: 'spin 1s linear infinite', marginLeft: '-4px', marginRight: '8px', height: '16px', width: '16px', color: 'white' }} fill="none" viewBox="0 0 24 24">
                                <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Sending Request...
                            </>
                          ) : (
                            'Send Booking Request'
                          )}
                </button>

                        {/* Trust signals below button */}
                        <div className="flex items-center justify-center gap-4 text-xs text-zinc-600">
                          <div className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>No payment now</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>Response in 24h</span>
                          </div>
                        </div>
                      </form>
            ) : (
                      <div className="space-y-4">
                        <div className="rounded-xl bg-amber-50 border-2 border-amber-200 p-5 text-center">
                          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-amber-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <p className="font-semibold text-amber-900 mb-1">Login Required</p>
                          <p className="text-sm text-amber-800">
                            {user
                              ? 'You need a sponsor account to request placements'
                              : 'Sign in with a sponsor account to book this placement'}
                          </p>
                        </div>
                <button
                          type="button"
                  disabled
                          className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-xl bg-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-500"
                >
                          Submit Request
                </button>
              </div>
            )}

                    <div className="mt-5 rounded-xl bg-zinc-50 border border-zinc-200 p-4 text-sm leading-6 text-zinc-700">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="font-semibold text-zinc-900 mb-1">Investment Summary</p>
                          <p>
                            You're requesting this placement at{' '}
                            <span className="font-bold text-zinc-900">
                              {formatPrice(adSlot.basePrice)}
                            </span>{' '}
                            per month. Final terms will be discussed with the publisher.
                          </p>
                        </div>
                      </div>
          </div>
                  </>
                )}
              </div>
            </aside>
          </div>
        </section>
      </div>

      {/* Quote Request Modal */}
      <QuoteRequestModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        adSlot={adSlot}
        userEmail={user?.email}
        userName={roleInfo?.name || user?.name}
      />
    </main>
  );
}
