import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Colors, Fonts, Spacing, Radius } from '../constants/theme';
import { GradientHeader } from '../components/ui/GradientHeader';
import { CustomInput } from '../components/ui/CustomInput';
import { CustomButton } from '../components/ui/CustomButton';
import AuthService from '../services/auth.service';
import { Lock, Bell, Shield, Trash2 } from 'lucide-react-native';
import useAuthStore from '../store/useAuthStore';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const [matchNotifications, setMatchNotifications] = useState(true);
  const [chatNotifications, setChatNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      Alert.alert('Error', 'Please fill in current and new password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await AuthService.updatePassword({ oldPassword, newPassword });
      Alert.alert('Success 🔒', 'Password changed successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Could not change password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your SriMatch account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Forever',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <GradientHeader title="Settings" subtitle="Account preferences & privacy" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Notifications Section */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Bell size={18} color={Colors.primaryMedium} />
            <Text style={styles.sectionTitle}>Notifications</Text>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingLabel}>New Match Alerts</Text>
              <Text style={styles.settingSub}>Get notified when someone connects or likes you</Text>
            </View>
            <Switch
              value={matchNotifications}
              onValueChange={setMatchNotifications}
              trackColor={{ false: Colors.border, true: Colors.primaryMedium }}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingLabel}>Chat Messages</Text>
              <Text style={styles.settingSub}>Real-time notifications for incoming messages</Text>
            </View>
            <Switch
              value={chatNotifications}
              onValueChange={setChatNotifications}
              trackColor={{ false: Colors.border, true: Colors.primaryMedium }}
            />
          </View>

          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingLabel}>Email Summaries</Text>
              <Text style={styles.settingSub}>Receive weekly match recommendations by email</Text>
            </View>
            <Switch
              value={emailAlerts}
              onValueChange={setEmailAlerts}
              trackColor={{ false: Colors.border, true: Colors.primaryMedium }}
            />
          </View>
        </View>

        {/* Change Password Section */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Lock size={18} color={Colors.primaryMedium} />
            <Text style={styles.sectionTitle}>Change Password</Text>
          </View>

          <CustomInput
            label="Current Password"
            isPassword
            value={oldPassword}
            onChangeText={setOldPassword}
          />

          <CustomInput
            label="New Password"
            isPassword
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <CustomInput
            label="Confirm New Password"
            isPassword
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <CustomButton
            title="Update Password"
            variant="primary"
            onPress={handleChangePassword}
            loading={loading}
            style={{ marginTop: Spacing.xs }}
          />
        </View>

        {/* Danger Zone */}
        <View style={[styles.card, { borderColor: '#fca5a5' }]}>
          <View style={styles.headerRow}>
            <Trash2 size={18} color={Colors.errorRed} />
            <Text style={[styles.sectionTitle, { color: Colors.errorRed }]}>Danger Zone</Text>
          </View>

          <Text style={styles.dangerSub}>
            Deleting your account will remove your profile, photos, and match history permanently.
          </Text>

          <CustomButton
            title="Delete Account"
            variant="danger"
            onPress={handleDeleteAccount}
            style={{ marginTop: Spacing.sm }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
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
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  settingSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  dangerSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: Spacing.sm,
  },
});
