import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description:
    'Sign in to your Anvara account to access your dashboard, manage campaigns, or list ad slots.',
  robots: {
    index: false, // Login pages should not be indexed
    follow: false,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
