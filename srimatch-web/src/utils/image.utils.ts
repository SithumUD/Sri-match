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

/**
 * Compresses and normalizes an image file to standard JPEG using HTML5 Canvas.
 */
export const compressImage = (file: File, maxWidth = 1920, maxHeight = 1920, quality = 0.85): Promise<File> => {
    return new Promise((resolve, reject) => {
        if (!file || !file.type.startsWith('image/')) {
            return resolve(file);
        }

        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };
        reader.onerror = (err) => reject(err);

        img.onload = () => {
            let width = img.width;
            let height = img.height;

            if (width > maxWidth || height > maxHeight) {
                if (width / height > maxWidth / maxHeight) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                } else {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return resolve(file);
            }
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        return resolve(file);
                    }
                    const cleanName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
                    const compressedFile = new File([blob], cleanName, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });
                    resolve(compressedFile);
                },
                'image/jpeg',
                quality
            );
        };
        img.onerror = () => resolve(file);

        reader.readAsDataURL(file);
    });
};
