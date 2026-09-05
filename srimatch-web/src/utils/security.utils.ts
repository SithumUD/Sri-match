import DOMPurify from 'dompurify';

/**
 * Security Utilities
 * Centralized logic for input sanitization and security checks.
 */

/**
 * Sanitizes an HTML string to prevent XSS attacks.
 * @param html - The raw HTML or text to sanitize.
 * @param options - DOMPurify configuration options.
 */
export const sanitize = (html: string, options: Record<string, any> = {}): string => {
    if (!html) return '';
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
        ALLOWED_ATTR: ['href', 'target', 'rel'],
        ...options
    });
};

/**
 * Strips all HTML tags from a string, leaving only plain text.
 * @param text - The raw text to strip.
 */
export const stripHtml = (text: string): string => {
    if (!text) return '';
    return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
};

/**
 * Validates if a string is a valid URL to prevent javascript: pseudo-protocol attacks.
 * @param url - The URL to validate.
 */
export const isValidUrl = (url: string): boolean => {
    if (!url) return false;
    try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
        return false;
    }
};
