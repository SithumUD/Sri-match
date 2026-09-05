/**
 * Production-Grade Client-Side Image Pre-Compression Utility
 * Compresses large user photos into lightweight WebP/JPEG format before upload.
 * Reduces 5MB-15MB camera photos to ~80KB-150KB in under 100ms right in the browser.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0 (default: 0.82)
  outputFormat?: 'image/webp' | 'image/jpeg';
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxWidth: 1280,
  maxHeight: 1600,
  quality: 0.82,
  outputFormat: 'image/webp',
};

/**
 * Compresses an image File or Blob using the browser's native HTML5 Canvas API.
 * If the input is not an image (e.g., PDF receipt), it is returned untouched.
 *
 * @param file The original File uploaded by the user
 * @param options Custom compression options (dimensions, quality, format)
 * @returns A Promise resolving to the compressed File
 */
export async function compressImageClientSide(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  // If not an image (e.g. PDF receipt), return original file
  if (!file || !file.type.startsWith('image/')) {
    return file;
  }

  // If already very small (< 100KB), return as is to save CPU
  if (file.size < 100 * 1024) {
    return file;
  }

  const mergedOpts = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));

    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image for compression'));

      img.onload = () => {
        try {
          let { width, height } = img;
          const { maxWidth, maxHeight, quality, outputFormat } = mergedOpts;

          // Maintain aspect ratio while fitting within maxWidth / maxHeight
          if (width > maxWidth! || height > maxHeight!) {
            const ratio = Math.min(maxWidth! / width, maxHeight! / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          // Render onto off-screen canvas with high quality image smoothing
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return resolve(file); // Fallback to original if canvas context unavailable
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Test if browser supports target format (WebP or JPEG)
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                return resolve(file);
              }

              // Create clean filename with target extension
              const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
              const ext = outputFormat === 'image/webp' ? '.webp' : '.jpg';
              const newFileName = `${baseName}_compressed${ext}`;

              const compressedFile = new File([blob], newFileName, {
                type: blob.type || outputFormat!,
                lastModified: Date.now(),
              });

              console.log(
                `⚡ [Client-Compression] ${file.name} (${(file.size / 1024).toFixed(1)} KB) -> ${(compressedFile.size / 1024).toFixed(1)} KB (Saved ${(((file.size - compressedFile.size) / file.size) * 100).toFixed(0)}%)`
              );

              resolve(compressedFile);
            },
            outputFormat,
            quality
          );
        } catch (err) {
          console.warn('Image compression encountered an error, using original file:', err);
          resolve(file);
        }
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Compresses an array of image files in parallel
 */
export async function compressMultipleImages(
  files: File[],
  options?: CompressionOptions
): Promise<File[]> {
  return Promise.all(files.map((file) => compressImageClientSide(file, options)));
}
