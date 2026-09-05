package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.config.CloudflareR2Config;
import com.ceycodez.srimatch.util.FileValidationUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class R2StorageService {

    private final CloudflareR2Config r2Config;

    @Autowired(required = false)
    private S3Client r2S3Client;

    public boolean isR2Active() {
        return r2Config.isEnabled() && r2S3Client != null;
    }

    public String uploadProfileImage(MultipartFile file) throws IOException {
        byte[] sanitizedBytes = FileValidationUtil.validateAndSanitize(file, FileValidationUtil.FileCategory.PROFILE_IMAGE);
        String extension = getFileExtension(file.getOriginalFilename(), "webp");
        String key = "profiles/" + UUID.randomUUID() + "." + extension;
        String contentType = file.getContentType() != null ? file.getContentType() : "image/webp";

        return putObject(key, sanitizedBytes, contentType);
    }

    public String uploadChatMedia(MultipartFile file) throws IOException {
        byte[] sanitizedBytes = FileValidationUtil.validateAndSanitize(file, FileValidationUtil.FileCategory.CHAT_MEDIA);
        String extension = getFileExtension(file.getOriginalFilename(), "webp");
        String key = "chat/" + UUID.randomUUID() + "." + extension;
        String contentType = file.getContentType() != null ? file.getContentType() : "image/webp";

        return putObject(key, sanitizedBytes, contentType);
    }

    public String uploadReceipt(MultipartFile file) throws IOException {
        byte[] sanitizedBytes = FileValidationUtil.validateAndSanitize(file, FileValidationUtil.FileCategory.PAYMENT_RECEIPT);
        String extension = getFileExtension(file.getOriginalFilename(), "jpg");
        String key = "receipts/" + UUID.randomUUID() + "." + extension;
        String contentType = file.getContentType() != null ? file.getContentType() : "image/jpeg";

        return putObject(key, sanitizedBytes, contentType);
    }

    public void deleteObject(String keyOrUrl) {
        if (!isR2Active()) {
            return;
        }

        String key = extractKey(keyOrUrl);
        try {
            DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                    .bucket(r2Config.getBucketName())
                    .key(key)
                    .build();
            r2S3Client.deleteObject(deleteRequest);
            log.info("Deleted object from Cloudflare R2: {}", key);
        } catch (Exception e) {
            log.error("Failed to delete object from Cloudflare R2: {}", key, e);
        }
    }

    private String putObject(String key, byte[] bytes, String contentType) {
        if (!isR2Active()) {
            throw new IllegalStateException("Cloudflare R2 is not configured or enabled");
        }

        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(r2Config.getBucketName())
                .key(key)
                .contentType(contentType)
                .build();

        r2S3Client.putObject(putRequest, RequestBody.fromBytes(bytes));
        log.info("Successfully uploaded object to Cloudflare R2: {}", key);

        String domain = r2Config.getPublicDomain().replaceAll("/+$", "");
        return domain + "/" + key;
    }

    private String extractKey(String keyOrUrl) {
        if (keyOrUrl == null) return "";
        if (!keyOrUrl.startsWith("http://") && !keyOrUrl.startsWith("https://")) {
            return keyOrUrl;
        }
        String domain = r2Config.getPublicDomain().replaceAll("/+$", "");
        if (keyOrUrl.startsWith(domain)) {
            return keyOrUrl.substring(domain.length()).replaceAll("^/+", "");
        }
        int lastSlash = keyOrUrl.lastIndexOf("/");
        return lastSlash >= 0 ? keyOrUrl.substring(lastSlash + 1) : keyOrUrl;
    }

    private String getFileExtension(String filename, String fallback) {
        if (filename == null || !filename.contains(".")) {
            return fallback;
        }
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }
}
