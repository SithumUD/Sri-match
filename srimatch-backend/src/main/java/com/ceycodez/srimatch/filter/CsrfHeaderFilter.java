package com.ceycodez.srimatch.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * Filter to protect against CSRF by checking for a custom header.
 * Since we use HttpOnly cookies, malicious cross-site requests cannot include custom headers.
 * This is a simple and effective CSRF protection for SPAs.
 */
public class CsrfHeaderFilter extends OncePerRequestFilter {

    private static final List<String> STATE_CHANGING_METHODS = Arrays.asList("POST", "PUT", "DELETE", "PATCH");

    // Skip CSRF check for these paths (internal Spring error dispatches, auth, etc.)
    private static final List<String> EXCLUDED_PATHS = Arrays.asList(
            "/v1/auth/",
            "/error"
    );

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String method = request.getMethod();
        String path = request.getServletPath();

        // Skip check for excluded paths
        boolean excluded = EXCLUDED_PATHS.stream().anyMatch(path::startsWith);

        if (!excluded && STATE_CHANGING_METHODS.contains(method)) {
            String requestedWith = request.getHeader("X-Requested-With");

            // If the header is missing, reject with a proper JSON error response
            if (requestedWith == null || requestedWith.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"success\": false, \"message\": \"CSRF protection: X-Requested-With header is missing\"}");
                response.getWriter().flush();
                return; // Do NOT call filterChain — response is already committed
            }
        }

        filterChain.doFilter(request, response);
    }
}
