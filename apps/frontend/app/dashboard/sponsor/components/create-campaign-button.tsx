'use client';

import { useState } from 'react';
import { CampaignForm } from './campaign-form';
import { trackEngagement, trackButtonClick } from '@/lib/analytics';

export function CreateCampaignButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (isOpen) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          padding: '16px',
          backdropFilter: 'blur(4px)',
        }}
        onClick={() => setIsOpen(false)}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '672px',
            borderRadius: '16px',
            backgroundColor: 'white',
            padding: '32px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
            }}
          >
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#111827',
                margin: 0,
              }}
            >
              Create Campaign
            </h2>
            <button
              onClick={() => {
                trackEngagement.closeModal('create_campaign');
                setIsOpen(false);
              }}
              style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#6b7280',
                fontSize: '20px',
                lineHeight: 1,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.color = '#111827';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#6b7280';
              }}
            >
              ✕
            </button>
          </div>
          <CampaignForm onSuccess={() => setIsOpen(false)} onCancel={() => setIsOpen(false)} />
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        trackButtonClick('Create New Campaign', 'sponsor_dashboard');
        trackEngagement.openModal('create_campaign');
        setIsOpen(true);
      }}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
      style={{
        padding: '12px 24px',
        backgroundColor: '#4f46e5',
        color: 'white',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        ...(isHovered && { backgroundColor: '#4338ca' }),
      }}
    >
      Create New Campaign
    </button>
  );
}
