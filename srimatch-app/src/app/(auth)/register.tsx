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
import { User, Mail, Lock, Gift, CheckSquare, Square } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import useAuthStore from '../../store/useAuthStore';
import { SocialAuthButtons } from '../../components/auth/SocialAuthButtons';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isAuthLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms & Conditions to proceed.');
      return;
    }

    setError('');

    const res = await register({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      agreeToTerms: true,
      agreeToMarketing: false,
      referralCode: formData.referralCode.trim() || undefined,
    });

    if (res.success) {
      Alert.alert(
        'Account Created! 💍',
        'Welcome to SriMatch! Now let us setup your profile to find your ideal matches.',
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/(auth)/profile-creation'),
          },
        ]
      );
    } else {
      setError(res.message || 'Registration failed. Please try again.');
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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Your Account</Text>
            <Text style={styles.subtitle}>
              Begin your search for a compatible life partner in Sri Lanka and abroad.
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.row}>
              <CustomInput
                label="First Name"
                placeholder="e.g. Kasun"
                value={formData.firstName}
                onChangeText={(v) => handleChange('firstName', v)}
                leftIcon={<User size={18} color={Colors.textMuted} />}
                containerStyle={{ flex: 1, marginRight: Spacing.sm }}
              />
              <CustomInput
                label="Last Name"
                placeholder="e.g. Perera"
                value={formData.lastName}
                onChangeText={(v) => handleChange('lastName', v)}
                leftIcon={<User size={18} color={Colors.textMuted} />}
                containerStyle={{ flex: 1 }}
              />
            </View>

            <CustomInput
              label="Email Address"
              placeholder="e.g. kasun@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(v) => handleChange('email', v)}
              leftIcon={<Mail size={18} color={Colors.textMuted} />}
            />

            <CustomInput
              label="Password"
              placeholder="Minimum 6 characters"
              isPassword
              value={formData.password}
              onChangeText={(v) => handleChange('password', v)}
              leftIcon={<Lock size={18} color={Colors.textMuted} />}
            />

            <CustomInput
              label="Confirm Password"
              placeholder="Re-enter your password"
              isPassword
              value={formData.confirmPassword}
              onChangeText={(v) => handleChange('confirmPassword', v)}
              leftIcon={<Lock size={18} color={Colors.textMuted} />}
            />

            <CustomInput
              label="Referral Code (Optional)"
              placeholder="e.g. FRIEND2026"
              autoCapitalize="characters"
              value={formData.referralCode}
              onChangeText={(v) => handleChange('referralCode', v)}
              leftIcon={<Gift size={18} color={Colors.textMuted} />}
            />

            {/* Terms Checkbox */}
            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
              activeOpacity={0.7}
            >
              {agreedToTerms ? (
                <CheckSquare size={20} color={Colors.primaryMedium} />
              ) : (
                <Square size={20} color={Colors.borderDark} />
              )}
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsHighlight}>Terms & Conditions</Text> and{' '}
                <Text style={styles.termsHighlight}>Privacy Policy</Text>.
              </Text>
            </TouchableOpacity>

            <CustomButton
              title="Create Account ✦"
              variant="primary"
              size="lg"
              onPress={handleRegister}
              loading={isAuthLoading}
              style={{ marginTop: Spacing.sm }}
            />
          </View>

          {/* Social Logins */}
          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or register with</Text>
            <View style={styles.divider} />
          </View>

          <SocialAuthButtons mode="register" />

          {/* Login Prompt */}
          <View style={styles.footerPrompt}>
            <Text style={styles.promptText}>Already registered?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.loginLink}> Sign In ✦</Text>
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
    paddingTop: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontFamily: Fonts?.serif || 'serif',
    fontSize: 28,
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
    paddingHorizontal: Spacing.sm,
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
  row: {
    flexDirection: 'row',
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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: Spacing.lg,
    paddingHorizontal: 2,
  },
  termsText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    flex: 1,
  },
  termsHighlight: {
    color: Colors.primaryMedium,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: 13,
    color: Colors.textMuted,
    paddingHorizontal: Spacing.md,
    fontWeight: '500',
  },
  footerPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  promptText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryMedium,
  },
});
