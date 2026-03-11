'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export function HeroSection() {
  return (
    <section
      className="container py-24 md:py-32 px-4"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center space-y-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200"
            variants={fadeInUp}
          >
            <span className="text-sm font-medium text-blue-700">
              The Future of Creator Monetization
            </span>
          </motion.div>

          <motion.h1
            id="hero-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-text-primary)] leading-tight"
            variants={fadeInUp}
          >
            The Sponsorship Marketplace for{' '}
            <span className="text-[var(--color-primary)]">Modern Creators</span>
          </motion.h1>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            variants={fadeInUp}
          >
            <Link
              href="/login"
              className="min-w-[200px] inline-flex items-center justify-center rounded-lg bg-[#667eea] px-6 py-3 text-lg font-medium transition hover:opacity-90"
              style={{color: 'white'}}
              >
              Get Started Free
            </Link>

            <Link
              href="/marketplace"
              className="min-w-[200px] inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-lg font-medium transition hover:bg-gray-50 text-gray-900"
            >
              Browse Marketplace
            </Link>
          </motion.div>

          <motion.div
            className="pt-8 flex flex-col items-center gap-4"
            variants={fadeInUp}
          >
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <motion.div
                className="flex -space-x-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.5 + (i * 0.1),
                      type: 'spring',
                      stiffness: 400,
                      damping: 25,
                    }}
                  >
                    {String.fromCharCode(64 + i)}
                  </motion.div>
                ))}
              </motion.div>
              <span>Join 10,000+ sponsors and publishers</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-[var(--color-text-muted)]">
              <div className="flex items-center gap-2">
                <motion.div
                  className="flex gap-0.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.svg
                      key={i}
                      className="w-4 h-4 fill-yellow-500"
                      viewBox="0 0 20 20"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: 0.8 + (i * 0.1),
                        type: 'spring',
                        stiffness: 400,
                        damping: 20,
                      }}
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </motion.svg>
                  ))}
                </motion.div>
                <span className="font-medium text-[var(--color-text-secondary)]">4.9/5</span>
              </div>
              <span>•</span>
              <span>$2M+ in campaigns launched</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-16 relative"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        >
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-[var(--color-border)] p-8 md:p-12 shadow-xl">
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                className="md:col-span-2 bg-white rounded-lg p-6 shadow-md"
                whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.15)' }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <motion.div
                        className="h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      />
                      <motion.div
                        className="h-24 bg-gradient-to-br from-green-100 to-green-200 rounded"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-lg p-6 shadow-md flex flex-col justify-center"
                whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.15)' }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="text-3xl font-bold text-[var(--color-primary)]"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, type: 'spring', stiffness: 200 }}
                >
                  $500K+
                </motion.div>
                <div className="text-sm text-[var(--color-text-secondary)] mt-1">
                  Monthly Revenue
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <motion.div
                    className="text-2xl font-bold text-green-600"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    ↑ 32%
                  </motion.div>
                  <div className="text-xs text-[var(--color-text-muted)]">vs last month</div>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div
            className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-400 rounded-full opacity-20 blur-2xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
