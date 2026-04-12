# Implementation Plan - Real-time Chat System

This plan details the implementation of a production-grade chat system for matched users in the SriMatch platform.

## User Review Required

> [!NOTE]
> **Performance**: We will use Spring Boot's WebSocket support with STOMP. For production scale, it is recommended to use an external message broker like RabbitMQ or Redis, but we will start with the built-in broker and configuration that allows easy migration.

## Proposed Changes

### 1. Core Models & Persistence

#### [MODIFY] [User.java](file:///d:/srimatch-main/srimatch/srimatch-backend/src/main/java/com/ceycodez/srimatch/model/User.java)
- Add `online` (boolean) and `lastSeenAt` (LocalDateTime) fields.

#### [MODIFY] [Message.java](file:///d:/srimatch-main/srimatch/srimatch-backend/src/main/java/com/ceycodez/srimatch/model/Message.java)
- Ensure `content` column is sufficient for text, emojis, and media metadata.

#### [NEW] [Migration Script](file:///d:/srimatch-main/srimatch/srimatch-backend/src/main/resources/db/migration/V16__add_chat_updates.sql)
- Add columns to `users` table.

---

### 2. WebSocket Infrastructure

#### [NEW] [WebSocketConfig.java](file:///d:/srimatch-main/srimatch/srimatch-backend/src/main/java/com/ceycodez/srimatch/config/WebSocketConfig.java)
- Enable WebSocket message handling with STOMP.
- Configure endpoints (e.g., `/ws-chat`).
- Configure message broker (destinations like `/topic`, `/queue`).

#### [NEW] [WebSocketAuthInterceptor.java](file:///d:/srimatch-main/srimatch/srimatch-backend/src/main/java/com/ceycodez/srimatch/config/WebSocketAuthInterceptor.java)
- Intercept WebSocket handshake to validate JWT tokens.
- Update User online status on `CONNECT` and `DISCONNECT`.

---

### 3. Services & Controllers

#### [NEW] [ChatService.java](file:///d:/srimatch-main/srimatch/srimatch-backend/src/main/java/com/ceycodez/srimatch/service/ChatService.java)
- `sendMessage(MessageRequest)`: Validates match, persistence, and WebSocket broadcast.
- `markAsRead(Long messageId)`: Updates status and notifies sender.
- `getChatHistory(Long matchId, Pageable)`: Paged history retrieval.
- `updateUserStatus(Long userId, boolean online)`: Logic for status tracking.

#### [NEW] [ChatController.java](file:///d:/srimatch-main/srimatch/srimatch-backend/src/main/java/com/ceycodez/srimatch/controller/ChatController.java)
- REST endpoints for:
    - GET `/api/v1/chat/history/{matchId}`
    - PATCH `/api/v1/chat/messages/{messageId}/read`

---

### 4. Media & Assets

#### [NEW] [ChatMediaController.java](file:///d:/srimatch-main/srimatch/srimatch-backend/src/main/controller/ChatMediaController.java)
- Secure endpoint for uploading chat media (images/videos) to Cloudinary.
- Returns the URL to be included in the encrypted message payload.

## Open Questions

1. **Stickers & Emojis**: Will these be custom SriMatch stickers (stored on server) or standard emojis (Unicode)? Emojis in text are handled naturally.(use best way and methods for better production use)
2. **Notification Integration**: Should we send Push Notifications (Firebase/OneSignal) when a user receives a message while offline?(use firebase to it)

## Verification Plan

### Automated Tests
- Integration tests for `ChatService` to ensure messages are saved and linked to matches.
- Security tests to ensure only matched users can fetch each other's history/keys.

### Manual Verification
- Use a WebSocket test client (like Postman or a custom HTML/JS test page) to:
    1. Connect with JWT.
    2. Send a dummy encrypted message.
    3. Verify receipt on a second connected client.
    4. Verify DB persistence.
