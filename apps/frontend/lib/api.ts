// Simple API client with proper typing

const API_URL = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL 
  ? process.env.NEXT_PUBLIC_API_URL 
  : 'http://localhost:4291';

export async function api<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    credentials: 'include', // Include cookies for auth
    ...options,
  });
  
  if (!res.ok) {
    // Try to extract error message from response
    try {
      const errorData = await res.json();
      throw new Error(errorData.error || errorData.message || 'API request failed');
    } catch {
      throw new Error('API request failed');
    }
  }
  
  return res.json();
}

// Campaign types
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

interface CreateCampaignData {
  name: string;
  description?: string;
  budget: number;
  startDate: string;
  endDate: string;
  cpmRate?: number;
  cpcRate?: number;
}

// Ad Slot types
interface AdSlot {
  id: string;
  name: string;
  type: string;
  description?: string;
  basePrice: number;
  isAvailable: boolean;
  publisher?: {
    id: string;
    name: string;
  };
}

interface CreateAdSlotData {
  name: string;
  description?: string;
  type: string;
  basePrice: number;
  dimensions?: string;
  targeting?: Record<string, unknown>;
}

// Placement types
interface Placement {
  id: string;
  campaignId: string;
  adSlotId: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface CreatePlacementData {
  campaignId: string;
  adSlotId: string;
  startDate: string;
  endDate: string;
}

// Dashboard types
interface DashboardStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalSpent: number;
  impressions: number;
}

// Campaigns
export const getCampaigns = (sponsorId?: string): Promise<Campaign[]> =>
  api<Campaign[]>(sponsorId ? `/api/campaigns?sponsorId=${sponsorId}` : '/api/campaigns');

export const getCampaign = (id: string): Promise<Campaign> => 
  api<Campaign>(`/api/campaigns/${id}`);

export const createCampaign = (data: CreateCampaignData): Promise<Campaign> =>
  api<Campaign>('/api/campaigns', { method: 'POST', body: JSON.stringify(data) });

// Ad Slots
export const getAdSlots = (publisherId?: string): Promise<AdSlot[]> =>
  api<AdSlot[]>(publisherId ? `/api/ad-slots?publisherId=${publisherId}` : '/api/ad-slots');

export const getAdSlot = (id: string): Promise<AdSlot> => 
  api<AdSlot>(`/api/ad-slots/${id}`);

export const createAdSlot = (data: CreateAdSlotData): Promise<AdSlot> =>
  api<AdSlot>('/api/ad-slots', { method: 'POST', body: JSON.stringify(data) });

// Placements
export const getPlacements = (): Promise<Placement[]> => 
  api<Placement[]>('/api/placements');

export const createPlacement = (data: CreatePlacementData): Promise<Placement> =>
  api<Placement>('/api/placements', { method: 'POST', body: JSON.stringify(data) });

// Dashboard
export const getStats = (): Promise<DashboardStats> => 
  api<DashboardStats>('/api/dashboard/stats');
