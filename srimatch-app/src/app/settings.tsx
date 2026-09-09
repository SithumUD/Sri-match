import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  User as UserIcon,
  Shield,
  Eye,
  Bell,
  Lock,
  Crown,
  HelpCircle,
  Trash2,
  CheckCircle2,
  Phone,
  Mail,
  Smartphone,
  ChevronRight,
  MessageCircle,
  MapPin,
  Camera,
  AlertTriangle,
  Info,
  LogOut,
  Sparkles,
  Laptop,
  Monitor,
  Globe,
  KeyRound,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react-native';

import { Colors, Fonts, Spacing, Radius } from '../constants/theme';
import { GradientHeader } from '../components/ui/GradientHeader';
import { CustomInput } from '../components/ui/CustomInput';
import { CustomButton } from '../components/ui/CustomButton';
import AuthService from '../services/auth.service';
import { UserService, ProfileService } from '../services';
import useAuthStore from '../store/useAuthStore';
import { DEFAULT_PRIVACY_SETTINGS } from '../constants/profileEnums';

type SettingsTab = 'account' | 'privacy' | 'notifications' | 'security' | 'billing' | 'help';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout, refreshProfile } = useAuthStore();
  const isPremium = user?.premium;

  const [activeTab, setActiveTab] = useState<SettingsTab>('account');

  // ── Account State ──
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [savingAccount, setSavingAccount] = useState(false);
  const [accountSaved, setAccountSaved] = useState(false);

  // Phone OTP Modal State (Notify.lk)
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');

  // ── Privacy State ──
  const [privacySettings, setPrivacySettings] = useState({
    ...DEFAULT_PRIVACY_SETTINGS,
    ...(user?.privacySettings || {}),
  });
  const [savingPrivacy, setSavingPrivacy] = useState(false);
  const [privacySaved, setPrivacySaved] = useState(false);

  // ── Notifications State ──
  const [notifications, setNotifications] = useState({
    emailNewMessages: true,
    emailNewMatches: true,
    emailProfileViews: false,
    emailConnections: true,
    emailPromotions: false,
    pushNewMessages: true,
    pushNewMatches: true,
    pushProfileViews: true,
    pushConnections: true,
    pushPromotions: false,
    smsSecurity: true,
  });
  const [savingNotifs, setSavingNotifs] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);

  // ── Password State ──
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // ── 2FA State ──
  const [twoFaModalVisible, setTwoFaModalVisible] = useState(false);
  const [disableTwoFaModalVisible, setDisableTwoFaModalVisible] = useState(false);
  const [twoFaSecretData, setTwoFaSecretData] = useState<{ secret?: string; qrCodeUrl?: string } | null>(null);
  const [totpCodeInput, setTotpCodeInput] = useState('');
  const [loadingTwoFa, setLoadingTwoFa] = useState(false);
  const [twoFaError, setTwoFaError] = useState('');

  // ── Active Sessions State ──
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [revokingSessionId, setRevokingSessionId] = useState<number | null>(null);
  const [revokingAll, setRevokingAll] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (activeTab === 'security') {
      loadActiveSessions();
    }
  }, [activeTab]);

  const loadActiveSessions = async () => {
    setLoadingSessions(true);
    try {
      const res: any = await UserService.getActiveSessions();
      setSessions(res?.data || res || []);
    } catch (e) {
      console.warn('Could not load active sessions', e);
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleSetup2FA = async () => {
    setLoadingTwoFa(true);
    setTwoFaError('');
    setTotpCodeInput('');
    try {
      const res: any = await AuthService.setup2FA();
      setTwoFaSecretData(res?.data || res);
      setTwoFaModalVisible(true);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Could not initiate 2FA setup.');
    } finally {
      setLoadingTwoFa(false);
    }
  };

  const handleConfirm2FA = async () => {
    if (!totpCodeInput || totpCodeInput.trim().length !== 6) {
      setTwoFaError('Please enter the 6-digit TOTP code from your authenticator app.');
      return;
    }
    setLoadingTwoFa(true);
    setTwoFaError('');
    try {
      const codeNum = parseInt(totpCodeInput.trim(), 10);
      await AuthService.confirm2FA(codeNum);
      setTwoFaModalVisible(false);
      setTwoFaSecretData(null);
      setTotpCodeInput('');
      await refreshProfile();
      Alert.alert('2FA Enabled ✓', 'Two-factor authentication is now active on your account.');
    } catch (e: any) {
      setTwoFaError(e?.response?.data?.message || 'Invalid TOTP code. Please check your authenticator app.');
    } finally {
      setLoadingTwoFa(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!totpCodeInput || totpCodeInput.trim().length !== 6) {
      setTwoFaError('Please enter the 6-digit TOTP code from your authenticator app to confirm.');
      return;
    }
    setLoadingTwoFa(true);
    setTwoFaError('');
    try {
      const codeNum = parseInt(totpCodeInput.trim(), 10);
      await AuthService.disable2FA(codeNum);
      setDisableTwoFaModalVisible(false);
      setTotpCodeInput('');
      await refreshProfile();
      Alert.alert('2FA Disabled', 'Two-factor authentication has been turned off.');
    } catch (e: any) {
      setTwoFaError(e?.response?.data?.message || 'Invalid TOTP code.');
    } finally {
      setLoadingTwoFa(false);
    }
  };

  const handleRevokeSession = async (sessionId: number) => {
    Alert.alert('Revoke Session', 'Log out this device from your account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Revoke',
        style: 'destructive',
        onPress: async () => {
          setRevokingSessionId(sessionId);
          try {
            await UserService.revokeSession(sessionId);
            setSessions((prev) => prev.filter((s) => s.id !== sessionId));
            Alert.alert('Session Terminated', 'The selected device has been logged out.');
          } catch (e: any) {
            Alert.alert('Error', e?.response?.data?.message || 'Could not revoke session.');
          } finally {
            setRevokingSessionId(null);
          }
        },
      },
    ]);
  };

  const handleRevokeAllOtherSessions = async () => {
    Alert.alert(
      'Log Out All Other Devices',
      'Are you sure you want to log out of all devices except this one?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out Others',
          style: 'destructive',
          onPress: async () => {
            setRevokingAll(true);
            try {
              await UserService.revokeAllOtherSessions();
              await loadActiveSessions();
              Alert.alert('Logged Out', 'All other active sessions have been terminated.');
            } catch (e: any) {
              Alert.alert('Error', e?.response?.data?.message || 'Failed to revoke other sessions.');
            } finally {
              setRevokingAll(false);
            }
          },
        },
      ]
    );
  };

  const loadInitialData = async () => {
    try {
      const [userRes, profileRes] = await Promise.allSettled([
        UserService.getMyUserData(),
        ProfileService.getMyProfile(),
      ]);

      if (userRes.status === 'fulfilled' && userRes.value?.data) {
        const u = userRes.value.data;
        setFirstName(u.firstName || '');
        setLastName(u.lastName || '');
        setPhoneNumber(u.phoneNumber || '');
        if (u.notificationPreferences) {
          setNotifications((prev) => ({ ...prev, ...u.notificationPreferences }));
        }
      }

      if (profileRes.status === 'fulfilled' && profileRes.value?.data?.privacySettings) {
        setPrivacySettings((prev) => ({
          ...prev,
          ...profileRes.value.data.privacySettings,
        }));
      }
    } catch (e) {
      console.warn('Could not refresh full settings data', e);
    }
  };

  // ── Handlers: Account ──
  const handleSaveAccount = async () => {
    try {
      setSavingAccount(true);
      await UserService.updateMyUserData({
        firstName,
        lastName,
        phoneNumber,
      });
      await refreshProfile();
      setAccountSaved(true);
      Alert.alert('Saved', 'Your account details have been updated.');
      setTimeout(() => setAccountSaved(false), 3000);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Could not update account info.');
    } finally {
      setSavingAccount(false);
    }
  };

  const handleRequestPhoneOtp = async () => {
    if (!phoneNumber || phoneNumber.trim().length < 9) {
      Alert.alert('Invalid Number', 'Please enter a valid Sri Lankan mobile phone number (e.g. 0771234567).');
      return;
    }
    setSendingOtp(true);
    setOtpError('');
    try {
      const res = await UserService.requestPhoneOtp(phoneNumber);
      if (res?.data?.success) {
        setOtpModalVisible(true);
      } else {
        Alert.alert('SMS Failed', res?.data?.message || 'Failed to dispatch verification SMS via Notify.lk.');
      }
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'SMS service error.');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (!otpCode || otpCode.trim().length !== 6) {
      setOtpError('Please enter the 6-digit code received via SMS.');
      return;
    }
    setVerifyingOtp(true);
    setOtpError('');
    try {
      const res = await UserService.verifyPhone(otpCode.trim());
      if (res?.data?.success) {
        setOtpModalVisible(false);
        setOtpCode('');
        await refreshProfile();
        Alert.alert('Phone Verified ✓', 'Your phone number has been verified successfully via Notify.lk SMS Gateway.');
      } else {
        setOtpError(res?.data?.message || 'Invalid or expired OTP code.');
      }
    } catch (e: any) {
      setOtpError(e?.response?.data?.message || 'Verification failed.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  // ── Handlers: Privacy ──
  const updatePrivacyKey = (key: string, value: any) => {
    setPrivacySettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSavePrivacy = async () => {
    try {
      setSavingPrivacy(true);
      await ProfileService.updatePrivacySettings(privacySettings);
      await refreshProfile();
      setPrivacySaved(true);
      Alert.alert('Privacy Saved', 'Your privacy and visibility rules have been updated.');
      setTimeout(() => setPrivacySaved(false), 3000);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Could not save privacy settings.');
    } finally {
      setSavingPrivacy(false);
    }
  };

  // ── Handlers: Notifications ──
  const updateNotifKey = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveNotifications = async () => {
    try {
      setSavingNotifs(true);
      await UserService.updateNotificationPreferences(notifications);
      setNotifSaved(true);
      Alert.alert('Notifications Saved', 'Your notification preferences have been saved.');
      setTimeout(() => setNotifSaved(false), 3000);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Failed to save notifications.');
    } finally {
      setSavingNotifs(false);
    }
  };

  // ── Handlers: Security ──
  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert('Error', 'Please enter your current and new password.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    setUpdatingPassword(true);
    try {
      await AuthService.updatePassword({ currentPassword, newPassword });
      Alert.alert('Password Updated ✓', 'Your password has been changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || e?.message || 'Could not update password.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your SriMatch account? All your matches, chat history, and photos will be removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Forever',
          style: 'destructive',
          onPress: async () => {
            try {
              await UserService.deleteAccount();
            } catch (e) {
              console.error('Delete account API error:', e);
            }
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const TABS = [
    { key: 'account', label: 'Account', icon: UserIcon },
    { key: 'privacy', label: 'Privacy', icon: Eye },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'security', label: 'Security', icon: Shield },
    { key: 'billing', label: 'Membership', icon: Crown },
    { key: 'help', label: 'Help', icon: HelpCircle },
  ] as const;

  return (
    <View style={styles.container}>
      <GradientHeader title="Settings" subtitle="Account preferences & privacy" showBack />

      {/* Top Tab Bar */}
      <View style={styles.tabBarWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarScroll}
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabBtn, active && styles.tabBtnActive]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.7}
              >
                <Icon
                  size={14}
                  color={active ? Colors.surface : Colors.textSecondary}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.tabBtnText, active && styles.tabBtnTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ═══════════════════════════════════════════════════════════════════
            TAB 1: ACCOUNT
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'account' && (
          <View>
            <View style={styles.card}>
              <View style={styles.headerRow}>
                <UserIcon size={18} color={Colors.primaryMedium} />
                <Text style={styles.sectionTitle}>Personal Information</Text>
              </View>

              <CustomInput
                label="Email Address (Read-only)"
                value={user?.email || ''}
                editable={false}
                placeholder="your.email@example.com"
              />

              <View style={styles.inputContainer}>
                <View style={styles.labelRow}>
                  <Text style={styles.fieldLabel}>Phone Number</Text>
                  {user?.phoneVerified ? (
                    <View style={styles.verifiedBadge}>
                      <CheckCircle2 size={12} color="#16a34a" />
                      <Text style={styles.verifiedBadgeText}>Verified via Notify.lk</Text>
                    </View>
                  ) : (
                    <Text style={styles.unverifiedText}>Not Verified</Text>
                  )}
                </View>

                <View style={styles.phoneInputRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="07XXXXXXXX or 947XXXXXXXX"
                    placeholderTextColor={Colors.textLight}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                  />
                  {!user?.phoneVerified && (
                    <TouchableOpacity
                      style={styles.verifySmsBtn}
                      onPress={handleRequestPhoneOtp}
                      disabled={sendingOtp || !phoneNumber}
                    >
                      {sendingOtp ? (
                        <ActivityIndicator size="small" color={Colors.primaryMedium} />
                      ) : (
                        <Text style={styles.verifySmsBtnText}>Verify SMS</Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <CustomInput
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First Name"
              />

              <CustomInput
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last Name"
              />

              <CustomButton
                title={accountSaved ? 'Details Saved ✓' : 'Update Account Info'}
                variant="primary"
                onPress={handleSaveAccount}
                loading={savingAccount}
                style={{ marginTop: Spacing.xs }}
              />
            </View>

            {/* Danger Zone */}
            <View style={[styles.card, { borderColor: '#fca5a5' }]}>
              <View style={styles.headerRow}>
                <Trash2 size={18} color={Colors.errorRed} />
                <Text style={[styles.sectionTitle, { color: Colors.errorRed }]}>
                  Danger Zone
                </Text>
              </View>

              <Text style={styles.dangerSub}>
                Permanently delete your SriMatch account, profile, photos, and match history.
              </Text>

              <CustomButton
                title="Delete My Account"
                variant="danger"
                onPress={handleDeleteAccount}
                style={{ marginTop: Spacing.sm }}
              />
            </View>
          </View>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 2: PRIVACY & VISIBILITY
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'privacy' && (
          <View>
            {/* Profile & Discovery Privacy */}
            <View style={styles.card}>
              <View style={styles.headerRow}>
                <Eye size={18} color={Colors.primaryMedium} />
                <Text style={styles.sectionTitle}>Profile & Search Visibility</Text>
              </View>

              <Text style={styles.fieldLabel}>Who can view my full profile</Text>
              <View style={styles.segmentRow}>
                {[
                  { key: 'EVERYONE', label: 'Everyone' },
                  { key: 'VERIFIED_ONLY', label: 'Verified Only' },
                  { key: 'CONNECTIONS_ONLY', label: 'Matches Only' },
                ].map((opt) => {
                  const active = privacySettings.profileVisibility === opt.key;
                  return (
                    <TouchableOpacity
                      key={opt.key}
                      style={[styles.segmentBtn, active && styles.segmentBtnActive]}
                      onPress={() => updatePrivacyKey('profileVisibility', opt.key)}
                    >
                      <Text style={[styles.segmentBtnText, active && styles.segmentBtnTextActive]}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingTextCol}>
                  <Text style={styles.settingLabel}>Show in Search & Discovery</Text>
                  <Text style={styles.settingSub}>Allow your profile to appear in member search</Text>
                </View>
                <Switch
                  value={!!privacySettings.showInSearchResults}
                  onValueChange={(v) => updatePrivacyKey('showInSearchResults', v)}
                  trackColor={{ false: Colors.border, true: Colors.primaryMedium }}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingTextCol}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Text style={styles.settingLabel}>Incognito Mode</Text>
                    <Crown size={12} color="#d4a017" />
                  </View>
                  <Text style={styles.settingSub}>
                    Browse profiles secretly without leaving visitor footprints
                    {!isPremium ? ' (Premium Only)' : ''}
                  </Text>
                </View>
                <Switch
                  value={!!privacySettings.incognitoMode}
                  onValueChange={(v) => {
                    if (!isPremium && v) {
                      Alert.alert(
                        'Premium Feature 👑',
                        'Incognito browsing is an exclusive VIP feature for SriMatch Premium members.',
                        [
                          { text: 'Later', style: 'cancel' },
                          { text: 'Upgrade', onPress: () => router.push('/(tabs)/premium') },
                        ]
                      );
                      return;
                    }
                    updatePrivacyKey('incognitoMode', v);
                  }}
                  disabled={!isPremium}
                  trackColor={{ false: Colors.border, true: Colors.primaryMedium }}
                />
              </View>

              <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
                <View style={styles.settingTextCol}>
                  <Text style={styles.settingLabel}>Show Online Status</Text>
                  <Text style={styles.settingSub}>Let connections see when you are active</Text>
                </View>
                <Switch
                  value={!!privacySettings.showOnlineStatus}
                  onValueChange={(v) => updatePrivacyKey('showOnlineStatus', v)}
                  trackColor={{ false: Colors.border, true: Colors.primaryMedium }}
                />
              </View>
            </View>

            {/* Photo Privacy */}
            <View style={styles.card}>
              <View style={styles.headerRow}>
                <Camera size={18} color={Colors.primaryMedium} />
                <Text style={styles.sectionTitle}>Photo Privacy & Watermarking</Text>
              </View>

              <Text style={styles.fieldLabel}>Photo Visibility</Text>
              <View style={styles.segmentRow}>
                {[
                  { key: 'PUBLIC', label: 'Public' },
                  { key: 'BLURRED_UNTIL_MATCH', label: 'Blur to Strangers' },
                  { key: 'CONNECTIONS_ONLY', label: 'Matches Only' },
                ].map((opt) => {
                  const active = privacySettings.photoVisibility === opt.key;
                  return (
                    <TouchableOpacity
                      key={opt.key}
                      style={[styles.segmentBtn, active && styles.segmentBtnActive]}
                      onPress={() => updatePrivacyKey('photoVisibility', opt.key)}
                    >
                      <Text style={[styles.segmentBtnText, active && styles.segmentBtnTextActive]}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
                <View style={styles.settingTextCol}>
                  <Text style={styles.settingLabel}>Watermark Photos</Text>
                  <Text style={styles.settingSub}>Add SriMatch anti-screenshot security badge</Text>
                </View>
                <Switch
                  value={!!privacySettings.watermarkPhotos}
                  onValueChange={(v) => updatePrivacyKey('watermarkPhotos', v)}
                  trackColor={{ false: Colors.border, true: Colors.primaryMedium }}
                />
              </View>
            </View>

            {/* Sensitive Information Controls */}
            <View style={styles.card}>
              <View style={styles.headerRow}>
                <Shield size={18} color={Colors.primaryMedium} />
                <Text style={styles.sectionTitle}>Sensitive Details Privacy</Text>
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingTextCol}>
                  <Text style={styles.settingLabel}>Show Income Range</Text>
                  <Text style={styles.settingSub}>Display monthly/annual income on your profile</Text>
                </View>
                <Switch
                  value={!!privacySettings.showIncomeRange}
                  onValueChange={(v) => updatePrivacyKey('showIncomeRange', v)}
                  trackColor={{ false: Colors.border, true: Colors.primaryMedium }}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingTextCol}>
                  <Text style={styles.settingLabel}>Show Family Details</Text>
                  <Text style={styles.settingSub}>Display family background and values</Text>
                </View>
                <Switch
                  value={!!privacySettings.showFamilyDetails}
                  onValueChange={(v) => updatePrivacyKey('showFamilyDetails', v)}
                  trackColor={{ false: Colors.border, true: Colors.primaryMedium }}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingTextCol}>
                  <Text style={styles.settingLabel}>Show Partner Preferences</Text>
                  <Text style={styles.settingSub}>Display what you look for in a partner</Text>
                </View>
                <Switch
                  value={!!privacySettings.showPartnerPreferences}
                  onValueChange={(v) => updatePrivacyKey('showPartnerPreferences', v)}
                  trackColor={{ false: Colors.border, true: Colors.primaryMedium }}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingTextCol}>
                  <Text style={styles.settingLabel}>Show Horoscope Details</Text>
                  <Text style={styles.settingSub}>Display astrological chart and Porondam info</Text>
                </View>
                <Switch
                  value={!!privacySettings.showHoroscope}
                  onValueChange={(v) => updatePrivacyKey('showHoroscope', v)}
                  trackColor={{ false: Colors.border, true: Colors.primaryMedium }}
                />
              </View>

              <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
                <View style={styles.settingTextCol}>
                  <Text style={styles.settingLabel}>Show Compatibility Quiz</Text>
                  <Text style={styles.settingSub}>Display values & personality quiz answers</Text>
                </View>
                <Switch
                  value={!!privacySettings.showQuizAnswers}
                  onValueChange={(v) => updatePrivacyKey('showQuizAnswers', v)}
                  trackColor={{ false: Colors.border, true: Colors.primaryMedium }}
                />
              </View>

              <CustomButton
                title={privacySaved ? 'Privacy Settings Saved ✓' : 'Save Privacy Rules'}
                variant="primary"
                onPress={handleSavePrivacy}
                loading={savingPrivacy}
                style={{ marginTop: Spacing.sm }}
              />
            </View>
          </View>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 3: NOTIFICATIONS
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'notifications' && (
          <View>
            {/* Email Alerts */}
            <View style={styles.card}>
              <View style={styles.headerRow}>
                <Mail size={18} color={Colors.primaryMedium} />
                <Text style={styles.sectionTitle}>Email Notifications</Text>
              </View>

              {[
                { key: 'emailNewMatches', label: 'New Matches', sub: 'Receive emails when you have a mutual match' },
                { key: 'emailNewMessages', label: 'Direct Messages', sub: 'Receive email alerts for incoming chat messages' },
                { key: 'emailProfileViews', label: 'Profile Views', sub: 'Summary when someone views your profile' },
                { key: 'emailConnections', label: 'Connection Requests', sub: 'When someone sends you a connect request' },
                { key: 'emailPromotions', label: 'Promotions & Matrimony Tips', sub: 'Special discounts, events, and tips' },
              ].map((item, idx, arr) => (
                <View
                  key={item.key}
                  style={[styles.settingRow, idx === arr.length - 1 && { borderBottomWidth: 0 }]}
                >
                  <View style={styles.settingTextCol}>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                    <Text style={styles.settingSub}>{item.sub}</Text>
                  </View>
                  <Switch
                    value={!!(notifications as any)[item.key]}
                    onValueChange={(v) => updateNotifKey(item.key, v)}
                    trackColor={{ false: Colors.border, true: Colors.primaryMedium }}
                  />
                </View>
              ))}
            </View>

            {/* Push Alerts */}
            <View style={styles.card}>
              <View style={styles.headerRow}>
                <Bell size={18} color={Colors.primaryMedium} />
                <Text style={styles.sectionTitle}>Mobile Push Notifications</Text>
              </View>

              {[
                { key: 'pushNewMatches', label: 'New Match Alerts', sub: 'Instant notification on new mutual connections' },
                { key: 'pushNewMessages', label: 'Real-time Chat Messages', sub: 'Instant notification on chat texts & calls' },
                { key: 'pushConnections', label: 'Likes & Connects', sub: 'Instant alert when someone likes your profile' },
                { key: 'pushProfileViews', label: 'Profile Visits', sub: 'Notification when members view your profile' },
                { key: 'smsSecurity', label: 'SMS Security Alerts', sub: 'Instant Notify.lk SMS on new device logins & OTPs' },
              ].map((item, idx, arr) => (
                <View
                  key={item.key}
                  style={[styles.settingRow, idx === arr.length - 1 && { borderBottomWidth: 0 }]}
                >
                  <View style={styles.settingTextCol}>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                    <Text style={styles.settingSub}>{item.sub}</Text>
                  </View>
                  <Switch
                    value={!!(notifications as any)[item.key]}
                    onValueChange={(v) => updateNotifKey(item.key, v)}
                    trackColor={{ false: Colors.border, true: Colors.primaryMedium }}
                  />
                </View>
              ))}

              <CustomButton
                title={notifSaved ? 'Preferences Saved ✓' : 'Save Notification Preferences'}
                variant="primary"
                onPress={handleSaveNotifications}
                loading={savingNotifs}
                style={{ marginTop: Spacing.sm }}
              />
            </View>
          </View>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 4: SECURITY
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'security' && (
          <View>
            <View style={styles.card}>
              <View style={styles.headerRow}>
                <Lock size={18} color={Colors.primaryMedium} />
                <Text style={styles.sectionTitle}>Change Password</Text>
              </View>

              <CustomInput
                label="Current Password"
                isPassword
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
              />

              <CustomInput
                label="New Password"
                isPassword
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Minimum 6 characters"
              />

              <CustomInput
                label="Confirm New Password"
                isPassword
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repeat new password"
              />

              <CustomButton
                title="Update Password"
                variant="primary"
                onPress={handleUpdatePassword}
                loading={updatingPassword}
                style={{ marginTop: Spacing.xs }}
              />
            </View>

            {/* 2FA Section */}
            <View style={styles.card}>
              <View style={styles.headerRow}>
                <Shield size={18} color={Colors.primaryMedium} />
                <Text style={styles.sectionTitle}>Two-Factor Authentication (2FA)</Text>
              </View>

              <View style={styles.infoBox}>
                <Shield size={16} color={Colors.primaryMedium} style={{ marginTop: 2, marginRight: 8 }} />
                <Text style={styles.infoBoxText}>
                  Protect your account with Google Authenticator or Microsoft Authenticator TOTP codes.
                </Text>
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingTextCol}>
                  <Text style={styles.settingLabel}>MFA Protection</Text>
                  <Text style={styles.settingSub}>
                    {user?.totpEnabled ? 'Enabled & Protecting Account' : 'Currently Disabled'}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '700',
                    color: user?.totpEnabled ? '#16a34a' : Colors.textMuted,
                  }}
                >
                  {user?.totpEnabled ? 'ACTIVE ✓' : 'OFF'}
                </Text>
              </View>

              {user?.totpEnabled ? (
                <TouchableOpacity
                  style={[styles.securityActionBtn, { borderColor: '#fca5a5', backgroundColor: '#fef2f2' }]}
                  onPress={() => {
                    setTotpCodeInput('');
                    setTwoFaError('');
                    setDisableTwoFaModalVisible(true);
                  }}
                  disabled={loadingTwoFa}
                >
                  <Text style={[styles.securityActionBtnText, { color: Colors.errorRed }]}>
                    Disable 2FA Protection
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.securityActionBtn, { borderColor: Colors.primaryMedium, backgroundColor: Colors.primaryExtraLight }]}
                  onPress={handleSetup2FA}
                  disabled={loadingTwoFa}
                >
                  {loadingTwoFa ? (
                    <ActivityIndicator size="small" color={Colors.primaryMedium} />
                  ) : (
                    <Text style={[styles.securityActionBtnText, { color: Colors.primaryDark }]}>
                      Enable 2FA Protection ✦
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* Active Devices & Sessions Section */}
            <View style={styles.card}>
              <View style={styles.headerRow}>
                <Smartphone size={18} color={Colors.primaryMedium} />
                <Text style={styles.sectionTitle}>Active Devices & Sessions</Text>
              </View>

              <Text style={styles.settingSub}>
                Manage all devices currently authenticated to your SriMatch account.
              </Text>

              {loadingSessions ? (
                <View style={{ paddingVertical: Spacing.lg, alignItems: 'center' }}>
                  <ActivityIndicator size="small" color={Colors.primaryMedium} />
                  <Text style={{ fontSize: 12, color: Colors.textMuted, marginTop: 6 }}>Loading active sessions...</Text>
                </View>
              ) : sessions.length === 0 ? (
                <View style={styles.sessionItemBox}>
                  <Smartphone size={20} color={Colors.primaryMedium} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sessionItemTitle}>This Mobile Device</Text>
                    <Text style={styles.sessionItemSub}>Current active session</Text>
                  </View>
                  <View style={styles.activeNowBadge}>
                    <Text style={styles.activeNowText}>Active now</Text>
                  </View>
                </View>
              ) : (
                <View style={{ marginTop: Spacing.sm }}>
                  {sessions.map((sess, idx) => {
                    const isMobile = (sess.userAgent || '').toLowerCase().includes('mobile') || (sess.userAgent || '').toLowerCase().includes('android') || (sess.userAgent || '').toLowerCase().includes('iphone');
                    return (
                      <View key={sess.id || idx} style={styles.sessionItemBox}>
                        {isMobile ? (
                          <Smartphone size={20} color={Colors.primaryMedium} />
                        ) : (
                          <Laptop size={20} color={Colors.primaryMedium} />
                        )}
                        <View style={{ flex: 1 }}>
                          <Text style={styles.sessionItemTitle}>
                            {sess.current ? 'This Device' : (sess.userAgent ? sess.userAgent.split(' ')[0] : 'Web/Mobile Device')}
                          </Text>
                          <Text style={styles.sessionItemSub}>
                            IP: {sess.ipAddress || 'Protected'} · {sess.createdAt ? new Date(sess.createdAt).toLocaleDateString() : 'Active'}
                          </Text>
                        </View>

                        {sess.current ? (
                          <View style={styles.activeNowBadge}>
                            <Text style={styles.activeNowText}>Current</Text>
                          </View>
                        ) : (
                          <TouchableOpacity
                            style={styles.revokeSessionBtn}
                            onPress={() => handleRevokeSession(sess.id)}
                            disabled={revokingSessionId === sess.id}
                          >
                            {revokingSessionId === sess.id ? (
                              <ActivityIndicator size="small" color={Colors.errorRed} />
                            ) : (
                              <Text style={styles.revokeSessionBtnText}>Revoke</Text>
                            )}
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}

              <TouchableOpacity
                style={styles.logoutOthersBtn}
                onPress={handleRevokeAllOtherSessions}
                disabled={revokingAll}
              >
                {revokingAll ? (
                  <ActivityIndicator size="small" color={Colors.errorRed} />
                ) : (
                  <Text style={styles.logoutOthersBtnText}>Log Out From All Other Devices</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 5: MEMBERSHIP & BILLING
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'billing' && (
          <View>
            <View style={styles.card}>
              <View style={styles.headerRow}>
                <Crown size={18} color="#d4a017" />
                <Text style={styles.sectionTitle}>Current Plan</Text>
              </View>

              <LinearGradient
                colors={isPremium ? ['#3d1f12', '#6b3526'] : ['#fdf5ee', '#f7eee9']}
                style={styles.planBanner}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.planBannerTitle, isPremium && { color: '#ffffff' }]}>
                    {isPremium ? '👑 Premium VIP Member' : 'SriMatch Free Plan'}
                  </Text>
                  <Text style={[styles.planBannerSub, isPremium && { color: '#f0ddd5' }]}>
                    {isPremium
                      ? 'Unlimited likes, voice & video calling, Porondam horoscope calculator & incognito browsing.'
                      : 'Basic profile matching with 15 free daily likes.'}
                  </Text>
                  {isPremium && user?.premiumExpiryDate && (
                    <Text style={{ fontSize: 12, color: '#e8c97a', marginTop: 6, fontWeight: '600' }}>
                      Valid until: {new Date(user.premiumExpiryDate).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              </LinearGradient>

              <View style={styles.settingRow}>
                <View style={styles.settingTextCol}>
                  <Text style={styles.settingLabel}>Available Boosts</Text>
                  <Text style={styles.settingSub}>Supercharge your visibility to 10× more suitors</Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.primaryMedium }}>
                  {user?.boostCount || 0}
                </Text>
              </View>

              <CustomButton
                title={isPremium ? 'Manage Membership & Boosts' : 'Upgrade to Premium VIP ✦'}
                variant="primary"
                onPress={() => router.push('/(tabs)/premium')}
                style={{ marginTop: Spacing.md }}
              />
            </View>
          </View>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 6: HELP & SUPPORT
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'help' && (
          <View>
            <View style={styles.card}>
              <View style={styles.headerRow}>
                <HelpCircle size={18} color={Colors.primaryMedium} />
                <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
              </View>

              {[
                {
                  q: 'How does horoscope matching work?',
                  a: 'We evaluate birth charts based on the 20 Ashtakoot Porondam system with traditional Sri Lankan astrology calculation.',
                },
                {
                  q: 'How do I earn the verified trusted badge?',
                  a: 'Submit your NIC or passport along with a quick selfie under the Verification tab.',
                },
                {
                  q: 'Is my phone number kept confidential?',
                  a: 'Yes. Your phone number is verified via Notify.lk SMS and is never shown publicly unless you explicitly share it with an accepted match.',
                },
              ].map((faq, i) => (
                <View key={i} style={styles.faqCard}>
                  <Text style={styles.faqQ}>{faq.q}</Text>
                  <Text style={styles.faqA}>{faq.a}</Text>
                </View>
              ))}

              <CustomButton
                title="Open Help Center & Support Tickets"
                variant="outline"
                onPress={() => router.push('/help')}
                style={{ marginTop: Spacing.sm }}
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* ── SMS OTP Verification Modal (Notify.lk) ── */}
      <Modal
        visible={otpModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setOtpModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconWrap}>
              <Phone size={24} color={Colors.primaryMedium} />
            </View>

            <Text style={styles.modalTitle}>Verify Mobile Number</Text>
            <Text style={styles.modalSub}>
              We sent a 6-digit verification code to <Text style={{ fontWeight: '700' }}>{phoneNumber}</Text> via Notify.lk SMS Gateway.
            </Text>

            <TextInput
              style={styles.modalOtpInput}
              value={otpCode}
              onChangeText={setOtpCode}
              placeholder="000000"
              placeholderTextColor={Colors.textLight}
              keyboardType="number-pad"
              maxLength={6}
            />

            {otpError ? <Text style={styles.modalError}>{otpError}</Text> : null}

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: Colors.border }]}
                onPress={() => setOtpModalVisible(false)}
              >
                <Text style={[styles.modalBtnText, { color: Colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: Colors.primaryMedium }]}
                onPress={handleVerifyPhoneOtp}
                disabled={verifyingOtp}
              >
                {verifyingOtp ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={[styles.modalBtnText, { color: '#ffffff' }]}>Confirm Code</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── 2FA Setup Modal ── */}
      <Modal
        visible={twoFaModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTwoFaModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconWrap}>
              <ShieldCheck size={26} color={Colors.primaryMedium} />
            </View>

            <Text style={styles.modalTitle}>Set Up 2-Factor Auth</Text>
            <Text style={styles.modalSub}>
              Enter this Secret Key into Google Authenticator or Microsoft Authenticator, then input the generated 6-digit code below:
            </Text>

            {twoFaSecretData?.secret ? (
              <View style={styles.secretKeyBox}>
                <Text style={styles.secretKeyLabel}>AUTHENTICATOR SECRET KEY</Text>
                <Text style={styles.secretKeyText} selectable>{twoFaSecretData.secret}</Text>
              </View>
            ) : null}

            <TextInput
              style={styles.modalOtpInput}
              value={totpCodeInput}
              onChangeText={setTotpCodeInput}
              placeholder="000000"
              placeholderTextColor={Colors.textLight}
              keyboardType="number-pad"
              maxLength={6}
            />

            {twoFaError ? <Text style={styles.modalError}>{twoFaError}</Text> : null}

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: Colors.border }]}
                onPress={() => setTwoFaModalVisible(false)}
              >
                <Text style={[styles.modalBtnText, { color: Colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: Colors.primaryMedium }]}
                onPress={handleConfirm2FA}
                disabled={loadingTwoFa}
              >
                {loadingTwoFa ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={[styles.modalBtnText, { color: '#ffffff' }]}>Enable 2FA</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── 2FA Disable Modal ── */}
      <Modal
        visible={disableTwoFaModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDisableTwoFaModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[styles.modalIconWrap, { backgroundColor: '#fee2e2' }]}>
              <AlertTriangle size={24} color={Colors.errorRed} />
            </View>

            <Text style={styles.modalTitle}>Disable 2-Factor Auth</Text>
            <Text style={styles.modalSub}>
              Enter your current 6-digit TOTP authenticator code to confirm turning off 2FA protection:
            </Text>

            <TextInput
              style={styles.modalOtpInput}
              value={totpCodeInput}
              onChangeText={setTotpCodeInput}
              placeholder="000000"
              placeholderTextColor={Colors.textLight}
              keyboardType="number-pad"
              maxLength={6}
            />

            {twoFaError ? <Text style={styles.modalError}>{twoFaError}</Text> : null}

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: Colors.border }]}
                onPress={() => setDisableTwoFaModalVisible(false)}
              >
                <Text style={[styles.modalBtnText, { color: Colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: Colors.errorRed }]}
                onPress={handleDisable2FA}
                disabled={loadingTwoFa}
              >
                {loadingTwoFa ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={[styles.modalBtnText, { color: '#ffffff' }]}>Turn Off 2FA</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabBarWrap: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 8,
  },
  tabBarScroll: {
    paddingHorizontal: Spacing.base,
    gap: 8,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSoft,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tabBtnActive: {
    backgroundColor: Colors.primaryMedium,
    borderColor: Colors.primaryMedium,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabBtnTextActive: {
    color: '#ffffff',
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxl,
    padding: Spacing.lg,
    marginBottom: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: Fonts?.serif || 'serif',
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedBadgeText: {
    fontSize: 11,
    color: '#16a34a',
    fontWeight: '600',
  },
  unverifiedText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  phoneInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    backgroundColor: Colors.surfaceSoft,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.text,
  },
  verifySmsBtn: {
    backgroundColor: Colors.primaryExtraLight,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifySmsBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryMedium,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  settingTextCol: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingLabel: {
    fontSize: 13.5,
    fontWeight: '600',
    color: Colors.text,
  },
  settingSub: {
    fontSize: 11.5,
    color: Colors.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: Spacing.md,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceSoft,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: Colors.primaryMedium,
    borderColor: Colors.primaryMedium,
  },
  segmentBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  segmentBtnTextActive: {
    color: '#ffffff',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  infoBoxText: {
    flex: 1,
    fontSize: 12,
    color: '#1e40af',
    lineHeight: 18,
  },
  securityActionBtn: {
    borderWidth: 1.5,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  securityActionBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  sessionItemBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surfaceSoft,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  sessionItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  sessionItemSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  activeNowBadge: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  activeNowText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#16a34a',
  },
  revokeSessionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  revokeSessionBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.errorRed,
  },
  logoutOthersBtn: {
    paddingVertical: 8,
    marginTop: Spacing.xs,
  },
  logoutOthersBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.errorRed,
    textAlign: 'center',
  },
  secretKeyBox: {
    backgroundColor: Colors.surfaceSoft,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    width: '100%',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  secretKeyLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  secretKeyText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primaryDark,
    letterSpacing: 2,
  },
  planBanner: {
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    marginBottom: Spacing.md,
  },
  planBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  planBannerSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  faqCard: {
    backgroundColor: Colors.surfaceSoft,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primaryMedium,
    marginBottom: 8,
  },
  faqQ: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 3,
  },
  faqA: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  dangerSub: {
    fontSize: 12.5,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxl,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  modalIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryExtraLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  modalSub: {
    fontSize: 12.5,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.lg,
  },
  modalOtpInput: {
    width: '80%',
    backgroundColor: Colors.surfaceSoft,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.xl,
    paddingVertical: 12,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 6,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  modalError: {
    fontSize: 12,
    color: Colors.errorRed,
    marginBottom: Spacing.md,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
