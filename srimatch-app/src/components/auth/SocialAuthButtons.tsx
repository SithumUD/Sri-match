import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useRouter } from 'expo-router';
import { Colors, Fonts, Spacing, Radius } from '../../constants/theme';
import useAuthStore from '../../store/useAuthStore';

// Ensure WebBrowser finishes any previous auth sessions cleanly
WebBrowser.maybeCompleteAuthSession();

interface SocialAuthButtonsProps {
  mode?: 'login' | 'register';
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({ mode = 'login' }) => {
  const router = useRouter();
  const { socialLogin, isAuthLoading } = useAuthStore();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const isIOS = Platform.OS === 'ios';

  const handleGoogleSignIn = async () => {
    const googleClientId =
      process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ||
      process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ||
      '';

    if (!googleClientId) {
      Alert.alert(
        'Google Client ID Required',
        'Google Sign-In requires EXPO_PUBLIC_GOOGLE_CLIENT_ID to be configured. You can also sign in directly using email and password.'
      );
      return;
    }

    setGoogleLoading(true);
    try {
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'srimatchapp',
        path: 'oauth',
      });

      const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
        googleClientId
      )}&response_type=id_token%20token&scope=${encodeURIComponent(
        'openid email profile'
      )}&redirect_uri=${encodeURIComponent(redirectUri)}&nonce=${nonce}&prompt=select_account`;

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

      if (result.type === 'success' && result.url) {
        // Extract id_token from hash fragment or query params
        const urlFragment = result.url.includes('#') ? result.url.split('#')[1] : result.url.split('?')[1] || '';
        const params = new URLSearchParams(urlFragment);
        const idToken = params.get('id_token');

        if (!idToken) {
          Alert.alert('Authentication Notice', 'Could not retrieve ID token from Google response.');
          setGoogleLoading(false);
          return;
        }

        const loginRes = await socialLogin('GOOGLE', idToken);
        if (loginRes.success) {
          const u = loginRes.data?.user || loginRes.user || loginRes.data;
          if (u && (u.hasProfile === false || u.profileCompleted === false)) {
            router.replace('/(auth)/profile-creation');
          } else {
            router.replace('/(tabs)');
          }
        } else {
          Alert.alert('Google Sign-In Failed', loginRes.message || 'Unable to authenticate with Google.');
        }
      }
    } catch (err: any) {
      console.warn('Google Sign-In error:', err);
      Alert.alert('Google Sign-In', err?.message || 'Failed to complete Google Sign-In.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    if (!isIOS) return;
    setAppleLoading(true);
    try {
      Alert.alert('Apple Sign-In', 'Apple Sign-In is available on iOS devices.');
    } finally {
      setAppleLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Google Button */}
      <TouchableOpacity
        style={[
          styles.socialBtn,
          styles.googleBtn,
          !isIOS && styles.fullWidthBtn,
        ]}
        onPress={handleGoogleSignIn}
        disabled={googleLoading || isAuthLoading}
        activeOpacity={0.8}
      >
        {googleLoading ? (
          <ActivityIndicator size="small" color="#4285F4" />
        ) : (
          <View style={styles.btnContent}>
            <View style={styles.googleIconContainer}>
              <Text style={styles.googleG}>G</Text>
            </View>
            <Text style={styles.googleBtnText}>
              {mode === 'register' ? 'Sign up with Google' : 'Sign in with Google'}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Apple Button - ONLY RENDERED ON APPLE (iOS) DEVICES */}
      {isIOS && (
        <TouchableOpacity
          style={[styles.socialBtn, styles.appleBtn]}
          onPress={handleAppleSignIn}
          disabled={appleLoading || isAuthLoading}
          activeOpacity={0.8}
        >
          {appleLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <View style={styles.btnContent}>
              <Text style={styles.appleIcon}></Text>
              <Text style={styles.appleBtnText}>
                {mode === 'register' ? 'Sign up with Apple' : 'Sign in with Apple'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
  },
  fullWidthBtn: {
    width: '100%',
  },
  googleBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2D9D5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  appleBtn: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleG: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginTop: -1,
  },
  googleBtnText: {
    color: '#3C4043',
    fontSize: 15,
    fontWeight: '600',
  },
  appleIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    marginTop: -2,
  },
  appleBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default SocialAuthButtons;
