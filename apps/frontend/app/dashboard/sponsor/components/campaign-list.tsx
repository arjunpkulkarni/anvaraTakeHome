'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CampaignCard } from './campaign-card';

interface Campaign {
  id: string;
  name: string;
  description?: string;
  budget: number;
  spent: number;
  status: string;
  startDate: string;
  endDate: string;
}

interface CampaignListProps {
  campaigns: Campaign[];
}

export function CampaignList({ campaigns }: CampaignListProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (campaigns.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '16px',
          color: '#111827',
          marginBottom: '24px',
          fontWeight: '400',
        }}>
          You don't have any campaigns.
        </p>
        <Link
          href="#"
          onMouseOver={() => setIsHovered(true)}
          onMouseOut={() => setIsHovered(false)}
          style={{
            display: 'inline-block',
            padding: '12px 32px',
            backgroundColor: '#4f46e5',
            color: 'white',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            textDecoration: 'none',
            transition: 'background-color 0.2s',
            ...(isHovered && { backgroundColor: '#4338ca' }),
          }}
        >
          Create New Campaign
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}
