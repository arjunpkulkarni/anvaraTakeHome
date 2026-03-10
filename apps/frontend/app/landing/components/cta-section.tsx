'use client';

import Link from 'next/link';

export function CTASection() {
  const testimonials = [
    {
      quote: "Anvara helped us reach the perfect audience. Our ROI increased by 300%!",
      author: "Sarah Chen",
      role: "Marketing Director, TechCorp",
      avatar: "SC",
    },
    {
      quote: "The easiest way to monetize our content. We're earning 5x more than before.",
      author: "Michael Rodriguez",
      role: "Publisher, CodeDaily",
      avatar: "MR",
    },
    {
      quote: "Smart matching and transparent pricing. This is the future of sponsorships.",
      author: "Emily Watson",
      role: "CEO, CreatorHub",
      avatar: "EW",
    },
  ];

  const trustedBy = [
    { name: 'TechCrunch', logo: 'TC' },
    { name: 'Forbes', logo: 'FB' },
    { name: 'Wired', logo: 'WD' },
    { name: 'Bloomberg', logo: 'BB' },
  ];

  return (
    <section
      className="py-20 md:py-28 relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom right, #2563eb, #4f46e5)',
      }}
      aria-labelledby="cta-heading"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0" style={{ opacity: 0.1 }}>
        <div
          className="absolute top-0 left-0 rounded-full"
          style={{
            width: '384px',
            height: '384px',
            background: 'white',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute bottom-0 right-0 rounded-full"
          style={{
            width: '384px',
            height: '384px',
            background: 'white',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="container px-4 relative" style={{ zIndex: 10, maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Testimonials */}
          <div style={{marginBottom: '64px'}}>
            <h2
              className="text-center text-white"
              style={{
                fontSize: '18px',
                fontWeight: 500,
                color: 'white',
                opacity: 0.9,
                marginBottom: '28px'
              }}
            >
              Trusted by thousands of brands and creators
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="rounded-2xl p-6"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-4 h-4" viewBox="0 0 20 20" style={{ fill: '#fbbf24' }}>
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-white mb-4" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="rounded-full flex items-center justify-center text-white font-semibold"
                      style={{
                        width: '40px',
                        height: '40px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        fontSize: '14px',
                      }}
                    >
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="text-white font-medium" style={{ fontSize: '14px' }}>
                        {testimonial.author}
                      </div>
                      <div className="text-white" style={{ fontSize: '12px', opacity: 0.7 }}>
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main CTA */}
          <div className="text-center" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <h2
              id="cta-heading"
              className="text-white"
              style={{
                fontSize: '48px',
                fontWeight: 700,
                lineHeight: '1.2',
              }}
            >
              Ready to Transform Your{' '}
              <span style={{ color: '#fcd34d' }}>Sponsorship Strategy?</span>
            </h2>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              style={{ paddingTop: '16px' }}
            >
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg font-semibold transition-all"
                style={{
                  minWidth: '220px',
                  padding: '12px 24px',
                  fontSize: '18px',
                  background: 'white',
                  color: '#2563eb',
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f9fafb';
                  e.currentTarget.style.boxShadow = '0 25px 50px -12px rgb(0 0 0 / 0.25)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)';
                }}
              >
                Start Free Trial
              </Link>
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center rounded-lg font-semibold transition-all"
                style={{
                  minWidth: '220px',
                  padding: '12px 24px',
                  fontSize: '18px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(8px)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                Explore Marketplace
              </Link>
            </div>

            {/* Trust Signals */}
            <div style={{ paddingTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                className="flex items-center justify-center gap-2 text-white flex-wrap"
                style={{
                  fontSize: '14px',
                  opacity: 0.8,
                }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Free 14-day trial</span>
                <span>•</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>No credit card required</span>
                <span>•</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Cancel anytime</span>
              </div>

              {/* Trusted By Logos */}
              <div style={{ paddingTop: '32px' }}>
                <p className="text-white" style={{ fontSize: '14px', opacity: 0.6, marginBottom: '16px' }}>
                  FEATURED IN
                </p>
                <div className="flex flex-wrap items-center justify-center gap-8">
                  {trustedBy.map((brand, index) => (
                    <div
                      key={index}
                      className="rounded-lg flex items-center justify-center"
                      style={{
                        width: '80px',
                        height: '48px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <span className="text-white font-bold" style={{ fontSize: '14px' }}>
                        {brand.logo}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
