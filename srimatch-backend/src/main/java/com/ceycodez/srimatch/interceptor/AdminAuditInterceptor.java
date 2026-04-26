package com.ceycodez.srimatch.interceptor;

import com.ceycodez.srimatch.model.AuditLog;
import com.ceycodez.srimatch.repository.AuditLogRepository;
import com.ceycodez.srimatch.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminAuditInterceptor implements HandlerInterceptor {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        String path = request.getRequestURI();
        
        // Only audit admin endpoints
        if (!path.contains("/v1/admin/")) {
            return;
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return;
        }

        String email = auth.getName();
        String method = request.getMethod();
        int status = response.getStatus();

        // Skip successful GET requests for audit logs to avoid infinite recursion or bloat
        // but log failed ones
        if (method.equals("GET") && path.contains("/admin/audits") && status < 400) {
            return;
        }

        try {
            AuditLog auditLog = AuditLog.builder()
                    .userEmail(email)
                    .action(method + " " + path)
                    .requestMethod(method)
                    .requestUrl(path)
                    .statusCode(status)
                    .success(status < 400)
                    .ipAddress(request.getRemoteAddr())
                    .userAgent(request.getHeader("User-Agent"))
                    .details("Administrative action captured by interceptor")
                    .createdAt(LocalDateTime.now())
                    .build();

            // Try to find user ID if possible
            userRepository.findByEmail(email).ifPresent(user -> auditLog.setUserId(user.getId()));

            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            log.error("Failed to save audit log: {}", e.getMessage());
        }
    }
}
