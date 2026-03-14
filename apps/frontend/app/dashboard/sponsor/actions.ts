'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

interface ActionState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

async function getAuthHeaders() {
  const cookieStore = await cookies();
  return {
    'Content-Type': 'application/json',
    Cookie: cookieStore.toString(),
  };
}

export async function createCampaign(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const budget = formData.get('budget') as string;
    const cpmRate = formData.get('cpmRate') as string;
    const cpcRate = formData.get('cpcRate') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;

    // Validation
    const fieldErrors: Record<string, string> = {};
    if (!name || name.trim().length === 0) {
      fieldErrors.name = 'Name is required';
    }
    if (!budget || isNaN(Number(budget)) || Number(budget) <= 0) {
      fieldErrors.budget = 'Valid budget is required';
    }
    if (!startDate) {
      fieldErrors.startDate = 'Start date is required';
    }
    if (!endDate) {
      fieldErrors.endDate = 'End date is required';
    }
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      fieldErrors.endDate = 'End date must be after start date';
    }

    if (Object.keys(fieldErrors).length > 0) {
      return { fieldErrors };
    }

    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/campaigns`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: name.trim(),
        description: description?.trim() || null,
        budget: Number(budget),
        cpmRate: cpmRate ? Number(cpmRate) : null,
        cpcRate: cpcRate ? Number(cpcRate) : null,
        startDate,
        endDate,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.error || 'Failed to create campaign' };
    }

    revalidatePath('/dashboard/sponsor');
    return { success: true };
  } catch (error) {
    console.error('Error creating campaign:', error);
    return { error: 'Failed to create campaign' };
  }
}

export async function updateCampaign(
  id: string,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const budget = formData.get('budget') as string;
    const cpmRate = formData.get('cpmRate') as string;
    const cpcRate = formData.get('cpcRate') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const status = formData.get('status') as string;

    // Validation
    const fieldErrors: Record<string, string> = {};
    if (!name || name.trim().length === 0) {
      fieldErrors.name = 'Name is required';
    }
    if (!budget || isNaN(Number(budget)) || Number(budget) <= 0) {
      fieldErrors.budget = 'Valid budget is required';
    }
    if (!startDate) {
      fieldErrors.startDate = 'Start date is required';
    }
    if (!endDate) {
      fieldErrors.endDate = 'End date is required';
    }
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      fieldErrors.endDate = 'End date must be after start date';
    }

    if (Object.keys(fieldErrors).length > 0) {
      return { fieldErrors };
    }

    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/campaigns/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        name: name.trim(),
        description: description?.trim() || null,
        budget: Number(budget),
        cpmRate: cpmRate ? Number(cpmRate) : null,
        cpcRate: cpcRate ? Number(cpcRate) : null,
        startDate,
        endDate,
        status,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.error || 'Failed to update campaign' };
    }

    revalidatePath('/dashboard/sponsor');
    return { success: true };
  } catch (error) {
    console.error('Error updating campaign:', error);
    return { error: 'Failed to update campaign' };
  }
}

export async function deleteCampaign(id: string): Promise<ActionState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/campaigns/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.error || 'Failed to delete campaign' };
    }

    revalidatePath('/dashboard/sponsor');
    return { success: true };
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return { error: 'Failed to delete campaign' };
  }
}

export async function updateCampaignStatus(
  id: string,
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED'
): Promise<ActionState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/campaigns/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.error || 'Failed to update campaign status' };
    }

    revalidatePath('/dashboard/sponsor');
    return { success: true };
  } catch (error) {
    console.error('Error updating campaign status:', error);
    return { error: 'Failed to update campaign status' };
  }
}
