'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authClient } from '@/auth-client';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'sponsor' | 'publisher'>('sponsor');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sponsorHovered, setSponsorHovered] = useState(false);
  const [publisherHovered, setPublisherHovered] = useState(false);

  // Auto-fill credentials based on selected role
  const email = role === 'sponsor' ? 'sponsor@example.com' : 'publisher@example.com';
  const password = 'password';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Use Better Auth signIn.email with proper callbacks
    const { error: signInError } = await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: async (ctx) => {
          // Fetch user role to determine redirect
          try {
            const userId = ctx.data?.user?.id;
            if (userId) {
              const roleRes = await fetch(`${API_URL}/api/auth/role/${userId}`);
              const roleData = await roleRes.json();
              if (roleData.role === 'sponsor') {
                router.push('/dashboard/sponsor');
              } else if (roleData.role === 'publisher') {
                router.push('/dashboard/publisher');
              } else {
                router.push('/');
              }
            } else {
              router.push('/');
            }
          } catch {
            router.push('/');
          }
        },
        onError: (ctx) => {
          setError(ctx.error.message || 'Login failed');
          setLoading(false);
        },
      }
    );

    // Handle any errors not caught by onError callback
    if (signInError) {
      setError(signInError.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      background: '#ffffff',
    }}>
      {/* Left Side - Branding/Visual */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.07'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.4,
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{
            marginBottom: '48px',
            display: 'flex',
            alignItems: 'center',
          }}>
            <Image
              src="/anvara_logo_blue_1000px.png"
              alt="Anvara Logo"
              width={180}
              height={60}
              style={{
                filter: 'brightness(0) invert(1)',
                objectFit: 'contain',
              }}
            />
          </div>

          <p style={{
            fontSize: '24px',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '48px',
            lineHeight: '1.6',
            maxWidth: '500px',
          }}>
            The modern sponsorship marketplace connecting brands with creators
          </p>

          {/* Features List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { icon: '✓', text: 'Connect with thousands of sponsors and publishers' },
              { icon: '✓', text: 'Manage campaigns and ad slots in one place' },
              { icon: '✓', text: 'Track performance and grow your business' },
            ].map((feature, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                color: 'white',
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}>
                  {feature.icon}
                </div>
                <span style={{ fontSize: '16px', opacity: 0.95 }}>
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={{
        padding: '60px 80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#fafafa',
        overflow: 'hidden',
      }}>
        <div style={{ maxWidth: '540px', width: '100%' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '8px',
            lineHeight: '1.2',
          }}>
            Welcome back
          </h2>

          <p style={{
            fontSize: '18px',
            color: '#6b7280',
            marginBottom: '32px',
          }}>
            Sign in to your account to continue
          </p>

          {error && (
            <div role="alert" style={{
              marginBottom: '24px',
              padding: '14px 18px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              color: '#dc2626',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '12px',
              }}>
                Choose your role
              </label>

              {/* Role Selector */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setRole('sponsor')}
                  onMouseEnter={() => setSponsorHovered(true)}
                  onMouseLeave={() => setSponsorHovered(false)}
                  style={{
                    flex: 1,
                    padding: '20px',
                    borderRadius: '14px',
                    border: role === 'sponsor' ? '3px solid #667eea' : '2px solid #e5e7eb',
                    backgroundColor: role === 'sponsor' ? '#f0f4ff' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    transform: sponsorHovered ? 'translateY(-4px)' : 'translateY(0)',
                    boxShadow: sponsorHovered ? '0 12px 24px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)',
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: role === 'sponsor' ? '#667eea' : '#f3f4f6',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={role === 'sponsor' ? 'white' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <polyline points="17 11 19 13 23 9" />
                    </svg>
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: role === 'sponsor' ? '#667eea' : '#374151',
                    marginBottom: '4px',
                    textAlign: 'center',
                  }}>
                    Sponsor
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    textAlign: 'center',
                  }}>
                    Run campaigns
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('publisher')}
                  onMouseEnter={() => setPublisherHovered(true)}
                  onMouseLeave={() => setPublisherHovered(false)}
                  style={{
                    flex: 1,
                    padding: '20px',
                    borderRadius: '14px',
                    border: role === 'publisher' ? '3px solid #667eea' : '2px solid #e5e7eb',
                    backgroundColor: role === 'publisher' ? '#f0f4ff' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    transform: publisherHovered ? 'translateY(-4px)' : 'translateY(0)',
                    boxShadow: publisherHovered ? '0 12px 24px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)',
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: role === 'publisher' ? '#667eea' : '#f3f4f6',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={role === 'publisher' ? 'white' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <line x1="3" y1="9" x2="21" y2="9" />
                      <line x1="9" y1="21" x2="9" y2="9" />
                    </svg>
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: role === 'publisher' ? '#667eea' : '#374151',
                    marginBottom: '4px',
                    textAlign: 'center',
                  }}>
                    Publisher
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    textAlign: 'center',
                  }}>
                    Manage ad slots
                  </div>
                </button>
              </div>

              {/* Hidden select for form submission */}
              <select
                id="role-select"
                value={role}
                onChange={(e) => setRole(e.target.value as 'sponsor' | 'publisher')}
                style={{ display: 'none' }}
              >
                <option value="sponsor">Sponsor</option>
                <option value="publisher">Publisher</option>
              </select>
            </div>

            {/* Info Box */}
            <div style={{
              padding: '16px 20px',
              backgroundColor: 'white',
              borderRadius: '12px',
              marginBottom: '24px',
              border: '1px solid #e5e7eb',
            }}>
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                marginBottom: '4px',
                fontWeight: '500',
              }}>
                Demo account
              </div>
              <div style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#374151',
              }}>
                {email}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 28px',
                backgroundColor: loading ? '#9ca3af' : '#667eea',
                color: 'white',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(102, 126, 234, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      animation: 'spin 1s linear infinite',
                    }}
                  >
                    <line x1="12" y1="2" x2="12" y2="6" />
                    <line x1="12" y1="18" x2="12" y2="22" />
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                    <line x1="2" y1="12" x2="6" y2="12" />
                    <line x1="18" y1="12" x2="22" y2="12" />
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  Sign in as {role === 'sponsor' ? 'Sponsor' : 'Publisher'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1024px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
