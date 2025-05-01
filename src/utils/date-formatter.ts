"use client";

/**
 * Format a date to a relative time string (e.g., "2 hours ago")
 * @param date - Date to format
 * @returns Formatted string
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  
  // Calculate time difference in milliseconds
  const timeDiff = now.getTime() - parsedDate.getTime();
  
  // Convert to seconds
  const secondsDiff = Math.floor(timeDiff / 1000);
  
  if (secondsDiff < 60) {
    return 'Just now';
  }
  
  // Convert to minutes
  const minutesDiff = Math.floor(secondsDiff / 60);
  
  if (minutesDiff < 60) {
    return minutesDiff === 1 ? '1 minute ago' : ${minutesDiff} minutes ago;
  }
  
  // Convert to hours
  const hoursDiff = Math.floor(minutesDiff / 60);
  
  if (hoursDiff < 24) {
    return hoursDiff === 1 ? '1 hour ago' : ${hoursDiff} hours ago;
  }
  
  // Convert to days
  const daysDiff = Math.floor(hoursDiff / 24);
  
  if (daysDiff < 7) {
    return daysDiff === 1 ? '1 day ago' : ${daysDiff} days ago;
  }
  
  // Convert to weeks
  const weeksDiff = Math.floor(daysDiff / 7);
  
  if (weeksDiff < 4) {
    return weeksDiff === 1 ? '1 week ago' : ${weeksDiff} weeks ago;
  }
  
  // Convert to months
  const monthsDiff = Math.floor(daysDiff / 30);
  
  if (monthsDiff < 12) {
    return monthsDiff === 1 ? '1 month ago' : ${monthsDiff} months ago;
  }
  
  // Convert to years
  const yearsDiff = Math.floor(daysDiff / 365);
  return yearsDiff === 1 ? '1 year ago' : ${yearsDiff} years ago;
}

/**
 * Format a date to a standard date string (e.g., "Apr 24, 2023")
 * @param date - Date to format
 * @returns Formatted string
 */
export function formatStandardDate(date: Date | string): string {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format a date to include time (e.g., "Apr 24, 2023 at 2:30 PM")
 * @param date - Date to format
 * @returns Formatted string
 */
export function formatDateWithTime(date: Date | string): string {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
}

/**
 * Get the timestamp for use in database/API
 * @returns ISO formatted date string
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}