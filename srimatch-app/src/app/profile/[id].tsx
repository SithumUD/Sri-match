import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Spacing, Radius, Shadows } from '../../constants/theme';
import { usePublicProfile } from '../../hooks/useProfiles';
import { useToggleLike, useSentLikes, useConnections } from '../../hooks/useLikes';
import { ReportService } from '../../services';
import {
  ArrowLeft,
  Heart,
  Star,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  BookOpen,
  Coffee,
  Activity,
  ShieldCheck,
  Flag,
  MessageCircle,
  User,
  Languages,
  Home,
  CheckCircle2,
  Lock,
  Target,
  Sparkle,
} from 'lucide-react-native';
import { Badge } from '../../components/ui/Badge';
import { CustomButton } from '../../components/ui/CustomButton';

const { width } = Dimensions.get('window');

type ProfileTab = 'about' | 'details' | 'lifestyle' | 'interests' | 'preferences';

export default function UserProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data: profile, isLoading } = usePublicProfile(id as string);
  const { data: sentLikes = [] } = useSentLikes();
  const { data: connectionsOverview } = useConnections();
  const { mutate: mutateToggleLike } = useToggleLike();

  const [activeTab, setActiveTab] = useState<ProfileTab>('about');
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const interaction = sentLikes.find(
    (l: any) => Number(l.profileId || l.userId) === Number(id)
  );
  const isLiked = (profile?.interactionType === 'NORMAL') || (interaction?.type === 'NORMAL');
  const isStarred = (profile?.interactionType === 'STAR') || (interaction?.type === 'STAR');

  const matches = connectionsOverview?.matches || [];
  const isMatched = matches.some(
    (m: any) =>
      Number(m.user1?.id) === Number(id) ||
      Number(m.user2?.id) === Number(id) ||
      Number(m.matchedUser?.id) === Number(id) ||
      profile?.interactionStatus === 'ACCEPTED'
  );

  // Parse photos safely from profileImages array, primaryImageUrl, or fallback
  const images: string[] =
    Array.isArray(profile?.profileImages) && profile.profileImages.length > 0
      ? profile.profileImages
      : Array.isArray(profile?.images) && profile.images.length > 0
      ? profile.images.map((img: any) => (typeof img === 'string' ? img : img.imageUrl || img.url))
      : [profile?.primaryImageUrl || profile?.profileImage || profile?.profileImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'];

  const handleLike = (type: 'NORMAL' | 'STAR') => {
    if (!profile?.id) return;
    mutateToggleLike({ profileId: profile.id, type });
  };

  const handleReport = () => {
    Alert.alert(
      'Report Profile',
      'If you notice inappropriate behavior or false identity, please select a reason:',
      [
        { text: 'Inappropriate Content', onPress: () => sendReport('INAPPROPRIATE_CONTENT') },
        { text: 'Fake Profile / Impersonation', onPress: () => sendReport('FAKE_PROFILE') },
        { text: 'Scam or Solicitation', onPress: () => sendReport('SCAM_OR_FRAUD') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const sendReport = async (reason: string) => {
    try {
      if (profile?.id) await ReportService.reportProfile(profile.id, reason);
      Alert.alert('Report Received', 'Thank you. Our safety moderation team will review this profile promptly.');
    } catch (e: any) {
      Alert.alert('Report Received', 'Thank you. Our moderation team has been notified.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primaryMedium} />
        <Text style={styles.loadingText}>Loading member profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Profile Not Found</Text>
        <Text style={styles.errorSub}>The requested member profile could not be loaded.</Text>
        <CustomButton title="Go Back" variant="primary" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Gallery Hero */}
        <View style={styles.galleryWrapper}>
          <Image
            source={{ uri: images[activeImageIdx] || images[0] }}
            style={styles.galleryImage}
            resizeMode="cover"
          />
          <LinearGradient colors={['rgba(20,6,2,0.6)', 'transparent', 'rgba(20,6,2,0.85)'] as any} style={styles.galleryOverlay} />

          {/* Floating Action Buttons on Hero */}
          <TouchableOpacity style={styles.backFloatingBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.reportFloatingBtn} onPress={handleReport}>
            <Flag size={18} color="#fff" />
          </TouchableOpacity>

          {/* Photo Counter */}
          {images.length > 1 && (
            <View style={styles.counterBadge}>
              <Text style={styles.counterText}>
                {activeImageIdx + 1} / {images.length}
              </Text>
            </View>
          )}

          {/* Identity Info on Image Overlay */}
          <View style={styles.heroIdentity}>
            <View style={styles.nameBadgeRow}>
              <Text style={styles.heroName}>
                {profile.firstName} {profile.lastName || ''}{profile.age ? `, ${profile.age}` : ''}
              </Text>
              {(profile.verified || profile.isVerified) && (
                <View style={styles.verifiedPill}>
                  <ShieldCheck size={12} color="#fff" />
                  <Text style={styles.verifiedPillText}>Verified</Text>
                </View>
              )}
            </View>

            <View style={styles.heroMetaRow}>
              <View style={styles.heroMetaItem}>
                <MapPin size={13} color="#fff" />
                <Text style={styles.heroMetaText}>
                  {profile.city || profile.district || 'Sri Lanka'}
                </Text>
              </View>
              {profile.profession ? (
                <View style={styles.heroMetaItem}>
                  <Briefcase size={13} color="#fff" />
                  <Text style={styles.heroMetaText}>{profile.profession}</Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* Gallery Dots */}
          {images.length > 1 && (
            <View style={styles.galleryDots}>
              {images.map((_: any, i: number) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setActiveImageIdx(i)}
                  style={[styles.galleryDot, activeImageIdx === i && styles.activeGalleryDot]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Compatibility Ribbon */}
        {profile.compatibilityScore ? (
          <LinearGradient colors={['#fdf5ee', '#f7ebe1'] as any} style={styles.compatRibbon}>
            <Sparkles size={16} color={Colors.primaryDark} />
            <Text style={styles.compatText}>
              <Text style={{ fontWeight: '700' }}>{profile.compatibilityScore}% Match</Text> with your lifestyle & values
            </Text>
          </LinearGradient>
        ) : null}

        {/* Tab Navigation */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'about' && styles.activeTabBtn]}
              onPress={() => setActiveTab('about')}
            >
              <User size={14} color={activeTab === 'about' ? Colors.primaryDark : Colors.textMuted} />
              <Text style={[styles.tabBtnText, activeTab === 'about' && styles.activeTabBtnText]}>About</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'details' && styles.activeTabBtn]}
              onPress={() => setActiveTab('details')}
            >
              <BookOpen size={14} color={activeTab === 'details' ? Colors.primaryDark : Colors.textMuted} />
              <Text style={[styles.tabBtnText, activeTab === 'details' && styles.activeTabBtnText]}>Background</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'lifestyle' && styles.activeTabBtn]}
              onPress={() => setActiveTab('lifestyle')}
            >
              <Activity size={14} color={activeTab === 'lifestyle' ? Colors.primaryDark : Colors.textMuted} />
              <Text style={[styles.tabBtnText, activeTab === 'lifestyle' && styles.activeTabBtnText]}>Lifestyle</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'interests' && styles.activeTabBtn]}
              onPress={() => setActiveTab('interests')}
            >
              <Sparkles size={14} color={activeTab === 'interests' ? Colors.primaryDark : Colors.textMuted} />
              <Text style={[styles.tabBtnText, activeTab === 'interests' && styles.activeTabBtnText]}>Interests</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'preferences' && styles.activeTabBtn]}
              onPress={() => setActiveTab('preferences')}
            >
              <Target size={14} color={activeTab === 'preferences' ? Colors.primaryDark : Colors.textMuted} />
              <Text style={[styles.tabBtnText, activeTab === 'preferences' && styles.activeTabBtnText]}>Partner Preferences</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Tab Content Cards */}
        <View style={styles.contentCard}>
          {/* TAB 1: ABOUT */}
          {activeTab === 'about' && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Introductory Bio</Text>
              </View>
              <View style={styles.bioBox}>
                <Text style={styles.bioText}>
                  {profile.about || `${profile.firstName} hasn't written a personal bio yet.`}
                </Text>
              </View>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Basic Information</Text>
              </View>
              <View style={styles.infoTable}>
                <InfoRow label="Age" value={profile.age ? `${profile.age} years` : undefined} />
                <InfoRow label="Marital Status" value={profile.maritalStatus} />
                <InfoRow label="Gender" value={profile.gender} />
                <InfoRow label="Height" value={profile.height ? `${profile.height} cm` : undefined} />
                <InfoRow label="Body Type" value={profile.bodyType} />
                <InfoRow label="Complexion" value={profile.complexion} />
                <InfoRow label="Ethnicity" value={profile.ethnicity} />
              </View>

              <View style={[styles.sectionHeader, { marginTop: Spacing.lg }]}>
                <Text style={styles.sectionTitle}>Location</Text>
              </View>
              <View style={styles.infoTable}>
                <InfoRow label="Current City" value={profile.city} />
                <InfoRow label="District" value={profile.district} />
                <InfoRow label="Place of Birth" value={profile.placeOfBirth} />
              </View>
            </View>
          )}

          {/* TAB 2: BACKGROUND (Religion, Education, Career, Family) */}
          {activeTab === 'details' && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Religion & Culture</Text>
              </View>
              <View style={styles.infoTable}>
                <InfoRow label="Religion" value={profile.religion} />
                <InfoRow label="Religious Practices" value={profile.religiousPractices} />
                <InfoRow label="Family Background" value={profile.familyBackground} />
                <InfoRow label="Family Involvement" value={profile.familyInvolvement} />
                <InfoRow label="Wedding Preferences" value={profile.weddingPreferences} />
              </View>

              {/* Languages */}
              <View style={[styles.sectionHeader, { marginTop: Spacing.lg }]}>
                <Text style={styles.sectionTitle}>Languages Spoken</Text>
              </View>
              {Array.isArray(profile.languages) && profile.languages.length > 0 ? (
                <View style={styles.tagGrid}>
                  {profile.languages.map((lang: string, i: number) => (
                    <View key={i} style={styles.langTag}>
                      <Text style={styles.langTagText}>{lang}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyNotice}>No languages specified.</Text>
              )}

              {/* Education & Career */}
              <View style={[styles.sectionHeader, { marginTop: Spacing.lg }]}>
                <Text style={styles.sectionTitle}>Education & Career</Text>
              </View>
              <View style={styles.infoTable}>
                <InfoRow label="Education" value={profile.educationLevel || profile.education} />
                <InfoRow label="Field of Study" value={profile.fieldOfStudy} />
                <InfoRow label="Profession" value={profile.profession} />
                <InfoRow label="Industry" value={profile.industry} />
                <InfoRow label="Employer" value={profile.employer} />
                <InfoRow label="Work Location" value={profile.workLocation} />
                <InfoRow label="Annual Income" value={profile.income} />
                <InfoRow label="Relocation" value={profile.relocationWillingness} />
              </View>
            </View>
          )}

          {/* TAB 3: LIFESTYLE */}
          {activeTab === 'lifestyle' && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Habits & Lifestyle</Text>
              </View>
              <View style={styles.infoTable}>
                <InfoRow label="Dietary Preference" value={profile.dietaryPreferences} />
                <InfoRow label="Smoking" value={profile.smoking} />
                <InfoRow label="Drinking" value={profile.drinking} />
                <InfoRow label="Health & Fitness" value={profile.healthHabits} />
              </View>

              {profile.lifestyle ? (
                <>
                  <View style={[styles.sectionHeader, { marginTop: Spacing.lg }]}>
                    <Text style={styles.sectionTitle}>Daily Routine & Philosophy</Text>
                  </View>
                  <View style={styles.bioBox}>
                    <Text style={styles.bioText}>{profile.lifestyle}</Text>
                  </View>
                </>
              ) : null}
            </View>
          )}

          {/* TAB 4: INTERESTS & FAVORITES */}
          {activeTab === 'interests' && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Hobbies & Passions</Text>
              </View>
              {Array.isArray(profile.interests) && profile.interests.length > 0 ? (
                <View style={styles.tagGrid}>
                  {profile.interests.map((interest: string, i: number) => (
                    <View key={i} style={styles.interestTag}>
                      <Sparkle size={12} color={Colors.primaryDark} />
                      <Text style={styles.interestTagText}>{interest}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyNotice}>No interests listed yet.</Text>
              )}

              {/* Favorite Things */}
              {profile.favoriteThings && Object.keys(profile.favoriteThings).length > 0 ? (
                <>
                  <View style={[styles.sectionHeader, { marginTop: Spacing.lg }]}>
                    <Text style={styles.sectionTitle}>Favourite Things</Text>
                  </View>
                  <View style={styles.infoTable}>
                    {Object.entries(profile.favoriteThings).map(([k, v]: [string, any]) => (
                      <InfoRow
                        key={k}
                        label={k.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                        value={String(v)}
                      />
                    ))}
                  </View>
                </>
              ) : null}
            </View>
          )}

          {/* TAB 5: PARTNER PREFERENCES */}
          {activeTab === 'preferences' && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>What {profile.firstName} Is Looking For</Text>
              </View>
              {profile.partnerPreferences && Object.keys(profile.partnerPreferences).length > 0 ? (
                <View style={styles.infoTable}>
                  {Object.entries(profile.partnerPreferences)
                    .filter(([_, val]) => val !== null && val !== undefined && val !== '')
                    .map(([key, val]: [string, any]) => {
                      let displayValue = String(val);
                      if (Array.isArray(val)) {
                        displayValue = val.join(', ');
                      }
                      const formattedKey = key
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, (str) => str.toUpperCase());

                      return <InfoRow key={key} label={formattedKey} value={displayValue} />;
                    })}
                </View>
              ) : (
                <Text style={styles.emptyNotice}>No partner preferences specified.</Text>
              )}

              {profile.dealbreakers ? (
                <>
                  <View style={[styles.sectionHeader, { marginTop: Spacing.lg }]}>
                    <Text style={styles.sectionTitle}>Dealbreakers</Text>
                  </View>
                  <View style={[styles.bioBox, { borderLeftColor: Colors.errorRed }]}>
                    <Text style={styles.bioText}>{profile.dealbreakers}</Text>
                  </View>
                </>
              ) : null}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        {isMatched ? (
          <TouchableOpacity
            style={styles.messageBtn}
            onPress={() => router.push(`/chat/${profile.id}` as any)}
          >
            <MessageCircle size={18} color="#fff" />
            <Text style={styles.messageBtnText}>Send Message (Matched! 💖)</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.actionBtnRow}>
            <TouchableOpacity
              style={[styles.likeActionBtn, isLiked && styles.likedActive]}
              onPress={() => handleLike('NORMAL')}
            >
              <Heart
                size={18}
                color={isLiked ? Colors.likePink : Colors.primaryDark}
                fill={isLiked ? Colors.likePink : 'transparent'}
              />
              <Text style={[styles.likeActionText, isLiked && { color: Colors.likePink }]}>
                {isLiked ? 'Liked' : 'Send Like'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.starActionBtn, isStarred && styles.starredActive]}
              onPress={() => handleLike('STAR')}
            >
              <Star
                size={18}
                color={isStarred ? Colors.starGold : '#ffffff'}
                fill={isStarred ? Colors.starGold : 'transparent'}
              />
              <Text style={styles.starActionText}>
                {isStarred ? 'Starred' : 'Star Like (Priority)'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

// Reusable Info Row Component
function InfoRow({ label, value }: { label: string; value?: string }) {
  const cleanVal = (value || 'Not Specified').replace(/_/g, ' ');
  const isPresent = !!value && value !== 'Not Specified';

  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, !isPresent && styles.mutedValue]}>
        {cleanVal}
      </Text>
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    backgroundColor: '#fdf8f4',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 13,
    color: Colors.textMuted,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  errorSub: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },

  /* Gallery Hero */
  galleryWrapper: {
    position: 'relative',
    height: 420,
    width: '100%',
    backgroundColor: '#2d1810',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  galleryOverlay: {
    ...StyleSheet.absoluteFill,
  },
  backFloatingBtn: {
    position: 'absolute',
    top: 48,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(20,6,2,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportFloatingBtn: {
    position: 'absolute',
    top: 48,
    right: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(20,6,2,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBadge: {
    position: 'absolute',
    top: 52,
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(20,6,2,0.6)',
  },
  counterText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  heroIdentity: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  heroName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2e7d32',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  verifiedPillText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroMetaText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
  },
  galleryDots: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  galleryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  activeGalleryDot: {
    width: 14,
    backgroundColor: '#ffffff',
  },

  /* Compat Ribbon */
  compatRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0ddd5',
  },
  compatText: {
    fontSize: 13,
    color: Colors.primaryDark,
  },

  /* Tabs */
  tabsContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0ddd5',
  },
  tabsScroll: {
    paddingHorizontal: 12,
    gap: 8,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabBtn: {
    borderBottomColor: Colors.primaryDark,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  activeTabBtnText: {
    color: Colors.primaryDark,
    fontWeight: '600',
  },

  /* Content Card */
  contentCard: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    ...Shadows.card,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2d1810',
  },
  bioBox: {
    backgroundColor: '#fdf5ee',
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primaryMedium,
    marginBottom: Spacing.md,
  },
  bioText: {
    fontSize: 13,
    color: '#4a3028',
    lineHeight: 20,
  },
  infoTable: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#faf3ef',
  },
  infoLabel: {
    fontSize: 12,
    color: '#9a7060',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2d1810',
    textTransform: 'capitalize',
    maxWidth: '60%',
    textAlign: 'right',
  },
  mutedValue: {
    color: '#b09080',
    fontWeight: '400',
    fontStyle: 'italic',
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  langTag: {
    backgroundColor: '#edf5fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#c8ddf0',
  },
  langTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3a6ea8',
  },
  interestTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fdf0e8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f0ddd5',
  },
  interestTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primaryDark,
  },
  emptyNotice: {
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.textMuted,
  },

  /* Sticky Bottom Bar */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0ddd5',
    ...Shadows.card,
  },
  actionBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  likeActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 30,
    backgroundColor: '#fdf8f5',
    borderWidth: 1.5,
    borderColor: '#e8ddd8',
  },
  likedActive: {
    backgroundColor: '#fde8ef',
    borderColor: '#f0a0b8',
  },
  likeActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  starActionBtn: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 30,
    backgroundColor: Colors.primaryDark,
  },
  starredActive: {
    backgroundColor: '#d4a017',
  },
  starActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  messageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 30,
    backgroundColor: '#2e7d32',
  },
  messageBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
