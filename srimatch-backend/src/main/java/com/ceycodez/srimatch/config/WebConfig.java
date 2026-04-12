package com.ceycodez.srimatch.config;

import com.ceycodez.srimatch.interceptor.RateLimitInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final RateLimitInterceptor rateLimitInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(rateLimitInterceptor)
                .addPathPatterns("/v1/auth/login")
                .addPathPatterns("/v1/auth/register")
                .addPathPatterns("/v1/auth/resend-verification")
                .addPathPatterns("/v1/auth/forgot-password")
                .addPathPatterns("/v1/auth/reset-password");
    }
}
