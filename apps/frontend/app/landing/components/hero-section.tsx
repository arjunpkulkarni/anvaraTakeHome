import Link from 'next/link';

export function HeroSection() {
  return (
    <section
      className="container py-24 md:py-32 px-4"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200">
            <span className="text-sm font-medium text-blue-700">
              The Future of Creator Monetization
            </span>
          </div>

          <h1
            id="hero-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-text-primary)] leading-tight"
          >
            The Sponsorship Marketplace for{' '}
            <span className="text-[var(--color-primary)]">Modern Creators</span>
          </h1>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                href="/login"
                className="min-w-[200px] inline-flex items-center justify-center rounded-lg bg-black px-6 py-3 text-lg font-medium transition hover:opacity-90 text-white hover:text-white"
              >
                Get Started Free
              </Link>

              <Link
                href="/marketplace"
                className="min-w-[200px] inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-lg font-medium transition hover:bg-gray-50 text-gray-900"
              >
                Browse Marketplace
              </Link>
            </div>

          <div className="pt-8 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span>Join 10,000+ sponsors and publishers</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-[var(--color-text-muted)]">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-yellow-500" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="font-medium text-[var(--color-text-secondary)]">4.9/5</span>
              </div>
              <span>•</span>
              <span>$2M+ in campaigns launched</span>
            </div>
          </div>
        </div>

        <div className="mt-16 relative">
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-[var(--color-border)] p-8 md:p-12 shadow-xl">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white rounded-lg p-6 shadow-md">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <div className="h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded"></div>
                      <div className="h-24 bg-gradient-to-br from-green-100 to-green-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md flex flex-col justify-center">
                <div className="text-3xl font-bold text-[var(--color-primary)]">$500K+</div>
                <div className="text-sm text-[var(--color-text-secondary)] mt-1">
                  Monthly Revenue
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-2xl font-bold text-green-600">↑ 32%</div>
                  <div className="text-xs text-[var(--color-text-muted)]">vs last month</div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-400 rounded-full opacity-20 blur-2xl"></div>
        </div>
      </div>
    </section>
  );
}
