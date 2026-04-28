# Backend Security Requirements: HttpOnly Cookie-Based Authentication

To improve the security of the SriMatch platform and protect against XSS attacks, we are moving from local storage/standard cookie authentication to **HttpOnly Cookie-based Authentication**.

## 1. Authentication Cookies
The backend must be updated to send the `accessToken` and `refreshToken` as cookies instead of including them in the JSON response body.

### Login & Refresh Token Endpoints
When a user logs in or refreshes their token, the response should include:
- `Set-Cookie: accessToken=...; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=...`
- `Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=...`

**Attributes Explained:**
- **HttpOnly**: Prevents JavaScript from accessing the cookie (blocks XSS).
- **Secure**: Only sends the cookie over HTTPS.
- **SameSite=Lax**: Protects against CSRF while allowing navigation from external sites.
- **Path=/**: Makes the cookie available for all API routes.

### Logout Endpoint
The logout endpoint must clear these cookies by sending:
- `Set-Cookie: accessToken=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`
- `Set-Cookie: refreshToken=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`

## 2. CORS Configuration
Since we are using `withCredentials: true` on the frontend, the backend CORS policy must be updated:
- `allowCredentials` must be `true`.
- `allowedOrigins` must be explicitly listed (e.g., `http://localhost:5173`). Wildcards (`*`) are **not allowed** when `allowCredentials` is true.

## 3. CSRF Protection
With cookies, we are now vulnerable to CSRF. We should implement **Double Submit Cookie** protection or use a custom header.

### Recommendation: Custom Header (Simpler for SPAs)
The backend should check for a custom header (e.g., `X-Requested-With` or `X-CSRF-TOKEN`) on all state-changing requests (POST, PUT, DELETE). Since XSS is blocked by `HttpOnly`, a malicious site cannot set custom headers for a cross-site request.

## 4. Response Body Changes
The response body for `/auth/login` and `/auth/refresh-token` should no longer include the tokens. It should only include user metadata.

```json
{
  "success": true,
  "data": {
    "id": 123,
    "email": "user@example.com",
    "role": "USER",
    ...
  }
}
```
