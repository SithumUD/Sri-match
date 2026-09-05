import API from './api';

export const LikeService = {
  sendLike: (receiverId: number | string, type: 'NORMAL' | 'STAR' | 'SUPER' = 'NORMAL') => {
    return API.post('/likes/send', { receiverId: Number(receiverId), type });
  },

  getSentLikes: (page = 0, size = 50) => {
    return API.get('/likes/sent', { params: { page, size } });
  },

  getReceivedLikes: (page = 0, size = 50, type: string | null = null) => {
    return API.get('/likes/received', { params: { page, size, type } });
  },

  getLikeQuota: () => {
    return API.get('/likes/quota');
  },

  checkInteraction: (targetProfileId: number | string) => {
    return API.get(`/likes/check/${targetProfileId}`);
  },
};

export const ConnectionService = {
  getMatches: (page = 0, size = 50) => {
    return API.get('/matches', { params: { page, size } });
  },

  getOverview: (limit = 50) => {
    return API.get('/connections/overview', { params: { limit } });
  },

  respondToConnection: (connectionId: number | string, action: 'ACCEPT' | 'REJECT' | 'CANCEL') => {
    return API.post(`/connections/${connectionId}/respond`, { action });
  },
};

export const ChatService = {
  getConversations: (page = 0, size = 30) => {
    return API.get('/matches', { params: { page, size } });
  },

  getMessages: (matchId: number | string, page = 0, size = 50) => {
    return API.get(`/chat/history/${matchId}`, { params: { page, size } });
  },

  sendMessage: (matchId: number | string, content: string) => {
    return API.post('/chat/send', { matchId: Number(matchId), content });
  },

  markAsRead: (messageId: number | string) => {
    return API.patch(`/chat/messages/${messageId}/read`);
  },

  uploadMedia: (formData: FormData) => {
    return API.post('/chat/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const SubscriptionService = {
  getOverview: () => {
    return API.get('/subscriptions/overview');
  },

  getPackages: () => {
    return API.get('/packages');
  },

  getMySubscriptions: () => {
    return API.get('/subscriptions/my');
  },

  initiateSubscription: (packageId: number | string) => {
    return API.post(`/subscriptions/initiate/${packageId}`);
  },

  submitPaymentSlip: async (subIdOrFormData: any, maybeFormData?: FormData) => {
    let subscriptionId = subIdOrFormData;
    let formData = maybeFormData;

    if (subIdOrFormData instanceof FormData) {
      formData = subIdOrFormData;
      const parts = (formData as any)._parts;
      const pkgPart = Array.isArray(parts) ? parts.find(([k]: any) => k === 'packageId') : null;
      const packageId = pkgPart ? pkgPart[1] : null;

      if (packageId) {
        try {
          const initRes: any = await API.post(`/subscriptions/initiate/${packageId}`);
          subscriptionId = initRes?.data?.id || initRes?.id || packageId;
        } catch (e) {
          subscriptionId = packageId;
        }
      } else {
        subscriptionId = 1;
      }
    }

    if (formData) {
      const parts = (formData as any)._parts;
      if (Array.isArray(parts)) {
        const hasReceipt = parts.some(([k]: any) => k === 'receipt');
        if (!hasReceipt) {
          const slipPart = parts.find(([k]: any) => k === 'slipImage');
          if (slipPart) {
            formData.append('receipt', slipPart[1]);
          }
        }
      }
    }

    return API.post(`/payments/submit-receipt/${subscriptionId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  boostProfile: (packageId?: number | string) => {
    return API.post('/boost/activate');
  },

  getBoostStatus: () => {
    return API.get('/boost/status');
  },

  getBoostPackages: () => {
    return API.get('/boost/packages');
  },
};

export const BoostService = {
  activateBoost: () => {
    return API.post('/boost/activate');
  },

  getBoostStatus: () => {
    return API.get('/boost/status');
  },

  getBoostPackages: () => {
    return API.get('/boost/packages');
  },

  submitBoostReceipt: (packageId: number | string, receiptUri: string) => {
    const formData = new FormData();
    const filename = receiptUri.split('/').pop() || 'slip.jpg';
    formData.append('receipt', {
      uri: receiptUri,
      name: filename,
      type: 'image/jpeg',
    } as any);

    return API.post(`/boost/purchase/${packageId}/receipt`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const TikTokService = {
  getPackages: () => {
    return API.get('/tiktok/packages');
  },

  submitPromotion: (packageId: number | string, receiptUri: string) => {
    const formData = new FormData();
    const filename = receiptUri.split('/').pop() || 'slip.jpg';
    formData.append('receipt', {
      uri: receiptUri,
      name: filename,
      type: 'image/jpeg',
    } as any);

    return API.post(`/tiktok/submit/${packageId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getMyPromotions: () => {
    return API.get('/tiktok/my');
  },
};

export const VerificationService = {
  getStatus: () => {
    return API.get('/verifications/status');
  },

  uploadDocuments: (formData: FormData) => {
    const parts = (formData as any)._parts;
    if (Array.isArray(parts)) {
      const hasFront = parts.some(([k]: any) => k === 'front');
      if (!hasFront) {
        const frontPart = parts.find(([k]: any) => k === 'frontDocument');
        if (frontPart) formData.append('front', frontPart[1]);
      }
      const hasBack = parts.some(([k]: any) => k === 'back');
      if (!hasBack) {
        const backPart = parts.find(([k]: any) => k === 'backDocument');
        if (backPart) formData.append('back', backPart[1]);
      }
      const hasType = parts.some(([k]: any) => k === 'type');
      if (!hasType) {
        const docTypePart = parts.find(([k]: any) => k === 'documentType');
        formData.append('type', (docTypePart ? docTypePart[1] : 'NATIONAL_ID') || 'NATIONAL_ID');
      }
    }
    return API.post('/verifications/submit-docs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadSelfie: (formDataOrToken: any, maybeSelfie?: any) => {
    let formData: FormData;
    if (formDataOrToken instanceof FormData) {
      formData = formDataOrToken;
    } else {
      formData = new FormData();
      formData.append('token', formDataOrToken);
      formData.append('selfie', maybeSelfie);
    }
    return API.post('/verifications/submit-selfie', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const ReportService = {
  reportProfile: (profileId: number | string, reason: string, description?: string) => {
    return API.post('/reports', { reportedUserId: Number(profileId), reason, description });
  },
  reportUser: (userId: number | string, reason: string, description?: string) => {
    return API.post('/reports', { reportedUserId: Number(userId), reason, description });
  },
};

export const LocationService = {
  getCities: () => {
    return API.get('/locations/cities');
  },
};
