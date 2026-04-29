import DOMPurify from 'dompurify';

/**
 * Security Utilities
 * Centralized logic for input sanitization and security checks.
 */

/**
 * Sanitizes an HTML string to prevent XSS attacks.
 * @param {string} html - The raw HTML or text to sanitize.
 * @param {object} options - DOMPurify configuration options.
 */
export const sanitize = (html, options = {}) => {
    if (!html) return '';
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
        ALLOWED_ATTR: ['href', 'target', 'rel'],
        ...options
    });
};

/**
 * Strips all HTML tags from a string, leaving only plain text.
 * @param {string} text - The raw text to strip.
 */
export const stripHtml = (text) => {
    if (!text) return '';
    return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
};

/**
 * Validates if a string is a valid URL to prevent javascript: pseudo-protocol attacks.
 * @param {string} url - The URL to validate.
 */
export const isValidUrl = (url) => {
    if (!url) return false;
    try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
        return false;
    }
};
