package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.dto.request.MessageRequest;
import com.ceycodez.srimatch.dto.response.MessageResponse;
import com.ceycodez.srimatch.model.Match;
import com.ceycodez.srimatch.model.Message;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.enums.MessageStatus;
import com.ceycodez.srimatch.model.enums.NotificationType;
import com.ceycodez.srimatch.repository.MatchRepository;
import com.ceycodez.srimatch.repository.MessageRepository;
import com.ceycodez.srimatch.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final MessageRepository messageRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;

    @Transactional
    public MessageResponse sendMessage(User sender, MessageRequest request) {
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Match match = null;
        if (request.getMatchId() != null) {
            match = matchRepository.findById(request.getMatchId())
                    .orElseThrow(() -> new RuntimeException("Match not found"));
            
            if (!match.canSendMessage(sender)) {
                throw new RuntimeException("You are not authorized to send messages in this match");
            }
        } else {
            // Check if sender is premium for direct messages
            if (!sender.isPremiumActive()) {
                throw new RuntimeException("Premium subscription required for direct messages");
            }
        }

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .match(match)
                .content(request.getContent())
                .type(request.getType())
                .mediaUrl(request.getMediaUrl())
                .mediaType(request.getMediaType())
                .mediaSize(request.getMediaSize())
                .status(MessageStatus.SENT)
                .build();

        message = messageRepository.save(message);

        MessageResponse response = mapToResponse(message);

        // Send via WebSocket
        messagingTemplate.convertAndSendToUser(
                receiver.getEmail(),
                "/queue/messages",
                response
        );

        // Notify receiver if offline
        if (!receiver.isOnline()) {
            notificationService.createNotification(
                    receiver,
                    "New Message from " + sender.getFullName(),
                    request.getContent(),
                    NotificationType.NEW_MESSAGE,
                    message.getId(),
                    "MESSAGE"
            );
        }

        return response;
    }

    public Page<MessageResponse> getChatHistory(User user, Long matchId, Pageable pageable) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        if (!match.canSendMessage(user)) {
            throw new RuntimeException("You are not authorized to view this chat history");
        }

        return messageRepository.findByMatchOrderByCreatedAtDesc(match, pageable)
                .map(this::mapToResponse);
    }

    @Transactional
    public void markAsRead(Long messageId, User user) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        if (!message.getReceiver().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        message.setRead(true);
        message.setReadAt(LocalDateTime.now());
        message.setStatus(MessageStatus.READ);
        messageRepository.save(message);

        // Notify sender that message was read
        messagingTemplate.convertAndSendToUser(
                message.getSender().getEmail(),
                "/queue/message-status",
                mapToResponse(message)
        );
    }

    private MessageResponse mapToResponse(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .matchId(message.getMatch() != null ? message.getMatch().getId() : null)
                .senderId(message.getSender().getId())
                .receiverId(message.getReceiver().getId())
                .content(message.getContent())
                .type(message.getType())
                .status(message.getStatus())
                .read(message.isRead())
                .readAt(message.getReadAt())
                .delivered(message.isDelivered())
                .deliveredAt(message.getDeliveredAt())
                .mediaUrl(message.getMediaUrl())
                .mediaType(message.getMediaType())
                .mediaSize(message.getMediaSize())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
