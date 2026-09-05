/**
 * Image Utilities
 * Centralized logic for handling images and fallbacks.
 */

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop";

/**
 * Gets the optimized profile image URL or returns a default fallback.
 * @param url - The image URL from the backend.
 * @param options - Optional resizing parameters.
 */
export const getProfileImage = (url?: string | null, options: Record<string, any> = {}): string => {
    if (!url) return DEFAULT_AVATAR;

    // If it's already a full URL, data URL, or blob URL, return as-is
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) return url;

    // If it's a relative path from our backend, prepend the base URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    let finalUrl = `${baseUrl}${url}`;
    
    return finalUrl;
};

/**
 * Handles image loading errors by setting a fallback source.
 * Useful for <img> tags: <img onError={handleImageError} ... />
 */
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = DEFAULT_AVATAR;
};

import { compressImageClientSide } from './imageCompression.utils';

export { compressImageClientSide };

/**
 * Compresses and normalizes an image file to lightweight WebP using HTML5 Canvas.
 */
export const compressImage = async (
    file: File,
    maxWidth = 1280,
    maxHeight = 1600,
    quality = 0.82
): Promise<File> => {
    return compressImageClientSide(file, { maxWidth, maxHeight, quality, outputFormat: 'image/webp' });
};
