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

export async function createAdSlot(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const type = formData.get('type') as string;
    const basePrice = formData.get('basePrice') as string;

    // Validation
    const fieldErrors: Record<string, string> = {};
    if (!name || name.trim().length === 0) {
      fieldErrors.name = 'Name is required';
    }
    if (!type) {
      fieldErrors.type = 'Type is required';
    }
    if (!basePrice || isNaN(Number(basePrice)) || Number(basePrice) <= 0) {
      fieldErrors.basePrice = 'Valid price is required';
    }

    if (Object.keys(fieldErrors).length > 0) {
      return { fieldErrors };
    }

    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/ad-slots`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: name.trim(),
        description: description?.trim() || null,
        type,
        basePrice: Number(basePrice),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.error || 'Failed to create ad slot' };
    }

    revalidatePath('/dashboard/publisher');
    return { success: true };
  } catch (error) {
    console.error('Error creating ad slot:', error);
    return { error: 'Failed to create ad slot' };
  }
}

export async function updateAdSlot(
  id: string,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const type = formData.get('type') as string;
    const basePrice = formData.get('basePrice') as string;
    const isAvailable = formData.get('isAvailable') === 'true';

    // Validation
    const fieldErrors: Record<string, string> = {};
    if (!name || name.trim().length === 0) {
      fieldErrors.name = 'Name is required';
    }
    if (!type) {
      fieldErrors.type = 'Type is required';
    }
    if (!basePrice || isNaN(Number(basePrice)) || Number(basePrice) <= 0) {
      fieldErrors.basePrice = 'Valid price is required';
    }

    if (Object.keys(fieldErrors).length > 0) {
      return { fieldErrors };
    }

    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/ad-slots/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        name: name.trim(),
        description: description?.trim() || null,
        type,
        basePrice: Number(basePrice),
        isAvailable,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.error || 'Failed to update ad slot' };
    }

    revalidatePath('/dashboard/publisher');
    return { success: true };
  } catch (error) {
    console.error('Error updating ad slot:', error);
    return { error: 'Failed to update ad slot' };
  }
}

export async function deleteAdSlot(id: string): Promise<ActionState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/ad-slots/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.error || 'Failed to delete ad slot' };
    }

    revalidatePath('/dashboard/publisher');
    return { success: true };
  } catch (error) {
    console.error('Error deleting ad slot:', error);
    return { error: 'Failed to delete ad slot' };
  }
}

export async function toggleAdSlotAvailability(
  id: string,
  currentStatus: boolean
): Promise<ActionState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/ad-slots/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        isAvailable: !currentStatus,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.error || 'Failed to toggle availability' };
    }

    revalidatePath('/dashboard/publisher');
    return { success: true };
  } catch (error) {
    console.error('Error toggling availability:', error);
    return { error: 'Failed to toggle availability' };
  }
}
