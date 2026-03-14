export function HowItWorksSection() {
  const sponsorSteps = [
    {
      number: 1,
      title: 'Create Your Campaign',
      description: 'Set your budget, define your target audience, and specify your goals.',
      icon: (
        <svg
          className="w-8 h-8 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
    },
    {
      number: 2,
      title: 'Browse Ad Slots',
      description: 'Explore our marketplace of premium publishers and their available inventory.',
      icon: (
        <svg
          className="w-8 h-8 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
    {
      number: 3,
      title: 'Launch & Track',
      description: 'Book your slots and monitor performance with real-time analytics.',
      icon: (
        <svg
          className="w-8 h-8 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
  ];

  const publisherSteps = [
    {
      number: 1,
      title: 'List Your Inventory',
      description: 'Add your ad slots with pricing, format, and audience details.',
      icon: (
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      number: 2,
      title: 'Get Discovered',
      description: 'Our platform matches you with relevant sponsors automatically.',
      icon: (
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
    },
    {
      number: 3,
      title: 'Earn Revenue',
      description: 'Receive bookings, deliver content, and get paid seamlessly.',
      icon: (
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-20 md:py-28" aria-labelledby="how-it-works-heading">
      <div className="container px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2
            id="how-it-works-heading"
            className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4"
          >
            How It Works
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Get started in minutes with our simple three-step process
          </p>
        </div>

        <div className="max-w-7xl mx-auto space-y-20">
          {/* For Sponsors */}
          <div>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-4">
                <span className="text-sm font-semibold text-blue-700">For Sponsors</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connection Lines (hidden on mobile) */}
              <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 -z-10"></div>

              {sponsorSteps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Step Card */}
                  <div className="bg-white rounded-2xl border border-[var(--color-border)] p-8 shadow-sm hover:shadow-lg transition-shadow">
                    {/* Number Badge */}
                    <div className="absolute -top-4 left-8 w-12 h-12 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 mt-4">
                      {step.icon}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow (mobile only) */}
                  {index < sponsorSteps.length - 1 && (
                    <div className="md:hidden flex justify-center my-4">
                      <svg
                        className="w-6 h-6 text-blue-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* For Publishers */}
          <div>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200 mb-4">
                <span className="text-sm font-semibold text-green-700">For Publishers</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connection Lines (hidden on mobile) */}
              <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-green-200 via-green-300 to-green-200 -z-10"></div>

              {publisherSteps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Step Card */}
                  <div className="bg-white rounded-2xl border border-[var(--color-border)] p-8 shadow-sm hover:shadow-lg transition-shadow">
                    {/* Number Badge */}
                    <div className="absolute -top-4 left-8 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6 mt-4">
                      {step.icon}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow (mobile only) */}
                  {index < publisherSteps.length - 1 && (
                    <div className="md:hidden flex justify-center my-4">
                      <svg
                        className="w-6 h-6 text-green-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
