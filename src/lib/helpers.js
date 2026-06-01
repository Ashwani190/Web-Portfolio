import { format, formatDistanceToNow } from 'date-fns';

/**
 * Generate a URL-friendly slug from a string
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

/**
 * Format a date string for display
 */
export const formatDate = (dateStr, pattern = 'MMM dd, yyyy') => {
  if (!dateStr) return '';
  try {
    return format(new Date(dateStr), pattern);
  } catch {
    return dateStr;
  }
};

/**
 * Get relative time (e.g., "3 days ago")
 */
export const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
};

/**
 * Truncate text to a specified length
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Get the public URL for a Supabase Storage file
 */
export const getStorageUrl = (bucket, path) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
};

/**
 * Estimate reading time for text content
 */
export const estimateReadingTime = (text) => {
  if (!text) return 1;
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

/**
 * Extract headings from markdown content for table of contents
 */
export const extractHeadings = (markdown) => {
  if (!markdown) return [];
  const headingRegex = /^(#{1,4})\s+(.+)$/gm;
  const headings = [];
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2].trim(),
      id: match[2].trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
    });
  }
  return headings;
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
