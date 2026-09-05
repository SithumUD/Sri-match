import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Spacing, Radius, Shadows } from '../constants/theme';
import { CustomButton } from '../components/ui/CustomButton';
import { WifiOff, ServerCrash, RefreshCw, ShieldAlert, Sparkles } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { checkNetworkAndServerStatus, NetworkStatusType } from '../utils/network';
import { API_BASE_URL } from '../services/api';
import useAuthStore from '../store/useAuthStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NetworkErrorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialType: NetworkStatusType = (params.type as NetworkStatusType) || 'NO_INTERNET';

  const [statusType, setStatusType] = useState<NetworkStatusType>(initialType);
  const [retrying, setRetrying] = useState(false);
  const { loadStoredSession } = useAuthStore();

  const handleRetry = async () => {
    setRetrying(true);
    try {
      const status = await checkNetworkAndServerStatus(API_BASE_URL);
      if (status === 'ONLINE') {
        // Successful connection restored!
        await loadStoredSession();
        const hasOnboarded = await AsyncStorage.getItem('srimatch_has_onboarded');
        const state = useAuthStore.getState();

        if (state.isAuthenticated && state.accessToken) {
          router.replace('/(tabs)');
        } else if (hasOnboarded === 'true') {
          router.replace('/(auth)/login');
        } else {
          router.replace('/(auth)/onboarding');
        }
      } else {
        setStatusType(status);
      }
    } catch (e) {
      setStatusType('NO_INTERNET');
    } finally {
      setRetrying(false);
    }
  };

  const isServerDown = statusType === 'SERVER_DOWN';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e0e08" />

      <LinearGradient
        colors={['#1e0e08', '#3d1f12', '#2a1309'] as any}
        style={styles.backgroundGradient}
      >
        {/* Glow orbs */}
        <View style={styles.glowOrbTop} />
        <View style={styles.glowOrbBottom} />

        <View style={styles.contentCard}>
          {/* Status Icon */}
          <View style={[styles.iconCircle, isServerDown ? styles.serverCircle : styles.wifiCircle]}>
            {isServerDown ? (
              <ServerCrash size={48} color="#e07a30" />
            ) : (
              <WifiOff size={48} color="#ef4444" />
            )}
          </View>

          {/* Heading */}
          <Text style={styles.title}>
            {isServerDown ? 'Server Maintenance' : 'No Internet Connection'}
          </Text>

          {/* Subtitle / Details */}
          <Text style={styles.subtitle}>
            {isServerDown
              ? 'Our backend matchmaking services are temporarily unreachable or undergoing scheduled maintenance. Please try again shortly.'
              : 'Unable to connect to the internet. Please check your Wi-Fi or mobile cellular data connection and try again.'}
          </Text>

          {/* Tips Box */}
          <View style={styles.tipsBox}>
            <View style={styles.tipRow}>
              <ShieldAlert size={16} color={Colors.primaryMedium} />
              <Text style={styles.tipText}>
                {isServerDown
                  ? 'Your profile and messages are safely preserved.'
                  : 'Toggle Airplane Mode or check Wi-Fi signal.'}
              </Text>
            </View>
            <View style={styles.tipRow}>
              <Sparkles size={16} color={Colors.gold} />
              <Text style={styles.tipText}>
                {isServerDown
                  ? 'We are restoring systems as fast as possible.'
                  : 'Ensure mobile data is enabled for SriMatch.'}
              </Text>
            </View>
          </View>

          {/* Retry Action Button */}
          <CustomButton
            title={retrying ? 'Checking Connection...' : isServerDown ? 'Check Server Status ↻' : 'Retry Connection ↻'}
            variant="primary"
            onPress={handleRetry}
            loading={retrying}
            disabled={retrying}
            style={styles.retryBtn}
          />
        </View>

        {/* Footer Brand */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>SriMatch · Trusted Matrimony</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
  },
  glowOrbTop: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(232, 201, 122, 0.08)',
  },
  glowOrbBottom: {
    position: 'absolute',
    bottom: -60,
    left: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(201, 58, 26, 0.08)',
  },
  contentCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.card,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  wifiCircle: {
    backgroundColor: '#fee2e2',
  },
  serverCircle: {
    backgroundColor: '#ffedd5',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2d1810',
    fontFamily: Fonts.serif,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 13,
    color: '#6b4a3a',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  tipsBox: {
    width: '100%',
    backgroundColor: '#fdf8f4',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#f0ddd5',
    gap: 8,
    marginBottom: Spacing.xl,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipText: {
    fontSize: 11,
    color: '#6b4a3a',
    flex: 1,
  },
  retryBtn: {
    width: '100%',
  },
  footer: {
    marginTop: Spacing.xl,
  },
  footerText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
