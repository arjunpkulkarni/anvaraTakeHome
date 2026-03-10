'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { authClient } from '@/auth-client';
import { Button } from './ui';

type UserRole = 'sponsor' | 'publisher' | null;

export function Nav() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [role, setRole] = useState<UserRole>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (user?.id) {
      fetch(
        `${typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL : 'http://localhost:4291'}/api/auth/role/${user.id}`
      )
        .then((res) => res.json())
        .then((data) => setRole(data.role))
        .catch(() => setRole(null));
    } else {
      // Set state in a timeout to avoid cascade
      const timer = setTimeout(() => setRole(null), 0);
      return () => clearTimeout(timer);
    }
  }, [user?.id]);

  // Close mobile menu when route changes
  useEffect(() => {
    const closeMobileMenu = () => {
      setMobileMenuOpen(false);
    };
    closeMobileMenu();
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const isActive = (path: string) => pathname === path;

  return (
    <motion.header 
      className="sticky top-0 z-40 w-full border-b border-[var(--color-border)] bg-white/80 backdrop-blur-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
    >
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src="/anvara_logo_blue_1000px.png"
              alt="Anvara"
              width={120}
              height={40}
              style={{ objectFit: 'contain', height: 'auto' }}
              priority
            />
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/marketplace"
            className={`text-sm font-medium transition-colors relative ${
              isActive('/marketplace')
                ? 'text-[var(--color-text-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Marketplace
            {isActive('/marketplace') && (
              <motion.div
                className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-[var(--color-primary)]"
                layoutId="navbar-indicator"
                transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
              />
            )}
          </Link>

          {user && role === 'sponsor' && (
            <Link
              href="/dashboard/sponsor"
              className={`text-sm font-medium transition-colors relative ${
                isActive('/dashboard/sponsor')
                  ? 'text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              My Campaigns
              {isActive('/dashboard/sponsor') && (
                <motion.div
                  className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-[var(--color-primary)]"
                  layoutId="navbar-indicator"
                  transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                />
              )}
            </Link>
          )}
          {user && role === 'publisher' && (
            <Link
              href="/dashboard/publisher"
              className={`text-sm font-medium transition-colors relative ${
                isActive('/dashboard/publisher')
                  ? 'text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              My Ad Slots
              {isActive('/dashboard/publisher') && (
                <motion.div
                  className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-[var(--color-primary)]"
                  layoutId="navbar-indicator"
                  transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                />
              )}
            </Link>
          )}

          <AnimatePresence mode="wait">
            {isPending ? (
              <motion.span 
                className="text-[var(--color-text-muted)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                ...
              </motion.span>
            ) : user ? (
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {user.name} {role && <span className="text-[var(--color-text-muted)]">({role})</span>}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    await authClient.signOut({
                      fetchOptions: {
                        onSuccess: () => {
                          window.location.href = '/';
                        },
                      },
                    });
                  }}
                >
                  Logout
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Link href="/login">
                  <Button size="sm">
                    Login
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <motion.div
            animate={mobileMenuOpen ? 'open' : 'closed'}
            className="w-6 h-5 flex flex-col justify-between"
          >
            <motion.span
              className="w-full h-0.5 bg-gray-800 block"
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: 45, y: 9 },
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="w-full h-0.5 bg-gray-800 block"
              variants={{
                closed: { opacity: 1 },
                open: { opacity: 0 },
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="w-full h-0.5 bg-gray-800 block"
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: -45, y: -9 },
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              className="fixed top-16 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="p-6 space-y-6">
                {/* User Info */}
                {user && (
                  <div className="pb-4 border-b border-gray-200">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    {role && (
                      <div className="text-xs text-gray-500 mt-1 capitalize">{role} Account</div>
                    )}
                  </div>
                )}

                {/* Navigation Links */}
                <nav className="space-y-1">
                  <Link
                    href="/marketplace"
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive('/marketplace')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    🏪 Marketplace
                  </Link>

                  {user && role === 'sponsor' && (
                    <Link
                      href="/dashboard/sponsor"
                      className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                        isActive('/dashboard/sponsor')
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      📢 My Campaigns
                    </Link>
                  )}

                  {user && role === 'publisher' && (
                    <Link
                      href="/dashboard/publisher"
                      className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                        isActive('/dashboard/publisher')
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      📺 My Ad Slots
                    </Link>
                  )}
                </nav>

                {/* Auth Actions */}
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  {user ? (
                    <button
                      onClick={async () => {
                        await authClient.signOut({
                          fetchOptions: {
                            onSuccess: () => {
                              window.location.href = '/';
                            },
                          },
                        });
                      }}
                      className="w-full px-4 py-3 text-left rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      🚪 Logout
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="block px-4 py-3 text-center rounded-lg text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
