package com.ceycodez.srimatch.config;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;

import java.net.URI;

@Configuration
@Getter
@Slf4j
public class CloudflareR2Config {

    @Value("${cloudflare.r2.enabled:false}")
    private boolean enabled;

    @Value("${cloudflare.r2.account-id:}")
    private String accountId;

    @Value("${cloudflare.r2.access-key-id:}")
    private String accessKeyId;

    @Value("${cloudflare.r2.secret-access-key:}")
    private String secretAccessKey;

    @Value("${cloudflare.r2.bucket-name:srimatch-media}")
    private String bucketName;

    @Value("${cloudflare.r2.public-domain:https://media.srimatch.lk}")
    private String publicDomain;

    @Bean
    @ConditionalOnProperty(name = "cloudflare.r2.enabled", havingValue = "true")
    public S3Client r2S3Client() {
        if (accountId == null || accountId.isBlank() || accessKeyId == null || accessKeyId.isBlank()) {
            log.warn("Cloudflare R2 is enabled but account-id or access-key-id is missing. Falling back to default S3 client.");
        }

        String endpoint = "https://" + accountId.trim() + ".r2.cloudflarestorage.com";
        log.info("Initializing Cloudflare R2 S3 Client for endpoint: {}", endpoint);

        return S3Client.builder()
                .endpointOverride(URI.create(endpoint))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKeyId.trim(), secretAccessKey.trim())
                ))
                .region(Region.of("auto"))
                .serviceConfiguration(S3Configuration.builder()
                        .pathStyleAccessEnabled(true)
                        .build())
                .build();
    }
}
