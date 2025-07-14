/**
 * Format game duration from seconds to a readable string
 * @param durationInSeconds - Game duration in seconds
 * @returns Formatted duration string (e.g., "25m 43s")
 */
export function formatGameDuration(durationInSeconds: number): string {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

/**
 * Format timestamp to relative time string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Relative time string (e.g., "2h ago", "3d ago")
 */
export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)}d ago`; // 30 days

  return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
}

/**
 * Format a number to a more readable string with K/M suffixes
 * @param num - The number to format
 * @returns Formatted number string (e.g., "1.5K", "2.3M")
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}
