package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/v1/chat/media")
@RequiredArgsConstructor
@Slf4j
public class ChatMediaController {

    private final CloudinaryService cloudinaryService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadMedia(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        try {
            String url = cloudinaryService.uploadChatMedia(file);
            
            Map<String, Object> data = new HashMap<>();
            data.put("url", url);
            data.put("mediaType", file.getContentType());
            data.put("size", file.getSize());
            
            return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                    .success(true)
                    .message("Media uploaded successfully")
                    .data(data)
                    .build());
        } catch (IOException e) {
            log.error("Failed to upload chat media", e);
            return ResponseEntity.status(500).body(ApiResponse.<Map<String, Object>>builder()
                    .success(false)
                    .message("Failed to upload media: " + e.getMessage())
                    .data(null)
                    .build());
        }
    }
}
