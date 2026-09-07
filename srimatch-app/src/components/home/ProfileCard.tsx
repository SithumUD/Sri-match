import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Spacing, Radius, Shadows } from '../../constants/theme';
import { Heart, Star, MapPin, Briefcase, GraduationCap, ChevronRight, Sparkles } from 'lucide-react-native';
import { Badge } from '../ui/Badge';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface ProfileCardProps {
  profile: any;
  isLiked?: boolean;
  isStarred?: boolean;
  onToggleLike: (profileId: string | number, type: 'NORMAL' | 'STAR') => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  isLiked,
  isStarred,
  onToggleLike,
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (!profile?.id) return;
    router.push({
      pathname: '/profile/[id]',
      params: { id: String(profile.id) },
    });
  };

  const imageUri =
    (Array.isArray(profile?.profileImages) && profile.profileImages[0]) ||
    profile.profileImage ||
    profile.profileImageUrl ||
    profile.primaryImageUrl ||
    (Array.isArray(profile?.images) && (profile.images[0]?.imageUrl || profile.images[0]?.url || profile.images[0])) ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';

  const effectivelyLiked = isLiked || profile.interactionType === 'NORMAL';
  const effectivelyStarred = isStarred || profile.interactionType === 'STAR';

  return (
    <View style={styles.cardContainer}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.card, pressed && { opacity: 0.96 }]}
      >
        {/* Cover Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
          <LinearGradient
            colors={Colors.gradients.cardOverlay as any}
            style={styles.overlay}
          />

          {/* Top Badges */}
          <View style={styles.badgeRow}>
            {(profile.verified || profile.isVerified) && <Badge type="verified" />}
            {(profile.boosted || profile.isBoosted) && <Badge type="boosted" />}
          </View>

          {/* Action Buttons Floating on Cover */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionBtn, effectivelyLiked && styles.likedBtn]}
              onPress={(e) => {
                onToggleLike(profile.id, 'NORMAL');
              }}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Heart
                size={20}
                color={effectivelyLiked ? Colors.likePink : '#ffffff'}
                fill={effectivelyLiked ? Colors.likePink : 'rgba(255,255,255,0.2)'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, effectivelyStarred && styles.starredBtn]}
              onPress={(e) => {
                onToggleLike(profile.id, 'STAR');
              }}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Star
                size={20}
                color={effectivelyStarred ? Colors.starGold : '#ffffff'}
                fill={effectivelyStarred ? Colors.starGold : 'rgba(255,255,255,0.2)'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Details Body */}
        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={1}>
              {profile.firstName || profile.name || 'Member'}, {profile.age || 26}
            </Text>
            {profile.compatibilityScore ? (
              <View style={styles.scoreBadge}>
                <Sparkles size={10} color={Colors.primaryDark} />
                <Text style={styles.scoreText}>{profile.compatibilityScore}% match</Text>
              </View>
            ) : null}
          </View>

          {/* Location */}
          <View style={styles.metaRow}>
            <MapPin size={12} color={Colors.textMuted} />
            <Text style={styles.metaText} numberOfLines={1}>
              {profile.city || 'Colombo'}, Sri Lanka
            </Text>
          </View>

          {/* Career & Education Pills */}
          <View style={styles.pillsRow}>
            {profile.profession ? (
              <View style={[styles.pill, { backgroundColor: Colors.primaryExtraLight }]}>
                <Briefcase size={10} color={Colors.primaryMedium} />
                <Text style={[styles.pillText, { color: Colors.primaryMedium }]} numberOfLines={1}>
                  {profile.profession}
                </Text>
              </View>
            ) : null}

            {profile.education || profile.educationLevel ? (
              <View style={[styles.pill, { backgroundColor: '#edf5fd' }]}>
                <GraduationCap size={10} color="#3a6ea8" />
                <Text style={[styles.pillText, { color: '#3a6ea8' }]} numberOfLines={1}>
                  {profile.educationLevel || profile.education}
                </Text>
              </View>
            ) : null}
          </View>

          {/* About Bio Snippet */}
          {profile.about ? (
            <Text style={styles.about} numberOfLines={2}>
              {profile.about}
            </Text>
          ) : null}

          {/* Card Footer */}
          <View style={styles.footer}>
            <Text style={styles.viewProfileText}>View Full Profile</Text>
            <ChevronRight size={14} color={Colors.primaryMedium} />
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.base,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0ddd5',
    ...Shadows.card,
  },
  imageContainer: {
    position: 'relative',
    height: 320,
    width: '100%',
    backgroundColor: '#2d1810',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  badgeRow: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  actionButtons: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(20,6,2,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  likedBtn: {
    backgroundColor: '#ffffff',
    borderColor: Colors.likePink,
  },
  starredBtn: {
    backgroundColor: '#ffffff',
    borderColor: Colors.starGold,
  },
  body: {
    padding: Spacing.base,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d1810',
    flex: 1,
    marginRight: Spacing.sm,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fdf5ee',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#f0ddd5',
  },
  scoreText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.sm,
  },
  metaText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '500',
  },
  about: {
    fontSize: 13,
    color: '#6b4a3a',
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f7eee9',
    paddingTop: Spacing.sm,
    marginTop: Spacing.xs,
    gap: 2,
  },
  viewProfileText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryMedium,
  },
});
