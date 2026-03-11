'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdSlot } from '@/lib/api';
import { authClient } from '@/auth-client';

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
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291'}/api/auth/role/${sessionUser.id}`
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
                    {adSlot.isAvailable ? 'Available' : 'Booked'}
                  </span>
                </div>

                <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
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

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <p className="text-sm text-zinc-500">Format</p>
                    <p className="mt-1 font-medium text-zinc-900">
                      {adSlot.type === 'VIDEO' && 'Sponsored video segment'}
                      {adSlot.type === 'NEWSLETTER' && 'Newsletter feature'}
                      {adSlot.type === 'PODCAST' && 'Podcast integration'}
                      {adSlot.type === 'DISPLAY' && 'Display advertisement'}
                      {adSlot.type === 'NATIVE' && 'Native content'}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <p className="text-sm text-zinc-500">Average reach</p>
                    <p className="mt-1 font-medium text-zinc-900">
                      {adSlot.type === 'VIDEO' && '45k–80k views'}
                      {adSlot.type === 'NEWSLETTER' && '25k–50k readers'}
                      {adSlot.type === 'PODCAST' && '15k–30k listeners'}
                      {(adSlot.type === 'DISPLAY' || adSlot.type === 'NATIVE') && '100k+ impressions'}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <p className="text-sm text-zinc-500">Turnaround</p>
                    <p className="mt-1 font-medium text-zinc-900">2–3 weeks</p>
                  </div>
                </div>
              </div>

              {/* Premium Pricing Card */}
              <div className="w-full rounded-3xl border border-zinc-200 bg-zinc-950 p-6 text-white lg:max-w-sm">
                <p className="text-sm text-zinc-400">Starting price</p>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-4xl font-semibold tracking-tight">
                    {formatPrice(adSlot.basePrice)}
                  </span>
                  <span className="pb-1 text-sm text-zinc-400">per month</span>
                </div>

                <p className="mt-4 text-sm leading-6 text-zinc-300">
                  Premium placement with native integration. Reach a highly targeted audience that trusts the creator's recommendations.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <a
                    href="#request-form"
                    className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
                  >
                    Request this placement
                  </a>

                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-900"
                  >
                    Save for later
                  </button>
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
                className="sticky top-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
              >
                {bookingSuccess ? (
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-emerald-50 p-6 text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                        <svg
                          className="h-6 w-6 text-emerald-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-emerald-900">
                        Request submitted!
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-emerald-700">
                        The publisher will review your request and get in touch soon.
                      </p>
                    </div>
              <button
                onClick={handleUnbook}
                      className="w-full text-sm text-zinc-600 underline hover:text-zinc-900"
              >
                      Reset (for testing)
              </button>
          </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <h2 className="text-2xl font-semibold text-zinc-950">
                        Request this placement
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-zinc-600">
                        Send a note with your campaign goals, timing, and anything the publisher
                        should know.
                      </p>
        </div>

            {roleLoading ? (
                      <div className="py-12 text-center text-sm text-zinc-500">Loading...</div>
            ) : roleInfo?.role === 'sponsor' && roleInfo?.sponsorId ? (
                      <form className="space-y-5">
                <div>
                          <label
                            htmlFor="company"
                            className="mb-2 block text-sm font-medium text-zinc-900"
                          >
                            Your company
                  </label>
                          <input
                            id="company"
                            name="company"
                            value={roleInfo.name || user?.name || 'Your Company'}
                            readOnly
                            className="w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none"
                          />
                </div>

                <div>
                  <label
                    htmlFor="message"
                            className="mb-2 block text-sm font-medium text-zinc-900"
                  >
                            Message to publisher
                  </label>
                  <textarea
                    id="message"
                            name="message"
                            rows={7}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                            placeholder="Tell the publisher about your product, campaign goals, audience fit, and ideal timeline..."
                            className="w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900"
                  />
                </div>

                        {bookingError && (
                          <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">
                            {bookingError}
                          </div>
                        )}

                <button
                          type="button"
                  onClick={handleBooking}
                          disabled={booking || !adSlot.isAvailable}
                          className="inline-flex w-full items-center justify-center rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                          {booking ? 'Submitting...' : 'Submit request'}
                </button>
                      </form>
            ) : (
                      <div className="space-y-4">
                <button
                          type="button"
                  disabled
                          className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-2xl bg-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-500"
                >
                          Submit request
                </button>
                        <p className="text-center text-sm text-zinc-600">
                  {user
                    ? 'Only sponsors can request placements'
                    : 'Log in as a sponsor to request this placement'}
                </p>
              </div>
            )}

                    <div className="mt-5 rounded-2xl bg-zinc-50 p-4 text-sm leading-6 text-zinc-600">
                      You are requesting this placement at{' '}
                      <span className="font-semibold text-zinc-900">
                        {formatPrice(adSlot.basePrice)}
                      </span>{' '}
                      per month.
          </div>
                  </>
                )}
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
