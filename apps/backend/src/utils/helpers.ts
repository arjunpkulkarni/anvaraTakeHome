// Utility helpers for the API

// Helper to safely extract route/query params
export function getParam(param: unknown): string {
  if (typeof param === 'string') return param;
  if (Array.isArray(param) && typeof param[0] === 'string') return param[0];
  return '';
}

// Helper to format currency values
export function formatCurrency(amount: number, currency = 'USD'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  });
  return formatter.format(amount);
}

// Helper to calculate percentage change
export function calculatePercentChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

// Parse pagination params from query
interface PaginationQuery {
  page?: string | number;
  limit?: string | number;
}

interface PaginationResult {
  page: number;
  limit: number;
  skip: number;
}

export function parsePagination(query: PaginationQuery): PaginationResult {
  const page = parseInt(String(query.page || 1)) || 1;
  const limit = parseInt(String(query.limit || 10)) || 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper to build filter object from query params
export const buildFilters = (
  query: Record<string, unknown>,
  allowedFields: string[]
): Record<string, unknown> => {
  const filters: Record<string, unknown> = {};

  for (const field of allowedFields) {
    if (query[field] !== undefined) {
      filters[field] = query[field];
    }
  }

  return filters;
};

// Clamp a value between min and max
export function clampValue(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

// Format date to localized string
export function formatDate(date: Date | string | number): string {
  const dateObject = new Date(date);

  // Check if date is valid
  if (isNaN(dateObject.getTime())) {
    return 'Invalid Date';
  }

  return dateObject.toLocaleDateString();
}
