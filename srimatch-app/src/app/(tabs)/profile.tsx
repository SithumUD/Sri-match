import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Spacing, Radius, Shadows } from '../../constants/theme';
import { GradientHeader } from '../../components/ui/GradientHeader';
import { Badge } from '../../components/ui/Badge';
import {
  User,
  ShieldCheck,
  Crown,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Sparkles,
  Edit3,
  Heart,
  Eye,
  CheckCircle2,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import useAuthStore from '../../store/useAuthStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, refreshProfile } = useAuthStore();

  useEffect(() => {
    refreshProfile();
  }, []);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of SriMatch?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const imageUri =
    user?.primaryImageUrl ||
    (Array.isArray(user?.profileImages) && user.profileImages[0]) ||
    user?.profileImage ||
    user?.profileImageUrl ||
    (Array.isArray(user?.images) && (user.images[0]?.imageUrl || user.images[0])) ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';

  const isVerified = Boolean(user?.verified || user?.isVerified || user?.idVerified);
  const isPremium = Boolean(
    user?.premium ||
    user?.isPremium ||
    user?.subscription?.plan === 'premium' ||
    user?.subscription?.plan === 'PRO' ||
    user?.subscription?.plan === 'VIP' ||
    user?.role === 'PREMIUM'
  );

  const completionScore = user?.completionScore || user?.profileCompletionScore || 85;

  return (
    <View style={styles.container}>
      <GradientHeader title="My Profile" subtitle="Manage your account & identity" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card Header */}
        <View style={styles.profileCard}>
          <View style={styles.avatarRow}>
            {/* Clean Circular Frame without Camera Icon */}
            <View style={styles.circularAvatarFrame}>
              <Image source={{ uri: imageUri }} style={styles.avatar} resizeMode="cover" />
            </View>

            <View style={styles.userMainInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName} numberOfLines={1}>
                  {user?.firstName || 'Member'} {user?.lastName || ''}
                </Text>
              </View>

              <Text style={styles.userMeta}>
                {user?.age ? `${user.age} yrs · ` : ''}
                {user?.profession || 'Professional'}
              </Text>
              <Text style={styles.userLocation}>
                {user?.district || user?.city || 'Colombo'}, Sri Lanka
              </Text>

              <View style={styles.badgeRow}>
                {isVerified ? (
                  <View style={styles.verifiedBadgePill}>
                    <ShieldCheck size={12} color="#ffffff" />
                    <Text style={styles.verifiedBadgeText}>Verified</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.getVerifiedBtn}
                    onPress={() => router.push('/verification')}
                    activeOpacity={0.7}
                  >
                    <ShieldCheck size={12} color={Colors.primaryMedium} />
                    <Text style={styles.getVerifiedText}>Get Verified</Text>
                  </TouchableOpacity>
                )}

                {isPremium ? (
                  <View style={styles.premiumBadgePill}>
                    <Crown size={12} color="#ffffff" />
                    <Text style={styles.premiumBadgeText}>Premium</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.upgradeBadge}
                    onPress={() => router.push('/(tabs)/premium')}
                    activeOpacity={0.7}
                  >
                    <Crown size={12} color={Colors.primaryDark} />
                    <Text style={styles.upgradeText}>Free Plan</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* Profile Completion Bar */}
          <View style={styles.completionBox}>
            <View style={styles.completionHeader}>
              <Text style={styles.completionLabel}>Profile Strength</Text>
              <Text style={styles.completionPercent}>{completionScore}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${completionScore}%` }]} />
            </View>
          </View>
        </View>

        {/* Quick Actions / Shortcuts Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.menuHeading}>Profile & Trust</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/edit-profile')}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconWrap}>
              <Edit3 size={18} color={Colors.primaryMedium} />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuItemTitle}>Edit Profile Details</Text>
              <Text style={styles.menuItemSub}>Photos, bio, lifestyle & partner preferences</Text>
            </View>
            <ChevronRight size={18} color={Colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/verification')}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: isVerified ? '#f0fdf4' : '#fdf5ee' }]}>
              <ShieldCheck size={18} color={isVerified ? '#16a34a' : Colors.primaryMedium} />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuItemTitle}>Identity Verification</Text>
              <Text style={styles.menuItemSub}>
                {isVerified ? 'Government ID & Selfie Authenticated ✓' : 'Upload NIC / Passport to earn trusted tick'}
              </Text>
            </View>
            <ChevronRight size={18} color={Colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(tabs)/premium')}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: '#fdf0e8' }]}>
              <Crown size={18} color="#d4a017" />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuItemTitle}>Membership & Subscription</Text>
              <Text style={styles.menuItemSub}>
                {isPremium ? 'Active Premium Plan details & boosts' : 'Upgrade for unlimited likes & star likes'}
              </Text>
            </View>
            <ChevronRight size={18} color={Colors.textLight} />
          </TouchableOpacity>
        </View>

        {/* App Settings & Safety */}
        <View style={styles.menuSection}>
          <Text style={styles.menuHeading}>Preferences & Support</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/settings')}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconWrap}>
              <Settings size={18} color={Colors.textMuted} />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuItemTitle}>Account Settings</Text>
              <Text style={styles.menuItemSub}>Notifications, security & privacy</Text>
            </View>
            <ChevronRight size={18} color={Colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/help')}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconWrap}>
              <HelpCircle size={18} color={Colors.textMuted} />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuItemTitle}>Help & Support</Text>
              <Text style={styles.menuItemSub}>FAQs, contact team & safety rules</Text>
            </View>
            <ChevronRight size={18} color={Colors.textLight} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
          <LogOut size={18} color="#dc2626" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf8f4',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  profileCard: {
    margin: Spacing.base,
    backgroundColor: '#ffffff',
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: '#f0ddd5',
    ...Shadows.card,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  circularAvatarFrame: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fdf0e8',
    overflow: 'hidden',
    backgroundColor: '#f5ede8',
    ...Shadows.subtle,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  userMainInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d1810',
  },
  userMeta: {
    fontSize: 13,
    color: '#6b4a3a',
    fontWeight: '500',
  },
  userLocation: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
  },
  verifiedBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#16a34a',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  verifiedBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  getVerifiedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fdf5ee',
    borderWidth: 1,
    borderColor: '#f0ddd5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  getVerifiedText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primaryMedium,
  },
  premiumBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#d4a017',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  premiumBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  upgradeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fef8e2',
    borderWidth: 1,
    borderColor: '#e8c97a',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  upgradeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#d4a017',
  },
  completionBox: {
    backgroundColor: '#fdf8f4',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#f0ddd5',
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  completionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4a3028',
  },
  completionPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryMedium,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#e8ddd8',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primaryMedium,
    borderRadius: 3,
  },
  menuSection: {
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.base,
    backgroundColor: '#ffffff',
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: '#f0ddd5',
    ...Shadows.card,
  },
  menuHeading: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: Colors.primaryMedium,
    marginBottom: Spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#faf3ef',
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fdf5ee',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  menuTextWrap: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d1810',
  },
  menuItemSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.xxl,
    paddingVertical: 14,
    borderRadius: Radius.full,
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  logoutText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '700',
  },
});
