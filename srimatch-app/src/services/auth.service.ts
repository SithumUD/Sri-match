import API from './api';

export const AuthService = {
  login: (credentials: { email?: string; username?: string; password?: string }) => {
    return API.post('/auth/login', credentials);
  },

  register: (userData: any) => {
    return API.post('/auth/register', userData);
  },

  socialLogin: (socialData: { provider: string; token: string; email?: string; name?: string }) => {
    return API.post('/auth/social-login', socialData);
  },

  verifyEmail: (otpData: { email: string; otp: string }) => {
    return API.post('/auth/verify-email', otpData);
  },

  resendVerification: (email?: string) => {
    return API.post('/auth/resend-verification', { email });
  },

  forgotPassword: (emailData: { email: string }) => {
    return API.post('/auth/forgot-password', emailData);
  },

  verifyResetOtp: (otpData: { email: string; otp: string }) => {
    return API.post('/auth/verify-reset-otp', otpData);
  },

  resetPassword: (passwordData: { email: string; otp: string; newPassword: string }) => {
    return API.post('/auth/reset-password', passwordData);
  },

  updatePassword: (updateData: { oldPassword: string; newPassword: string }) => {
    return API.post('/auth/update-password', updateData);
  },

  logout: () => {
    return API.post('/auth/logout');
  },
};

export default AuthService;
