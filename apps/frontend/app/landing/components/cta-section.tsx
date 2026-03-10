import Link from 'next/link';
import { Button } from '@/app/components/ui';

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
      className="bg-gradient-to-br from-blue-600 to-indigo-700 py-20 md:py-28 relative overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Testimonials */}
          <div className="mb-16">
            <h2 className="text-center text-white text-lg font-medium mb-8 opacity-90">
              Trusted by thousands of brands and creators
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-white text-sm leading-relaxed mb-4">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{testimonial.author}</div>
                      <div className="text-white/70 text-xs">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main CTA */}
          <div className="text-center space-y-8">
            <h2
              id="cta-heading"
              className="text-4xl md:text-5xl font-bold text-white leading-tight"
            >
              Ready to Transform Your{' '}
              <span className="text-yellow-300">Sponsorship Strategy?</span>
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Join thousands of sponsors and publishers already using Anvara to grow their
              businesses. Start your free trial today—no credit card required.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/login">
                <Button
                  size="lg"
                  className="min-w-[220px] bg-white text-[var(--color-primary)] hover:bg-gray-50 shadow-xl hover:shadow-2xl transition-all"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button
                  size="lg"
                  variant="secondary"
                  className="min-w-[220px] bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 backdrop-blur-sm"
                >
                  Explore Marketplace
                </Button>
              </Link>
            </div>

            {/* Trust Signals */}
            <div className="pt-8 space-y-4">
              <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
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
              <div className="pt-8">
                <p className="text-white/60 text-sm mb-4">FEATURED IN</p>
                <div className="flex flex-wrap items-center justify-center gap-8">
                  {trustedBy.map((brand, index) => (
                    <div
                      key={index}
                      className="w-20 h-12 bg-white/10 rounded-lg flex items-center justify-center border border-white/20 backdrop-blur-sm"
                    >
                      <span className="text-white font-bold text-sm">{brand.logo}</span>
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
