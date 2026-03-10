'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
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
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291'}/api/auth/role/${user.id}`
      )
        .then((res) => res.json())
        .then((data) => setRole(data.role))
        .catch(() => setRole(null));
    } else {
      setRole(null);
    }
  }, [user?.id]);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border)] bg-white/80 backdrop-blur-sm">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-[var(--color-primary)] hover:opacity-80 transition-opacity">
          Anvara
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/marketplace"
            className={`text-sm font-medium transition-colors ${
              isActive('/marketplace')
                ? 'text-[var(--color-text-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Marketplace
          </Link>

          {user && role === 'sponsor' && (
            <Link
              href="/dashboard/sponsor"
              className={`text-sm font-medium transition-colors ${
                isActive('/dashboard/sponsor')
                  ? 'text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              My Campaigns
            </Link>
          )}
          {user && role === 'publisher' && (
            <Link
              href="/dashboard/publisher"
              className={`text-sm font-medium transition-colors ${
                isActive('/dashboard/publisher')
                  ? 'text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              My Ad Slots
            </Link>
          )}

          {isPending ? (
            <span className="text-[var(--color-text-muted)]">...</span>
          ) : user ? (
            <div className="flex items-center gap-3">
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
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm">
                Login
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
