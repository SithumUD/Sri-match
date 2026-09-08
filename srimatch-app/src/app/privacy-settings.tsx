import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Shield,
  Eye,
  Camera,
  MapPin,
  MessageCircle,
  Lock,
  CheckCircle2,
  Sliders,
} from 'lucide-react-native';
import { Colors, Fonts, Spacing, Radius, Shadows } from '../constants/theme';
import { CustomButton } from '../components/ui/CustomButton';
import { ProfileService } from '../services';
import useAuthStore from '../store/useAuthStore';
import { DEFAULT_PRIVACY_SETTINGS } from '../constants/profileEnums';

export default function PrivacySettingsScreen() {
  const router = useRouter();
  const { user, refreshProfile } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [settings, setSettings] = useState({
    ...DEFAULT_PRIVACY_SETTINGS,
    ...(user?.privacySettings || {}),
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await ProfileService.getMyProfile();
      if (res?.data?.privacySettings) {
        setSettings({
          ...DEFAULT_PRIVACY_SETTINGS,
          ...res.data.privacySettings,
        });
      }
    } catch (e) {
      // Use cached user settings if available
      if (user?.privacySettings) {
        setSettings({
          ...DEFAULT_PRIVACY_SETTINGS,
          ...user.privacySettings,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const updateKey = (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
    setSavedSuccess(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await ProfileService.updateProfile({ privacySettings: settings });
      await refreshProfile();
      setSavedSuccess(true);
      Alert.alert('Privacy Saved', 'Your privacy and visibility settings have been updated successfully.');
    } catch (e: any) {
      Alert.alert('Update Failed', e?.response?.data?.message || 'Could not update privacy settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primaryMedium} />
        <Text style={styles.loadingText}>Loading privacy settings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#9B2C2C', '#DD6B20']} style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy & Visibility</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.headerSubtitle}>
          Control who can see your profile, photos, location, and sensitive information.
        </Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {savedSuccess && (
          <View style={styles.successBanner}>
            <CheckCircle2 size={18} color="#16a34a" />
            <Text style={styles.successBannerText}>Privacy preferences updated!</Text>
          </View>
        )}

        {/* SECTION 1: PROFILE VISIBILITY */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconWrap}>
              <Eye size={18} color={Colors.primaryMedium} />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Profile Visibility</Text>
              <Text style={styles.sectionSub}>Who can discover and view your profile</Text>
            </View>
          </View>

          {/* Visibility selector */}
          <Text style={styles.fieldLabel}>Who can view my profile</Text>
          <View style={styles.segmentRow}>
            {[
              { key: 'EVERYONE', label: 'Everyone' },
              { key: 'VERIFIED_ONLY', label: 'Verified Only' },
              { key: 'CONNECTIONS_ONLY', label: 'Matches Only' },
            ].map((opt) => {
              const active = settings.profileVisibility === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.segmentBtn, active && styles.segmentBtnActive]}
                  onPress={() => updateKey('profileVisibility', opt.key)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.segmentBtnText, active && styles.segmentBtnTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.divider} />

          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Show in Search Results</Text>
              <Text style={styles.switchSubtitle}>Allow members to find you via filters and discover feed</Text>
            </View>
            <Switch
              value={Boolean(settings.showInSearchResults)}
              onValueChange={(val) => updateKey('showInSearchResults', val)}
              trackColor={{ false: '#e2e8f0', true: Colors.primaryLight }}
              thumbColor={settings.showInSearchResults ? Colors.primaryMedium : '#f8fafc'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Verified Members Only</Text>
              <Text style={styles.switchSubtitle}>Only verified profiles can see my full information</Text>
            </View>
            <Switch
              value={Boolean(settings.visibleToVerifiedOnly)}
              onValueChange={(val) => updateKey('visibleToVerifiedOnly', val)}
              trackColor={{ false: '#e2e8f0', true: Colors.primaryLight }}
              thumbColor={settings.visibleToVerifiedOnly ? Colors.primaryMedium : '#f8fafc'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Incognito Browsing</Text>
              <Text style={styles.switchSubtitle}>Browse profiles without appearing in "Recently Viewed"</Text>
            </View>
            <Switch
              value={Boolean(settings.incognitoMode)}
              onValueChange={(val) => updateKey('incognitoMode', val)}
              trackColor={{ false: '#e2e8f0', true: Colors.primaryLight }}
              thumbColor={settings.incognitoMode ? Colors.primaryMedium : '#f8fafc'}
            />
          </View>
        </View>

        {/* SECTION 2: PHOTO PRIVACY */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconWrap}>
              <Camera size={18} color={Colors.primaryMedium} />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Photo Privacy</Text>
              <Text style={styles.sectionSub}>Protect your images and appearance</Text>
            </View>
          </View>

          <Text style={styles.fieldLabel}>Photo Visibility</Text>
          <View style={styles.segmentRow}>
            {[
              { key: 'PUBLIC', label: 'Public' },
              { key: 'BLURRED_UNTIL_MATCH', label: 'Blur Until Match' },
              { key: 'CONNECTIONS_ONLY', label: 'Matches Only' },
            ].map((opt) => {
              const active = settings.photoVisibility === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.segmentBtn, active && styles.segmentBtnActive]}
                  onPress={() => updateKey('photoVisibility', opt.key)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.segmentBtnText, active && styles.segmentBtnTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.divider} />

          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Watermark Photos</Text>
              <Text style={styles.switchSubtitle}>Display a subtle SriMatch watermark to deter screenshot misuse</Text>
            </View>
            <Switch
              value={Boolean(settings.watermarkPhotos)}
              onValueChange={(val) => updateKey('watermarkPhotos', val)}
              trackColor={{ false: '#e2e8f0', true: Colors.primaryLight }}
              thumbColor={settings.watermarkPhotos ? Colors.primaryMedium : '#f8fafc'}
            />
          </View>
        </View>

        {/* SECTION 3: LOCATION & ACTIVITY */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconWrap}>
              <MapPin size={18} color={Colors.primaryMedium} />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Location & Activity</Text>
              <Text style={styles.sectionSub}>Manage location accuracy and active indicators</Text>
            </View>
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Show City Location</Text>
              <Text style={styles.switchSubtitle}>Show your city (e.g. Colombo) instead of just "Sri Lanka"</Text>
            </View>
            <Switch
              value={Boolean(settings.showExactLocation)}
              onValueChange={(val) => updateKey('showExactLocation', val)}
              trackColor={{ false: '#e2e8f0', true: Colors.primaryLight }}
              thumbColor={settings.showExactLocation ? Colors.primaryMedium : '#f8fafc'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Show Distance</Text>
              <Text style={styles.switchSubtitle}>Display approximate km distance to prospective matches</Text>
            </View>
            <Switch
              value={Boolean(settings.showDistance)}
              onValueChange={(val) => updateKey('showDistance', val)}
              trackColor={{ false: '#e2e8f0', true: Colors.primaryLight }}
              thumbColor={settings.showDistance ? Colors.primaryMedium : '#f8fafc'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Online Status Indicator</Text>
              <Text style={styles.switchSubtitle}>Show a green active dot when you are currently online</Text>
            </View>
            <Switch
              value={Boolean(settings.showOnlineStatus)}
              onValueChange={(val) => updateKey('showOnlineStatus', val)}
              trackColor={{ false: '#e2e8f0', true: Colors.primaryLight }}
              thumbColor={settings.showOnlineStatus ? Colors.primaryMedium : '#f8fafc'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Show Last Active Time</Text>
              <Text style={styles.switchSubtitle}>Allow members to see when you were last active</Text>
            </View>
            <Switch
              value={Boolean(settings.showLastActive)}
              onValueChange={(val) => updateKey('showLastActive', val)}
              trackColor={{ false: '#e2e8f0', true: Colors.primaryLight }}
              thumbColor={settings.showLastActive ? Colors.primaryMedium : '#f8fafc'}
            />
          </View>
        </View>

        {/* SECTION 4: COMMUNICATION & MESSAGING */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconWrap}>
              <MessageCircle size={18} color={Colors.primaryMedium} />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Communication & Messaging</Text>
              <Text style={styles.sectionSub}>Controls on incoming conversations</Text>
            </View>
          </View>

          <Text style={styles.fieldLabel}>Who can initiate a message</Text>
          <View style={styles.segmentRow}>
            {[
              { key: 'MATCHED_MEMBERS_ONLY', label: 'Mutual Matches Only' },
              { key: 'PREMIUM_MEMBERS', label: 'Premium Members' },
              { key: 'EVERYONE', label: 'Everyone' },
            ].map((opt) => {
              const active = settings.whoCanMessage === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.segmentBtn, active && styles.segmentBtnActive]}
                  onPress={() => updateKey('whoCanMessage', opt.key)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.segmentBtnText, active && styles.segmentBtnTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.divider} />

          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Read Receipts</Text>
              <Text style={styles.switchSubtitle}>Let chat partners know when you have read their messages</Text>
            </View>
            <Switch
              value={Boolean(settings.readReceipts)}
              onValueChange={(val) => updateKey('readReceipts', val)}
              trackColor={{ false: '#e2e8f0', true: Colors.primaryLight }}
              thumbColor={settings.readReceipts ? Colors.primaryMedium : '#f8fafc'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Require Match for Contact Info</Text>
              <Text style={styles.switchSubtitle}>Hide phone and email until both members mutually connect</Text>
            </View>
            <Switch
              value={Boolean(settings.requireMatchForContactInfo)}
              onValueChange={(val) => updateKey('requireMatchForContactInfo', val)}
              trackColor={{ false: '#e2e8f0', true: Colors.primaryLight }}
              thumbColor={settings.requireMatchForContactInfo ? Colors.primaryMedium : '#f8fafc'}
            />
          </View>
        </View>

        {/* SECTION 5: SENSITIVE INFORMATION */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconWrap}>
              <Lock size={18} color={Colors.primaryMedium} />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Sensitive Details & Quiz</Text>
              <Text style={styles.sectionSub}>Choose which profile sections are visible to other members</Text>
            </View>
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Show Annual Income Range</Text>
              <Text style={styles.switchSubtitle}>Display your salary bracket publicly on your background card</Text>
            </View>
            <Switch
              value={Boolean(settings.showIncomeRange)}
              onValueChange={(val) => updateKey('showIncomeRange', val)}
              trackColor={{ false: '#e2e8f0', true: Colors.primaryLight }}
              thumbColor={settings.showIncomeRange ? Colors.primaryMedium : '#f8fafc'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Show Family Background Details</Text>
              <Text style={styles.switchSubtitle}>Display family type, involvement and background</Text>
            </View>
            <Switch
              value={Boolean(settings.showFamilyDetails)}
              onValueChange={(val) => updateKey('showFamilyDetails', val)}
              trackColor={{ false: '#e2e8f0', true: Colors.primaryLight }}
              thumbColor={settings.showFamilyDetails ? Colors.primaryMedium : '#f8fafc'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Show Partner Preferences</Text>
              <Text style={styles.switchSubtitle}>Let visitors see your specific criteria and dealbreakers</Text>
            </View>
            <Switch
              value={Boolean(settings.showPartnerPreferences)}
              onValueChange={(val) => updateKey('showPartnerPreferences', val)}
              trackColor={{ false: '#e2e8f0', true: Colors.primaryLight }}
              thumbColor={settings.showPartnerPreferences ? Colors.primaryMedium : '#f8fafc'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Show Compatibility Quiz Answers</Text>
              <Text style={styles.switchSubtitle}>Display your quiz responses and highlight mutual answers</Text>
            </View>
            <Switch
              value={Boolean(settings.showQuizAnswers)}
              onValueChange={(val) => updateKey('showQuizAnswers', val)}
              trackColor={{ false: '#e2e8f0', true: Colors.primaryLight }}
              thumbColor={settings.showQuizAnswers ? Colors.primaryMedium : '#f8fafc'}
            />
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.saveBtnContainer}>
          <CustomButton
            title={saving ? 'Saving Preferences...' : 'Save Privacy Settings'}
            variant="primary"
            loading={saving}
            onPress={handleSave}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf8f4',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fdf8f4',
    padding: Spacing.base,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 15,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  headerGradient: {
    paddingTop: 52,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.base,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.88)',
    marginTop: 4,
    lineHeight: 18,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: 60,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.base,
  },
  successBannerText: {
    fontSize: 14,
    color: '#166534',
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    borderWidth: 1,
    borderColor: '#f0ddd5',
    ...Shadows.card,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fdf0e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d1810',
  },
  sectionSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
    marginTop: Spacing.xs,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: Spacing.md,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: Radius.sm,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: {
    backgroundColor: '#fdf0e8',
    borderColor: Colors.primaryMedium,
  },
  segmentBtnText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textMuted,
    textAlign: 'center',
  },
  segmentBtnTextActive: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: Spacing.sm,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  switchTextCol: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d1810',
  },
  switchSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  saveBtnContainer: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
});
