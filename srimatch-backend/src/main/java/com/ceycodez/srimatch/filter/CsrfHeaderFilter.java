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

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String method = request.getMethod();

        if (STATE_CHANGING_METHODS.contains(method)) {
            String requestedWith = request.getHeader("X-Requested-With");
            
            // If the header is missing, block the request
            if (requestedWith == null || requestedWith.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write("{\"success\": false, \"message\": \"CSRF protection: X-Requested-With header is missing\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
