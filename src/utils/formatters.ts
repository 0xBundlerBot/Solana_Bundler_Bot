// Utility functions for formatting data

export const formatNumber = (
  value: number,
  options: {
    decimals?: number;
    compact?: boolean;
    currency?: boolean;
    percentage?: boolean;
  } = {}
): string => {
  const { decimals = 2, compact = false, currency = false, percentage = false } = options;

  if (percentage) {
    return `${(value * 100).toFixed(decimals)}%`;
  }

  if (compact && Math.abs(value) >= 1000) {
    const units = ['', 'K', 'M', 'B', 'T'];
    const unitIndex = Math.floor(Math.log10(Math.abs(value)) / 3);
    const scaledValue = value / Math.pow(1000, unitIndex);
    return `${currency ? '$' : ''}${scaledValue.toFixed(decimals)}${units[unitIndex]}`;
  }

  const formatted = value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return currency ? `$${formatted}` : formatted;
};

export const formatTokenAmount = (
  amount: number,
  decimals: number = 9,
  displayDecimals: number = 4
): string => {
  const actualAmount = amount / Math.pow(10, decimals);
  return formatNumber(actualAmount, { decimals: displayDecimals });
};

export const formatAddress = (
  address: string,
  startChars: number = 4,
  endChars: number = 4
): string => {
  if (!address || address.length <= startChars + endChars) {
    return address;
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

export const formatPriceChange = (change: number): {
  formatted: string;
  isPositive: boolean;
  isNegative: boolean;
} => {
  const isPositive = change > 0;
  const isNegative = change < 0;
  const formatted = `${isPositive ? '+' : ''}${formatNumber(change, { percentage: true })}`;

  return { formatted, isPositive, isNegative };
};

export const sanitizeInput = (input: string): string => {
  return input.replace(/[<>\"'&]/g, '');
};

export const validateSolanaAddress = (address: string): boolean => {
  try {
    // Basic validation for Solana address format
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  } catch {
    return false;
  }
};
