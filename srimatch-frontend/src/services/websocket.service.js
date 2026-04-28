import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    constructor() {
        this.client = null;
        this.subscriptions = new Map();
    }

    connect(token, onConnect, onError) {
        if (this.client && this.client.connected) return;

        const socketUrl = '/ws-chat';
        
        this.client = new Client({
            webSocketFactory: () => new SockJS(socketUrl),
            connectHeaders: {
                Authorization: token ? `Bearer ${token}` : '',
            },
            debug: (str) => {
                // console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        this.client.onConnect = (frame) => {
            console.log('Connected to WebSocket');
            if (onConnect) onConnect(frame);
        };

        this.client.onStompError = (frame) => {
            console.error('STOMP error', frame);
            if (onError) onError(frame);
        };

        this.client.activate();
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.subscriptions.clear();
        }
    }

    subscribe(destination, callback) {
        if (!this.client || !this.client.connected) {
            console.warn('Cannot subscribe, not connected');
            return null;
        }

        const subscription = this.client.subscribe(destination, (message) => {
            callback(JSON.parse(message.body));
        });

        this.subscriptions.set(destination, subscription);
        return subscription;
    }

    unsubscribe(destination) {
        const subscription = this.subscriptions.get(destination);
        if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(destination);
        }
    }

    sendMessage(destination, body) {
        if (this.client && this.client.connected) {
            this.client.publish({
                destination,
                body: JSON.stringify(body),
            });
        } else {
            console.error('Cannot send message, not connected');
        }
    }
}

const wsService = new WebSocketService();
export default wsService;
