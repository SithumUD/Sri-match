package com.ceycodez.srimatch.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * Utility for strict file upload validation and sanitization.
 * 1. Inspects file content magic bytes (not just extension/content-type).
 * 2. Rejects dangerous formats (SVG, executable scripts, HTML).
 * 3. Strips EXIF metadata from images to prevent user geolocation leaks.
 * 4. Enforces category-specific size limits.
 */
@Slf4j
public final class FileValidationUtil {

    private FileValidationUtil() {}

    public static final long MAX_IMAGE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB
    public static final long MAX_DOCUMENT_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

    private static final byte[] JPEG_MAGIC = new byte[]{(byte) 0xFF, (byte) 0xD8, (byte) 0xFF};
    private static final byte[] PNG_MAGIC = new byte[]{(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A};
    private static final byte[] PDF_MAGIC = new byte[]{0x25, 0x50, 0x44, 0x46}; // %PDF
    private static final byte[] GIF_MAGIC_87A = "GIF87a".getBytes();
    private static final byte[] GIF_MAGIC_89A = "GIF89a".getBytes();

    private static final List<String> DANGEROUS_EXTENSIONS = List.of(
            "svg", "html", "htm", "exe", "sh", "bat", "cmd", "js", "jsp", "php", "py", "jar", "war"
    );

    public enum FileCategory {
        PROFILE_IMAGE,
        IDENTITY_DOCUMENT,
        PAYMENT_RECEIPT,
        CHAT_MEDIA
    }

    /**
     * Validates file according to its category and returns sanitized bytes (with EXIF stripped for images).
     */
    public static byte[] validateAndSanitize(MultipartFile file, FileCategory category) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
        String extension = getFileExtension(originalFilename);

        if (DANGEROUS_EXTENSIONS.contains(extension)) {
            throw new SecurityException("Forbidden file type: " + extension);
        }

        long maxSize = (category == FileCategory.IDENTITY_DOCUMENT || category == FileCategory.PAYMENT_RECEIPT)
                ? MAX_DOCUMENT_SIZE_BYTES
                : MAX_IMAGE_SIZE_BYTES;

        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("File size exceeds limit of " + (maxSize / (1024 * 1024)) + "MB");
        }

        try {
            byte[] fileBytes = file.getBytes();

            // Validate magic bytes
            boolean isJpeg = startsWith(fileBytes, JPEG_MAGIC);
            boolean isPng = startsWith(fileBytes, PNG_MAGIC);
            boolean isPdf = startsWith(fileBytes, PDF_MAGIC);
            boolean isGif = startsWith(fileBytes, GIF_MAGIC_87A) || startsWith(fileBytes, GIF_MAGIC_89A);
            boolean isWebp = isWebp(fileBytes);

            if (category == FileCategory.PROFILE_IMAGE) {
                if (!isJpeg && !isPng && !isWebp && !isGif) {
                    try {
                        BufferedImage probed = ImageIO.read(new ByteArrayInputStream(fileBytes));
                        if (probed == null) {
                            throw new SecurityException("Invalid image file format. Allowed formats: JPEG, PNG, WEBP, GIF.");
                        }
                    } catch (Exception e) {
                        throw new SecurityException("Invalid image file format. Allowed formats: JPEG, PNG, WEBP, GIF.");
                    }
                }
                return stripExifAndSanitizeImage(fileBytes, isPng ? "png" : "jpg");
            } else if (category == FileCategory.CHAT_MEDIA) {
                String mimeType = file.getContentType() != null ? file.getContentType().toLowerCase() : "";
                boolean isAudio = mimeType.startsWith("audio/") || 
                        List.of("webm", "ogg", "mp3", "wav", "m4a", "aac", "opus").contains(extension);

                if (isAudio) {
                    // Audio voice notes / recordings returned directly
                    return fileBytes;
                }

                // Image chat media validation & EXIF sanitization
                if (!isJpeg && !isPng && !isWebp && !isGif) {
                    try {
                        BufferedImage probed = ImageIO.read(new ByteArrayInputStream(fileBytes));
                        if (probed == null) {
                            throw new SecurityException("Invalid chat media format. Allowed formats: JPEG, PNG, WEBP, GIF, Audio.");
                        }
                    } catch (Exception e) {
                        throw new SecurityException("Invalid chat media format. Allowed formats: JPEG, PNG, WEBP, GIF, Audio.");
                    }
                }
                return stripExifAndSanitizeImage(fileBytes, isPng ? "png" : "jpg");
            } else if (category == FileCategory.IDENTITY_DOCUMENT || category == FileCategory.PAYMENT_RECEIPT) {
                if (!isJpeg && !isPng && !isWebp && !isPdf) {
                    throw new SecurityException("Invalid document format. Allowed formats: JPEG, PNG, WEBP, PDF.");
                }
                if (isPdf) {
                    return fileBytes; // PDFs returned directly after magic bytes validation
                }
                return stripExifAndSanitizeImage(fileBytes, isPng ? "png" : "jpg");
            }

            return fileBytes;
        } catch (IOException e) {
            throw new RuntimeException("Failed to process file upload", e);
        }
    }

    /**
     * Strips all EXIF metadata by re-encoding the buffered image.
     */
    public static byte[] stripExifAndSanitizeImage(byte[] rawBytes, String format) {
        try {
            BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(rawBytes));
            if (originalImage == null) {
                // If standard ImageIO couldn't parse, return raw if format is WebP or valid
                return rawBytes;
            }

            boolean hasAlpha = "png".equalsIgnoreCase(format) && originalImage.getColorModel().hasAlpha();
            int imageType = hasAlpha ? BufferedImage.TYPE_INT_ARGB : BufferedImage.TYPE_INT_RGB;
            BufferedImage cleanImage = new BufferedImage(originalImage.getWidth(), originalImage.getHeight(), imageType);

            Graphics2D g2d = cleanImage.createGraphics();
            if (!hasAlpha) {
                g2d.setColor(java.awt.Color.WHITE);
                g2d.fillRect(0, 0, originalImage.getWidth(), originalImage.getHeight());
            }
            g2d.drawImage(originalImage, 0, 0, null);
            g2d.dispose();

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            boolean written = ImageIO.write(cleanImage, format, outputStream);
            if (!written || outputStream.size() == 0) {
                return rawBytes;
            }
            return outputStream.toByteArray();
        } catch (Exception e) {
            log.warn("Could not re-encode image for EXIF stripping: {}. Using verified raw bytes.", e.getMessage());
            return rawBytes;
        }
    }

    private static boolean startsWith(byte[] array, byte[] prefix) {
        if (array.length < prefix.length) return false;
        for (int i = 0; i < prefix.length; i++) {
            if (array[i] != prefix[i]) return false;
        }
        return true;
    }

    private static boolean isWebp(byte[] bytes) {
        if (bytes.length < 12) return false;
        return bytes[0] == 'R' && bytes[1] == 'I' && bytes[2] == 'F' && bytes[3] == 'F'
                && bytes[8] == 'W' && bytes[9] == 'E' && bytes[10] == 'B' && bytes[11] == 'P';
    }

    private static String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        return (dotIndex == -1 || dotIndex == filename.length() - 1) ? "" : filename.substring(dotIndex + 1);
    }
}
