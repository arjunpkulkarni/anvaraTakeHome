'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  adSlot: {
    id: string;
    name: string;
    basePrice: number;
    type: string;
    publisher?: {
      name: string;
    };
  };
  userEmail?: string;
  userName?: string;
}

interface FormData {
  companyName: string;
  email: string;
  phone: string;
  budget: string;
  timeline: string;
  goals: string;
  specialRequirements: string;
}

export function QuoteRequestModal({ isOpen, onClose, adSlot, userEmail, userName }: QuoteRequestModalProps) {
  const [formData, setFormData] = useState<FormData>({
    companyName: userName || '',
    email: userEmail || '',
    phone: '',
    budget: '',
    timeline: '',
    goals: '',
    specialRequirements: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [quoteId, setQuoteId] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.companyName.trim()) {
      setErrorMessage('Company name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setErrorMessage('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }
    if (!formData.goals.trim()) {
      setErrorMessage('Please describe your campaign goals');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291'}/api/quotes/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          adSlotId: adSlot.id,
          adSlotName: adSlot.name,
          publisherName: adSlot.publisher?.name,
          listingPrice: adSlot.basePrice,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit quote request');
      }

      setQuoteId(data.quoteId);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  };

  const handleClose = () => {
    if (status === 'success') {
      setFormData({
        companyName: userName || '',
        email: userEmail || '',
        phone: '',
        budget: '',
        timeline: '',
        goals: '',
        specialRequirements: '',
      });
      setStatus('idle');
      setQuoteId('');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
        >
          {status === 'success' ? (
            // Success State
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-6">
                <svg className="w-10 h-10 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-3">Quote Request Sent!</h2>
              <p className="text-lg text-gray-600 mb-2">
                Your reference number: <span className="font-mono font-bold text-indigo-600">{quoteId}</span>
              </p>
              
              <div className="mt-8 p-6 bg-indigo-50 rounded-xl border border-indigo-200 text-left">
                <h3 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  What happens next?
                </h3>
                <ul className="space-y-2 text-sm text-indigo-800">
                  <li className="flex items-start gap-2">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center font-bold text-indigo-900 text-xs">1</span>
                    <span>The publisher will review your quote request within <strong>24 hours</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center font-bold text-indigo-900 text-xs">2</span>
                    <span>They'll reach out to <strong>{formData.email}</strong> with a custom quote</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center font-bold text-indigo-900 text-xs">3</span>
                    <span>You'll discuss details, negotiate terms, and finalize the partnership</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 flex gap-3 justify-center">
                <button
                  onClick={handleClose}
                  className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Got it, thanks!
                </button>
              </div>

              <p className="mt-6 text-sm text-gray-500">
                We've sent a confirmation email to {formData.email}
              </p>
            </div>
          ) : (
            // Form State
            <>
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Request Custom Quote</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    For {adSlot.name}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Info Banner */}
              <div className="mx-6 mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Need custom pricing or have questions?</p>
                    <p className="text-blue-800">Fill out this form and the publisher will get back to you with a personalized quote within 24 hours.</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Contact Information */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Contact Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        disabled={status === 'loading'}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                        placeholder="Acme Corp"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={status === 'loading'}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                          placeholder="you@company.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone <span className="text-gray-400 text-xs">(optional)</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={status === 'loading'}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Campaign Details */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Campaign Details</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                          Estimated Budget <span className="text-gray-400 text-xs">(optional)</span>
                        </label>
                        <select
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          disabled={status === 'loading'}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                        >
                          <option value="">Select budget range</option>
                          <option value="under-1k">Under $1,000</option>
                          <option value="1k-5k">$1,000 - $5,000</option>
                          <option value="5k-10k">$5,000 - $10,000</option>
                          <option value="10k-25k">$10,000 - $25,000</option>
                          <option value="25k-plus">$25,000+</option>
                          <option value="flexible">Flexible</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-1">
                          Timeline <span className="text-gray-400 text-xs">(optional)</span>
                        </label>
                        <select
                          id="timeline"
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleChange}
                          disabled={status === 'loading'}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                        >
                          <option value="">When do you need this?</option>
                          <option value="asap">ASAP (within 2 weeks)</option>
                          <option value="1-month">Within 1 month</option>
                          <option value="1-3-months">1-3 months</option>
                          <option value="3-plus-months">3+ months</option>
                          <option value="flexible">Flexible</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-1">
                        Campaign Goals <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="goals"
                        name="goals"
                        value={formData.goals}
                        onChange={handleChange}
                        disabled={status === 'loading'}
                        rows={4}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                        placeholder="Tell us about your product, target audience, and what you hope to achieve..."
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        The more details you provide, the better quote we can prepare
                      </p>
                    </div>

                    <div>
                      <label htmlFor="specialRequirements" className="block text-sm font-medium text-gray-700 mb-1">
                        Special Requirements <span className="text-gray-400 text-xs">(optional)</span>
                      </label>
                      <textarea
                        id="specialRequirements"
                        name="specialRequirements"
                        value={formData.specialRequirements}
                        onChange={handleChange}
                        disabled={status === 'loading'}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                        placeholder="Any custom requests, specific messaging requirements, or questions?"
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing Reference */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Standard listing price:</span>
                    <span className="font-bold text-gray-900 text-lg">
                      ${Number(adSlot.basePrice).toLocaleString()}/mo
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Custom quotes may vary based on your requirements and campaign scope
                  </p>
                </div>

                {/* Error Message */}
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-xl"
                  >
                    <div className="flex gap-2">
                      <svg className="w-5 h-5 text-red-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-red-800">{errorMessage}</p>
                    </div>
                  </motion.div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={status === 'loading'}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {status === 'loading' ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Submit Quote Request'
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
