export function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'For Sponsors',
      description:
        'Create campaigns, set budgets, and reach your target audience through premium publishers. Track performance and optimize your advertising spend.',
      benefits: [
        'Campaign Management Dashboard',
        'Real-time Analytics',
        'Budget Control & Optimization',
        'Audience Targeting',
      ],
      gradient: 'from-blue-100 to-blue-50',
      iconBg: 'bg-blue-100',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'For Publishers',
      description:
        'List your ad slots, set your rates, and connect with sponsors looking for your audience. Monetize your content effortlessly.',
      benefits: [
        'Inventory Management',
        'Flexible Pricing Models',
        'Automated Bookings',
        'Revenue Analytics',
      ],
      gradient: 'from-green-100 to-green-50',
      iconBg: 'bg-green-100',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Smart Matching',
      description:
        'Our AI-powered algorithm connects sponsors with the most relevant publishers, ensuring maximum ROI and engagement.',
      benefits: [
        'Intelligent Recommendations',
        'Audience Alignment',
        'Performance Predictions',
        'Automated Negotiations',
      ],
      gradient: 'from-purple-100 to-purple-50',
      iconBg: 'bg-purple-100',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '50K+', label: 'Campaigns Launched' },
    { value: '95%', label: 'Satisfaction Rate' },
    { value: '$2M+', label: 'Revenue Generated' },
  ];

  return (
    <section
      className="bg-[var(--color-background-secondary)] py-20 md:py-28"
      aria-labelledby="features-heading"
    >
      <div className="container px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2
            id="features-heading"
            className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4"
          >
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Powerful features designed for both sponsors and publishers to maximize results
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto mb-16">
          {features.map((feature, index) => (
            <article
              key={index}
              className="bg-white rounded-2xl border border-[var(--color-border)] p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-6 shadow-sm`}
              >
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
                {feature.description}
              </p>

            </article>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl border border-[var(--color-border)] p-8 shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[var(--color-text-secondary)]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
