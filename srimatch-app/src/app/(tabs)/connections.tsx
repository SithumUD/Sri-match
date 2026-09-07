import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { Colors, Fonts, Spacing, Radius, Shadows } from '../../constants/theme';
import { GradientHeader } from '../../components/ui/GradientHeader';
import { useConnections, useReceivedLikes, useSentLikes } from '../../hooks/useLikes';
import { ConnectionService } from '../../services';
import {
  Heart,
  Users,
  HeartHandshake,
  Lock,
  Crown,
  MessageCircle,
  MapPin,
  Briefcase,
  Sparkles,
  User as UserIcon,
  ChevronRight,
  Eye,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import useAuthStore from '../../store/useAuthStore';
import { useQueryClient } from '@tanstack/react-query';

interface CardProfileData {
  id: string | number;
  name: string;
  age?: number | string;
  profession: string;
  location: string;
  imageUri: string;
  isBlurred: boolean;
  type?: string;
  status?: string;
  compatibilityScore?: number;
}

function extractProfileData(
  item: any,
  tab: 'received' | 'matches' | 'sent',
  isPremium: boolean
): CardProfileData {
  const fallbackImg =
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';

  if (tab === 'matches') {
    const other = item?.otherUser || item?.user || item?.profile || item || {};
    const name =
      other.name ||
      (other.firstName ? `${other.firstName} ${other.lastName || ''}`.trim() : 'Matched Member');
    const imageUri = other.profileImageUrl || other.profileImage || other.primaryImageUrl || fallbackImg;
    const location = other.city || 'Sri Lanka';
    const profession = other.profession || 'Professional';
    const age = other.age;
    const id = other.id || item.id;

    return {
      id,
      name,
      age,
      profession,
      location,
      imageUri,
      isBlurred: false,
      compatibilityScore: item.compatibilityScore,
    };
  }

  if (tab === 'received') {
    const sender = item?.sender || item?.user || item?.profile || item || {};
    const isBlurred = !isPremium || Boolean(item?.isBlurred) || sender.firstName === 'Hidden';
    const name = isBlurred
      ? 'Someone interested in you'
      : (sender.firstName
          ? `${sender.firstName}${sender.lastName ? ' ' + sender.lastName : ''}`.trim()
          : sender.name || 'Member');
    const imageUri = sender.profileImage || sender.profileImageUrl || sender.primaryImageUrl || fallbackImg;
    const location = isBlurred ? 'Location hidden' : (sender.city || 'Sri Lanka');
    const profession = isBlurred ? 'Unlock to view details' : (sender.profession || 'Professional');
    const age = isBlurred ? undefined : sender.age;
    const id = sender.id || item?.likeId || item?.id;

    return {
      id,
      name,
      age,
      profession,
      location,
      imageUri,
      isBlurred,
      type: item?.type || sender.interactionType,
      compatibilityScore: sender.compatibilityScore,
    };
  }

  // Sent tab
  const receiver = item?.receiver || item?.targetProfile || item?.user || item?.profile || item || {};
  const profile = receiver.profile || (receiver.age || receiver.profession ? receiver : {});
  const firstName = receiver.firstName || receiver.name || profile.firstName || 'Member';
  const lastName = receiver.lastName || profile.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim();
  const imageUri =
    profile.primaryImageUrl ||
    profile.profileImageUrl ||
    receiver.profileImage ||
    receiver.profileImageUrl ||
    profile.profileImages?.[0] ||
    fallbackImg;
  const location = profile.city || receiver.city || 'Sri Lanka';
  const profession = profile.profession || receiver.profession || 'Professional';
  const age = profile.age || receiver.age;
  const id = profile.id || receiver.id || item?.profileId || item?.userId || item?.id;

  return {
    id,
    name: fullName || 'Member',
    age,
    profession,
    location,
    imageUri,
    isBlurred: false,
    type: item?.type,
    status: item?.status || 'PENDING',
  };
}

export default function ConnectionsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'received' | 'matches' | 'sent'>('received');

  const { data: connectionsData, isLoading: loadingConn, refetch: refetchConn } = useConnections();
  const { data: receivedLikes = [], isLoading: loadingRec, refetch: refetchRec } = useReceivedLikes();
  const { data: sentLikes = [], isLoading: loadingSent, refetch: refetchSent } = useSentLikes();

  const isPremium = Boolean(
    user?.premium ||
    user?.isPremium ||
    user?.subscription?.plan === 'premium' ||
    user?.subscription?.plan === 'PRO' ||
    user?.subscription?.plan === 'VIP' ||
    connectionsData?.isPremium
  );

  const matches = connectionsData?.matches || [];
  const profileViews = connectionsData?.profileViews ?? 0;
  const likesCount = connectionsData?.totalLikesCount ?? receivedLikes.length;
  const matchesCount = connectionsData?.totalMatchesCount ?? matches.length;

  const handleRefresh = () => {
    refetchConn();
    refetchRec();
    refetchSent();
  };

  const currentList =
    activeTab === 'received'
      ? (receivedLikes.length > 0 ? receivedLikes : (connectionsData?.receivedLikes || []))
      : activeTab === 'matches'
      ? matches
      : sentLikes;

  return (
    <View style={styles.container}>
      <GradientHeader title="My Connections" subtitle="Mutual matches & interests received" />

      {/* Stats Quick Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statBox}>
          <Eye size={16} color={Colors.primaryMedium} />
          <Text style={styles.statNumber}>{profileViews}</Text>
          <Text style={styles.statLabel}>Views</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Heart size={16} color={Colors.likePink} fill={Colors.likePink} />
          <Text style={styles.statNumber}>{likesCount}</Text>
          <Text style={styles.statLabel}>Likes</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <HeartHandshake size={16} color={Colors.verifiedGreen} />
          <Text style={styles.statNumber}>{matchesCount}</Text>
          <Text style={styles.statLabel}>Matches</Text>
        </View>
      </View>

      {/* Segmented Top Tabs */}
      <View style={styles.segmentedRow}>
        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'received' && styles.activeSegmentBtn]}
          onPress={() => setActiveTab('received')}
        >
          <Heart
            size={14}
            color={activeTab === 'received' ? Colors.primaryDark : Colors.textLight}
            fill={activeTab === 'received' ? Colors.likePink : 'transparent'}
          />
          <Text style={[styles.segmentText, activeTab === 'received' && styles.activeSegmentText]}>
            Received ({currentList && activeTab === 'received' ? currentList.length : receivedLikes.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'matches' && styles.activeSegmentBtn]}
          onPress={() => setActiveTab('matches')}
        >
          <HeartHandshake
            size={15}
            color={activeTab === 'matches' ? Colors.primaryDark : Colors.textLight}
          />
          <Text style={[styles.segmentText, activeTab === 'matches' && styles.activeSegmentText]}>
            Matches ({matches.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'sent' && styles.activeSegmentBtn]}
          onPress={() => setActiveTab('sent')}
        >
          <Users size={14} color={activeTab === 'sent' ? Colors.primaryDark : Colors.textLight} />
          <Text style={[styles.segmentText, activeTab === 'sent' && styles.activeSegmentText]}>
            Sent ({sentLikes.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <FlatList
        data={currentList}
        keyExtractor={(item, index) => `${item.id || item.likeId || index}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loadingConn || loadingRec || loadingSent}
            onRefresh={handleRefresh}
            colors={[Colors.primaryMedium]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Heart size={44} color={Colors.borderDark} />
            <Text style={styles.emptyTitle}>
              {activeTab === 'received'
                ? 'No Likes Received Yet'
                : activeTab === 'matches'
                ? 'No Mutual Matches Yet'
                : 'No Sent Interests'}
            </Text>
            <Text style={styles.emptySub}>
              {activeTab === 'received'
                ? 'Boost your profile to get discovered by up to 10x more compatible partners.'
                : activeTab === 'matches'
                ? 'Explore the Discover feed and send interests to profiles you love.'
                : 'Browse profiles and send your first like to start connecting.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const profile = extractProfileData(item, activeTab, isPremium);

          return (
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.connectionCard}
              onPress={() => {
                if (profile.isBlurred) {
                  router.push('/(tabs)/premium');
                } else if (profile.id) {
                  router.push({
                    pathname: '/profile/[id]',
                    params: { id: String(profile.id) },
                  });
                }
              }}
            >
              <View style={styles.avatarWrap}>
                <Image
                  source={{ uri: profile.imageUri }}
                  style={[styles.avatar, profile.isBlurred && styles.blurredAvatar]}
                  blurRadius={profile.isBlurred ? 12 : 0}
                />
                {profile.isBlurred && (
                  <View style={styles.lockOverlay}>
                    <Lock size={16} color="#fff" />
                  </View>
                )}
                {profile.type === 'STAR' && !profile.isBlurred && (
                  <View style={styles.starBadge}>
                    <Sparkles size={10} color="#fff" />
                  </View>
                )}
              </View>

              <View style={styles.infoCol}>
                <View style={styles.nameRow}>
                  <Text style={styles.profileName} numberOfLines={1}>
                    {profile.name}
                    {profile.age ? `, ${profile.age}` : ''}
                  </Text>
                </View>

                <View style={styles.metaTagsRow}>
                  <View style={styles.tagWrap}>
                    <MapPin size={11} color={Colors.primaryMedium} />
                    <Text style={styles.tagText} numberOfLines={1}>
                      {profile.location}
                    </Text>
                  </View>
                  <View style={styles.tagWrap}>
                    <Briefcase size={11} color={Colors.textMuted} />
                    <Text style={styles.tagText} numberOfLines={1}>
                      {profile.profession}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Actions based on tab */}
              {activeTab === 'received' ? (
                profile.isBlurred ? (
                  <TouchableOpacity
                    style={styles.upgradeBtn}
                    onPress={() => router.push('/(tabs)/premium')}
                  >
                    <Crown size={12} color={Colors.primaryDark} />
                    <Text style={styles.upgradeText}>Unlock</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.profileBtn}
                    onPress={() =>
                      router.push({
                        pathname: '/profile/[id]',
                        params: { id: String(profile.id) },
                      })
                    }
                  >
                    <UserIcon size={14} color={Colors.primaryMedium} />
                    <Text style={styles.profileBtnText}>View</Text>
                  </TouchableOpacity>
                )
              ) : activeTab === 'matches' ? (
                <View style={styles.matchActionCol}>
                  <TouchableOpacity
                    style={styles.chatBtn}
                    onPress={() =>
                      router.push({
                        pathname: '/chat/[id]',
                        params: {
                          id: String(item.id || profile.id),
                          recipientName: profile.name,
                          recipientImage: profile.imageUri,
                          recipientId: String(profile.id),
                        },
                      })
                    }
                  >
                    <MessageCircle size={14} color="#fff" />
                    <Text style={styles.chatBtnText}>Chat</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>
                    {profile.status === 'ACCEPTED' ? 'Matched' : 'Sent'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontFamily: Fonts?.serif || 'serif',
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 2,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.borderLight,
  },
  segmentedRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.sm,
    borderRadius: Radius.full,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 9,
    borderRadius: Radius.full,
  },
  activeSegmentBtn: {
    backgroundColor: Colors.primaryExtraLight,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textLight,
  },
  activeSegmentText: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  listContent: {
    padding: Spacing.base,
    paddingBottom: 100,
  },
  connectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  avatarWrap: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryExtraLight,
  },
  blurredAvatar: {
    opacity: 0.5,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(61, 31, 18, 0.65)',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.gold,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  infoCol: {
    flex: 1,
    paddingRight: Spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    fontFamily: Fonts?.serif || 'serif',
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  metaTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  tagWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.primaryExtraLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  tagText: {
    fontSize: 11,
    color: Colors.textSecondary,
    maxWidth: 110,
  },
  upgradeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
  },
  upgradeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryExtraLight,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  profileBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  matchActionCol: {
    alignItems: 'flex-end',
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryMedium,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.full,
  },
  chatBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  statusBadge: {
    backgroundColor: Colors.primaryExtraLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  emptyContainer: {
    paddingTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontFamily: Fonts?.serif || 'serif',
    fontSize: 19,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
  },
});

