import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, Radius } from '../../constants/theme';
import { CustomInput } from '../../components/ui/CustomInput';
import { CustomButton } from '../../components/ui/CustomButton';
import { Mail, Lock, Heart, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import useAuthStore from '../../store/useAuthStore';
import { SocialAuthButtons } from '../../components/auth/SocialAuthButtons';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isAuthLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');

    const res = await login({ email: email.trim(), password });
    if (res.success) {
      const u = res.data?.user || res.data;
      if (u && (u.hasProfile === false || u.profileCompleted === false)) {
        router.replace('/(auth)/profile-creation');
      } else {
        router.replace('/(tabs)');
      }
    } else {
      setError(res.message || 'Login failed. Please verify your credentials.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Brand Header */}
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Heart size={28} color={Colors.primaryDark} fill={Colors.primaryDark} />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue your journey to finding your soulmate.
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <CustomInput
              label="Email Address"
              placeholder="e.g. nimal@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              leftIcon={<Mail size={18} color={Colors.textMuted} />}
            />

            <CustomInput
              label="Password"
              placeholder="Enter your password"
              isPassword
              value={password}
              onChangeText={setPassword}
              leftIcon={<Lock size={18} color={Colors.textMuted} />}
            />

            <TouchableOpacity
              onPress={() => router.push('/(auth)/forgot-password')}
              style={styles.forgotPassBtn}
            >
              <Text style={styles.forgotPassText}>Forgot password?</Text>
            </TouchableOpacity>

            <CustomButton
              title="Sign In ✦"
              variant="primary"
              size="lg"
              onPress={handleLogin}
              loading={isAuthLoading}
              style={{ marginTop: Spacing.sm }}
            />
          </View>

          {/* Social Logins */}
          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.divider} />
          </View>

          <SocialAuthButtons mode="login" />

          {/* Register Prompt */}
          <View style={styles.footerPrompt}>
            <Text style={styles.promptText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.registerLink}> Register Free ✦</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingTop: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: Radius.full,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: Fonts?.serif || 'serif',
    fontSize: 30,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
    lineHeight: 20,
    paddingHorizontal: Spacing.md,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#783c1e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  errorContainer: {
    backgroundColor: Colors.errorRedLight,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.base,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  errorText: {
    color: Colors.errorRed,
    fontSize: 13,
    fontWeight: '500',
  },
  forgotPassBtn: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.base,
  },
  forgotPassText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primaryMedium,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    paddingHorizontal: Spacing.md,
    fontSize: 12,
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  socialRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  socialBtn: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  footerPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xxl,
    paddingBottom: Spacing.lg,
  },
  promptText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryMedium,
  },
});
