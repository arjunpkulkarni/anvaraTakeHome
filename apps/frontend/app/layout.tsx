import type { Metadata, Viewport } from 'next';
import { DM_Sans } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import { Nav } from './components/nav';
import { ToastProvider } from './components/ui';
import { ErrorBoundary } from './components/error-boundary';
import { Providers } from './providers';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-dm-sans',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://anvara.com';
const siteName = 'Anvara';
const siteDescription =
  'The modern sponsorship marketplace connecting sponsors with publishers. Launch campaigns, manage ad slots, and grow your business with our powerful platform.';

export const metadata: Metadata = {
  title: {
    default: 'Anvara Marketplace - Connect Sponsors with Publishers',
    template: '%s | Anvara Marketplace',
  },
  description: siteDescription,
  keywords: [
    'sponsorship marketplace',
    'ad slots',
    'content sponsorship',
    'publisher monetization',
    'sponsor campaigns',
    'advertising platform',
    'creator marketplace',
  ],
  authors: [{ name: 'Anvara' }],
  creator: 'Anvara',
  metadataBase: new URL(siteUrl),

  // Open Graph metadata for social media sharing
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName,
    title: 'Anvara Marketplace - Connect Sponsors with Publishers',
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Anvara Marketplace - Sponsorship Platform for Modern Creators',
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    title: 'Anvara Marketplace - Connect Sponsors with Publishers',
    description: siteDescription,
    images: [`${siteUrl}/og-image.png`],
    creator: '@anvara',
    site: '@anvara',
  },

  // Icons and manifest
  icons: {
    icon: '/favicon.png',
  },
  // manifest: '/site.webmanifest', // Optional: add if you create a manifest file

  // Additional metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification tags (add your actual verification codes)
  // verification: {
  //   google: 'your-google-verification-code',
  //   yandex: 'your-yandex-verification-code',
  // },
};

// Viewport configuration (separate export in Next.js 15+)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // HINT: If using React Query, you would wrap children with QueryClientProvider here
  // See: https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr

  // Google Analytics ID - In production, this should come from environment variables
  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';

  return (
    <html lang="en" className={dmSans.variable}>
      <head>
        <link rel="canonical" href={siteUrl} />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body className="min-h-screen antialiased">
        <Providers>
          <ErrorBoundary>
            <ToastProvider>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-(--color-primary) focus:text-white focus:rounded"
              >
                Skip to main content
              </a>
              <Nav />
              <main id="main-content">{children}</main>
            </ToastProvider>
          </ErrorBoundary>
        </Providers>
        {/* Google Analytics - Only loads in production or when GA_ID is set */}
        {gaId && gaId !== 'G-XXXXXXXXXX' && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
