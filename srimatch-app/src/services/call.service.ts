import API from './api';

export interface CallSignalPayload {
  receiverId: number | string;
  signalType: 'OFFER' | 'ANSWER' | 'CANDIDATE' | 'REJECT' | 'END' | 'BUSY' | 'RINGING';
  callType?: 'VOICE' | 'VIDEO';
  sdp?: any;
  candidate?: any;
  reason?: string;
}

export const CallService = {
  /**
   * Relay WebRTC call signaling payload through backend
   */
  sendSignal: (payload: CallSignalPayload) => {
    return API.post('/chat/call/signal', {
      ...payload,
      receiverId: Number(payload.receiverId),
    });
  },
};

export default CallService;
