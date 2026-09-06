package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.util.FileValidationUtil;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    @Autowired(required = false)
    private R2StorageService r2StorageService;

    public String uploadImage(MultipartFile file) throws IOException {
        if (r2StorageService != null && r2StorageService.isR2Active()) {
            return r2StorageService.uploadProfileImage(file);
        }
        byte[] sanitizedBytes = FileValidationUtil.validateAndSanitize(file, FileValidationUtil.FileCategory.PROFILE_IMAGE);
        Map uploadResult = cloudinary.uploader().upload(sanitizedBytes, ObjectUtils.emptyMap());
        return uploadResult.get("secure_url") != null ? uploadResult.get("secure_url").toString() : uploadResult.get("url").toString();
    }

    public String uploadChatMedia(MultipartFile file) throws IOException {
        if (r2StorageService != null && r2StorageService.isR2Active()) {
            return r2StorageService.uploadChatMedia(file);
        }
        byte[] sanitizedBytes = FileValidationUtil.validateAndSanitize(file, FileValidationUtil.FileCategory.CHAT_MEDIA);
        Map uploadResult = cloudinary.uploader().upload(sanitizedBytes, ObjectUtils.asMap("resource_type", "auto"));
        return uploadResult.get("secure_url") != null ? uploadResult.get("secure_url").toString() : uploadResult.get("url").toString();
    }

    public String uploadReceipt(MultipartFile file) throws IOException {
        if (r2StorageService != null && r2StorageService.isR2Active()) {
            return r2StorageService.uploadReceipt(file);
        }
        byte[] sanitizedBytes = FileValidationUtil.validateAndSanitize(file, FileValidationUtil.FileCategory.PAYMENT_RECEIPT);
        Map uploadResult = cloudinary.uploader().upload(sanitizedBytes, ObjectUtils.emptyMap());
        return uploadResult.get("secure_url") != null ? uploadResult.get("secure_url").toString() : uploadResult.get("url").toString();
    }

    public void deleteImage(String publicIdOrUrl) throws IOException {
        if (r2StorageService != null && r2StorageService.isR2Active()) {
            r2StorageService.deleteObject(publicIdOrUrl);
            return;
        }
        cloudinary.uploader().destroy(publicIdOrUrl, ObjectUtils.emptyMap());
    }
}
