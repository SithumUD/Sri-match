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
import { Mail, Lock, KeyRound, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AuthService from '../../services/auth.service';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'otp' | 'newPassword'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res: any = await AuthService.forgotPassword({ email: email.trim() });
      if (res?.success) {
        setStep('otp');
      } else {
        setError(res?.message || 'Failed to send reset code. Please verify email.');
      }
    } catch (e: any) {
      setError(e?.message || 'Could not send verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setError('Please enter the 6-digit OTP sent to your email.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res: any = await AuthService.verifyResetOtp({ email: email.trim(), otp: otp.trim() });
      if (res?.success) {
        setStep('newPassword');
      } else {
        setError(res?.message || 'Invalid or expired OTP code.');
      }
    } catch (e: any) {
      setError(e?.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      setError('Passwords do not match or are empty.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res: any = await AuthService.resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });
      if (res?.success) {
        Alert.alert('Password Updated! 🔒', 'Your password has been reset successfully.', [
          {
            text: 'Sign In',
            onPress: () => router.replace('/(auth)/login'),
          },
        ]);
      } else {
        setError(res?.message || 'Failed to reset password.');
      }
    } catch (e: any) {
      setError(e?.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Back button */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={20} color={Colors.primaryDark} />
            <Text style={styles.backText}>Back to Sign In</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {step === 'email'
                ? 'Forgot Password'
                : step === 'otp'
                ? 'Verify Reset Code'
                : 'Create New Password'}
            </Text>
            <Text style={styles.subtitle}>
              {step === 'email'
                ? 'Enter your registered email and we will send you a verification code.'
                : step === 'otp'
                ? `Enter the 6-digit code sent to ${email}.`
                : 'Enter and confirm your new secure password.'}
            </Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {step === 'email' && (
              <>
                <CustomInput
                  label="Registered Email"
                  placeholder="e.g. nimal@gmail.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  leftIcon={<Mail size={18} color={Colors.textMuted} />}
                />
                <CustomButton
                  title="Send Verification Code ✦"
                  variant="primary"
                  size="lg"
                  onPress={handleSendOtp}
                  loading={loading}
                  style={{ marginTop: Spacing.sm }}
                />
              </>
            )}

            {step === 'otp' && (
              <>
                <CustomInput
                  label="6-Digit OTP Code"
                  placeholder="e.g. 123456"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otp}
                  onChangeText={setOtp}
                  leftIcon={<KeyRound size={18} color={Colors.textMuted} />}
                />
                <CustomButton
                  title="Verify OTP Code"
                  variant="primary"
                  size="lg"
                  onPress={handleVerifyOtp}
                  loading={loading}
                  style={{ marginTop: Spacing.sm }}
                />
              </>
            )}

            {step === 'newPassword' && (
              <>
                <CustomInput
                  label="New Password"
                  placeholder="Minimum 6 characters"
                  isPassword
                  value={newPassword}
                  onChangeText={setNewPassword}
                  leftIcon={<Lock size={18} color={Colors.textMuted} />}
                />
                <CustomInput
                  label="Confirm New Password"
                  placeholder="Re-enter new password"
                  isPassword
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  leftIcon={<Lock size={18} color={Colors.textMuted} />}
                />
                <CustomButton
                  title="Reset Password ✦"
                  variant="gold"
                  size="lg"
                  onPress={handleResetPassword}
                  loading={loading}
                  style={{ marginTop: Spacing.sm }}
                />
              </>
            )}
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
    paddingTop: Spacing.base,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.lg,
  },
  backText: {
    fontSize: 14,
    color: Colors.primaryDark,
    fontWeight: '600',
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
});
