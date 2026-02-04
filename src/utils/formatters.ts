// Currency formatter for Indian Rupees
export function formatCurrency(value: number | null): string {
  if (value === null || value === undefined) return '—';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Format large numbers with Indian numbering system (lakhs, crores)
export function formatIndianNumber(value: number | null): string {
  if (value === null || value === undefined) return '—';

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 10000000) {
    return `${sign}${(absValue / 10000000).toFixed(2)} Cr`;
  } else if (absValue >= 100000) {
    return `${sign}${(absValue / 100000).toFixed(2)} L`;
  } else {
    return formatCurrency(value);
  }
}

// Format percentage
export function formatPercentage(value: number | null): string {
  if (value === null || value === undefined) return '—';

  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

// Format number with commas (Indian style)
export function formatNumber(value: number | null, decimals: number = 2): string {
  if (value === null || value === undefined) return '—';

  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

// Format date and time
export function formatDateTime(date: Date | null): string {
  if (!date) return '—';

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(date);
}

// Format time only
export function formatTime(date: Date | null): string {
  if (!date) return '—';

  return new Intl.DateTimeFormat('en-IN', {
    timeStyle: 'medium',
  }).format(date);
}
