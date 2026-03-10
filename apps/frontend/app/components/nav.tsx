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
              style={{ objectFit: 'contain' }}
              priority
            />
          </motion.div>
        </Link>

        <div className="flex items-center gap-6">
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
      </nav>
    </motion.header>
  );
}
