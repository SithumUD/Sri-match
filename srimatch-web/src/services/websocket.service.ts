import { Client, StompSubscription, IMessage, IFrame } from '@stomp/stompjs';

class WebSocketService {
    private client: Client | null = null;
    private subscriptions: Map<string, StompSubscription> = new Map();

    connect(token?: string | null, onConnect?: (frame: IFrame) => void, onError?: (frame: IFrame) => void) {
        if (typeof window === 'undefined') return;
        if (this.client && this.client.connected) return;

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        const brokerURL = `${protocol}//${host}/ws-chat`;
        
        this.client = new Client({
            brokerURL: brokerURL,
            connectHeaders: {
                Authorization: token ? `Bearer ${token}` : '',
            },
            debug: (str: string) => {
                // console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        this.client.onConnect = (frame: IFrame) => {
            console.log('Connected to WebSocket');
            if (onConnect) onConnect(frame);
        };

        this.client.onStompError = (frame: IFrame) => {
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

    subscribe(destination: string, callback: (body: any) => void): StompSubscription | null {
        if (!this.client || !this.client.connected) {
            console.warn('Cannot subscribe, not connected');
            return null;
        }

        const subscription = this.client.subscribe(destination, (message: IMessage) => {
            try {
                callback(JSON.parse(message.body));
            } catch (e) {
                callback(message.body);
            }
        });

        this.subscriptions.set(destination, subscription);
        return subscription;
    }

    unsubscribe(destination: string) {
        const subscription = this.subscriptions.get(destination);
        if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(destination);
        }
    }

    sendMessage(destination: string, body: any) {
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
