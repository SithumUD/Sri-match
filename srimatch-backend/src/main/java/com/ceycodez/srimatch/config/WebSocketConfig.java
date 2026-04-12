package com.ceycodez.srimatch.config;

import com.ceycodez.srimatch.interceptor.WebSocketAuthInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final WebSocketAuthInterceptor webSocketAuthInterceptor;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple memory-based message broker
        // /topic: for broadcasting (e.g. notifications)
        // /queue: for peer-to-peer (user-specific messages)
        config.enableSimpleBroker("/topic", "/queue");
        
        // /app: prefix for messages that are bound for methods annotated with @MessageMapping
        config.setApplicationDestinationPrefixes("/app");
        
        // /user: prefix for user-specific messaging (automatically handled by Spring)
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Main endpoint for WebSocket connection
        registry.addEndpoint("/ws-chat")
                .setAllowedOrigins("http://localhost:3000", "http://localhost:5173") // match SecurityConfig CORS
                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // Intercept connection and messages to check JWT
        registration.interceptors(webSocketAuthInterceptor);
    }
}
