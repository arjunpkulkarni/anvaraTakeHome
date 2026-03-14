import type { Metadata } from 'next';
import { HeroSection, FeaturesSection, HowItWorksSection, CTASection } from './components';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'The modern sponsorship marketplace for creators. Connect sponsors with publishers, launch campaigns, and grow your business with our powerful advertising platform.',
  openGraph: {
    title: 'Anvara - The Sponsorship Marketplace for Modern Creators',
    description:
      'Connect sponsors with publishers. Launch campaigns, manage ad slots, and grow your business with our powerful platform.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anvara - The Sponsorship Marketplace for Modern Creators',
    description:
      'Connect sponsors with publishers. Launch campaigns, manage ad slots, and grow your business.',
  },
};

export default function LandingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Anvara Marketplace',
    description: 'The modern sponsorship marketplace connecting sponsors with publishers',
    url: 'https://anvara.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://anvara.com/marketplace?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </div>
    </>
  );
}
