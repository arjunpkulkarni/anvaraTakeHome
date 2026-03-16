/**
 * Animation Utilities & Constants
 * Centralized animation configurations using Framer Motion
 */

import { Variants } from 'framer-motion';

// Animation Durations
export const DURATIONS = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8,
} as const;

// Easing Functions
export const EASINGS = {
  easeOut: [0.19, 1, 0.22, 1],
  easeInOut: [0.45, 0, 0.55, 1],
  spring: { type: 'spring', stiffness: 300, damping: 30 },
  springBouncy: { type: 'spring', stiffness: 400, damping: 25 },
  springGentle: { type: 'spring', stiffness: 200, damping: 30 },
} as const;

// Page Transitions
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATIONS.normal,
      ease: EASINGS.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: DURATIONS.fast,
    },
  },
};

// Fade In
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: DURATIONS.normal },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATIONS.fast },
  },
};

// Fade In Up
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATIONS.normal,
      ease: EASINGS.easeOut,
    },
  },
};

// Fade In Down
export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATIONS.normal,
      ease: EASINGS.easeOut,
    },
  },
};

// Scale In
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: DURATIONS.normal,
      ease: EASINGS.easeOut,
    },
  },
};

// Slide In Right
export const slideInRight: Variants = {
  initial: { opacity: 0, x: 50 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: DURATIONS.normal,
      ease: EASINGS.easeOut,
    },
  },
};

// Slide In Left
export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -50 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: DURATIONS.normal,
      ease: EASINGS.easeOut,
    },
  },
};

// Stagger Children
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerFastContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

// Card Animations
export const cardHover = {
  initial: { scale: 1, y: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    transition: {
      duration: DURATIONS.fast,
      ease: EASINGS.easeOut,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: DURATIONS.instant,
    },
  },
};

// Button Animations
export const buttonPress = {
  scale: 0.95,
  transition: {
    duration: DURATIONS.instant,
  },
};

// Delete Animation (slide out and fade)
export const deleteAnimation: Variants = {
  initial: { opacity: 1, x: 0, height: 'auto' },
  exit: {
    opacity: 0,
    x: -100,
    height: 0,
    marginTop: 0,
    marginBottom: 0,
    transition: {
      duration: DURATIONS.normal,
      ease: EASINGS.easeInOut,
    },
  },
};

// Create Animation (fade and scale in)
export const createAnimation: Variants = {
  initial: { opacity: 0, scale: 0.8, y: -20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: DURATIONS.normal,
      ease: EASINGS.easeOut,
    },
  },
};

// Toast Notification Animation
export const toastAnimation: Variants = {
  initial: { opacity: 0, y: -50, scale: 0.9 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...EASINGS.springGentle,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: DURATIONS.fast,
    },
  },
};

// Modal Animation
export const modalAnimation: Variants = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: DURATIONS.normal,
      ease: EASINGS.easeOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: DURATIONS.fast,
    },
  },
};

// Modal Overlay Animation
export const overlayAnimation: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: DURATIONS.fast,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: DURATIONS.fast,
    },
  },
};

// Success Checkmark Animation
export const successCheckmark: Variants = {
  initial: { scale: 0, rotate: -180 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: {
      ...EASINGS.springBouncy,
      duration: DURATIONS.slow,
    },
  },
};

// Loading Spinner Animation
export const spinAnimation = {
  rotate: 360,
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: 'linear',
  },
};

// Pulse Animation
export const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

// Skeleton Loading Animation
export const skeletonAnimation = {
  opacity: [0.5, 1, 0.5],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
};

// List Item Animation
export const listItemAnimation: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: DURATIONS.fast,
    },
  },
};

// Tab Switch Animation
export const tabAnimation: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATIONS.fast,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: DURATIONS.fast,
    },
  },
};

// Progress Bar Animation
export const progressBarAnimation = {
  initial: { width: 0 },
  animate: (width: number) => ({
    width: `${width}%`,
    transition: {
      duration: DURATIONS.slow,
      ease: EASINGS.easeOut,
    },
  }),
};

// Bounce In
export const bounceIn: Variants = {
  initial: { scale: 0 },
  animate: {
    scale: 1,
    transition: EASINGS.springBouncy,
  },
};
