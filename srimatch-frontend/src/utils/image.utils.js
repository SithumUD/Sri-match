/**
 * Image Utilities
 * Centralized logic for handling images and fallbacks.
 */

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop";

/**
 * Gets the optimized profile image URL or returns a default fallback.
 * @param {string} url - The image URL from the backend.
 * @param {object} options - Optional resizing parameters.
 */
export const getProfileImage = (url, options = {}) => {
    if (!url) return DEFAULT_AVATAR;

    // If it's already a full URL (like from Google Auth or Unsplash), return it
    if (url.startsWith('http')) return url;

    // If it's a relative path from our backend, prepend the base URL
    // In production, we might want to append resizing params if using an image proxy
    const baseUrl = import.meta.env.VITE_API_URL || '';
    let finalUrl = `${baseUrl}${url}`;

    // Example of adding resizing params if using a service like Cloudinary or Imgix
    // if (options.width) finalUrl += `?w=${options.width}`;
    
    return finalUrl;
};

/**
 * Handles image loading errors by setting a fallback source.
 * Useful for <img> tags: <img onError={handleImageError} ... />
 */
export const handleImageError = (e) => {
    e.target.src = DEFAULT_AVATAR;
};
