'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { authClient } from '@/auth-client';
import { trackAuthEvent } from '@/lib/analytics';

type UserRole = 'sponsor' | 'publisher' | null;

export function Nav() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [role, setRole] = useState<UserRole>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
      setDropdownOpen(false);
    };
    closeMobileMenu();
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-user-dropdown]')) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);

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

  // Get user initials for avatar
  const getUserInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

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
                className="relative"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                data-user-dropdown
              >
                {/* User Avatar Button */}
                <motion.button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="User menu"
                  aria-expanded={dropdownOpen}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold text-sm shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                    {getUserInitials(user.name)}
                  </div>
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
                    >
                      {/* User Info Section */}
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        {role && (
                          <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                            {role}
                          </div>
                        )}
                      </div>

                      {/* Logout Button */}
                      <div className="p-2">
                        <button
                          onClick={async () => {
                            setDropdownOpen(false);
                            trackAuthEvent.logout();
                            await authClient.signOut({
                              fetchOptions: {
                                onSuccess: () => {
                                  window.location.href = '/';
                                },
                              },
                            });
                          }}
                          className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Link href="/login">
                  <motion.button
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'white',
                      backgroundColor: '#2563eb',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.2s',
                    }}
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: '#1d4ed8',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Login
                  </motion.button>
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
