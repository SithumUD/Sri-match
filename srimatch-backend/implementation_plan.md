# Implementation Plan - HttpOnly Cookie-Based Authentication

Implement HttpOnly cookie-based authentication for the SriMatch platform to protect against XSS attacks and improve overall security.

## User Review Required

> [!IMPORTANT]
> **CSRF Protection**: Moving to cookies makes the application vulnerable to CSRF. I am proposing a custom header check (`X-Requested-With`) for all state-changing requests (POST, PUT, DELETE, PATCH). Since XSS is blocked by `HttpOnly` cookies, a malicious site cannot set custom headers for a cross-site request.
> 
> **Breaking Change**: The frontend will no longer receive tokens in the response body. It must be updated to use `withCredentials: true` in Axios/Fetch and include the `X-Requested-With: XMLHttpRequest` header.

## Proposed Changes

### 1. Authentication Core

#### [MODIFY] [JwtService.java](file:///c:/Users/sithum/Documents/GitHub/ape-iskole-backend/srimatch-backend/src/main/java/com/ceycodez/srimatch/service/JwtService.java)
- Ensure cookie attributes match: `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`.
- Add `createEmptyCookie` for logout/token clearing.

#### [MODIFY] [JwtAuthenticationFilter.java](file:///c:/Users/sithum/Documents/GitHub/ape-iskole-backend/srimatch-backend/src/main/java/com/ceycodez/srimatch/filter/JwtAuthenticationFilter.java)
- Update to extract the JWT from the `accessToken` cookie.
- Retain `Authorization: Bearer <token>` support for API-only clients if necessary, but prioritize cookies.

---

### 2. Web & Security Configuration

#### [MODIFY] [SecurityConfig.java](file:///c:/Users/sithum/Documents/GitHub/ape-iskole-backend/srimatch-backend/src/main/java/com/ceycodez/srimatch/config/SecurityConfig.java)
- Implement a custom CSRF filter or configure Spring Security's CSRF to expect a custom header for SPAs.
- Ensure CORS `allowCredentials` is `true` and origins are explicitly listed.

---

### 3. API Endpoints

#### [MODIFY] [AuthenticationController.java](file:///c:/Users/sithum/Documents/GitHub/ape-iskole-backend/srimatch-backend/src/main/java/com/ceycodez/srimatch/controller/AuthenticationController.java)
- **Fix Corruption**: Restore the file content from git history.
- **Set Cookies**: Update `login`, `socialLogin`, and `refreshToken` to add `accessToken` and `refreshToken` cookies to the `HttpServletResponse`.
- **Clear Cookies**: Update `logout` to send empty cookies with `Max-Age=0`.
- **Response Body**: Ensure tokens are not serialized (handled by `@JsonIgnore` in `AuthResponse`).

---

## Verification Plan

### Automated Tests
- **Cookie Presence**: Assert that `Set-Cookie` headers for `accessToken` and `refreshToken` are present on successful login.
- **Authentication**: Verify that protected endpoints (e.g., `/v1/users/me`) return `200 OK` when a valid `accessToken` cookie is provided.
- **CSRF Protection**: Verify that POST requests without the `X-Requested-With` header are rejected.
- **Logout**: Verify that cookies are cleared on logout.

### Manual Verification
- Use Browser DevTools or Postman to:
    1. Log in and check the "Cookies" tab.
    2. Confirm `HttpOnly` and `Secure` flags are set.
    3. Confirm tokens are NOT in the JSON response body.
    4. Test a POST request with the cookie but without the custom header to ensure it fails.
