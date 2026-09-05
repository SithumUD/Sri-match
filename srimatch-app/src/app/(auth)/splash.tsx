import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Fonts, Spacing, Radius } from '../../constants/theme';
import { Heart, Sparkles } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import useAuthStore from '../../store/useAuthStore';
import { checkNetworkAndServerStatus } from '../../utils/network';
import { API_BASE_URL } from '../../services/api';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { loadStoredSession } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      // Step 1: Health & Connectivity check
      const netStatus = await checkNetworkAndServerStatus(API_BASE_URL);

      if (netStatus === 'NO_INTERNET') {
        setTimeout(() => {
          router.replace({ pathname: '/network-error', params: { type: 'NO_INTERNET' } });
        }, 1000);
        return;
      }

      if (netStatus === 'SERVER_DOWN') {
        setTimeout(() => {
          router.replace({ pathname: '/network-error', params: { type: 'SERVER_DOWN' } });
        }, 1000);
        return;
      }

      // Step 2: Restore stored session if online & healthy
      await loadStoredSession();
      const hasOnboarded = await AsyncStorage.getItem('srimatch_has_onboarded');
      const state = useAuthStore.getState();

      setTimeout(() => {
        if (state.isAuthenticated && state.accessToken) {
          const u = state.user;
          if (u && (u.hasProfile === false || u.profileCompleted === false)) {
            router.replace('/(auth)/profile-creation');
          } else {
            router.replace('/(tabs)');
          }
        } else if (hasOnboarded === 'true') {
          // Already onboarded user goes straight to Login (never shows onboarding again)
          router.replace('/(auth)/login');
        } else {
          // First-time user sees Onboarding
          router.replace('/(auth)/onboarding');
        }
      }, 1200);
    };

    init();
  }, []);

  return (
    <LinearGradient
      colors={Colors.gradients.hero as any}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Decorative Cultural Ornaments */}
      <View style={styles.topOrb} />
      <View style={styles.bottomOrb} />

      <View style={styles.content}>
        {/* Brand Icon */}
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={Colors.gradients.gold as any}
            style={styles.iconGradient}
          >
            <Heart size={44} color={Colors.primaryDark} fill={Colors.primaryDark} />
          </LinearGradient>
          <View style={styles.sparkleIcon}>
            <Sparkles size={18} color={Colors.gold} fill={Colors.gold} />
          </View>
        </View>

        {/* Brand Title */}
        <Text style={styles.title}>SriMatch</Text>
        <View style={styles.ornamentLine}>
          <View style={styles.line} />
          <Text style={styles.ornament}>✦ &nbsp; ✦ &nbsp; ✦</Text>
          <View style={styles.line} />
        </View>

        <Text style={styles.tagline}>Sri Lanka's Trusted Matrimonial Platform</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Secure · Verified · Soulful</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
  },
  topOrb: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(232, 201, 122, 0.1)',
  },
  bottomOrb: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(201, 133, 106, 0.08)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  iconGradient: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  sparkleIcon: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.primaryDark,
    borderRadius: 12,
    padding: 2,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1.5,
    fontFamily: Fonts.serif,
  },
  ornamentLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  line: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(232, 201, 122, 0.4)',
  },
  ornament: {
    color: Colors.gold,
    fontSize: 10,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: 0.5,
    marginTop: Spacing.xs,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: Colors.goldLight,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
