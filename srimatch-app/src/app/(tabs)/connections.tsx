import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Colors, Fonts, Spacing, Radius, Shadows } from '../../constants/theme';
import { GradientHeader } from '../../components/ui/GradientHeader';
import { useConnections, useReceivedLikes, useSentLikes } from '../../hooks/useLikes';
import { ConnectionService } from '../../services';
import { Heart, Users, HeartHandshake, Check, X, Lock, Crown, MessageCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import useAuthStore from '../../store/useAuthStore';
import { useQueryClient } from '@tanstack/react-query';

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
    user?.subscription?.plan === 'VIP'
  );

  const matches = connectionsData?.matches || [];

  const handleRespond = async (connectionId: string | number, action: 'ACCEPT' | 'REJECT') => {
    try {
      await ConnectionService.respondToConnection(connectionId, action);
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      queryClient.invalidateQueries({ queryKey: ['likes'] });
      Alert.alert(action === 'ACCEPT' ? 'Connected! 💖' : 'Request Removed');
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Could not respond to connection.');
    }
  };

  const handleRefresh = () => {
    refetchConn();
    refetchRec();
    refetchSent();
  };

  return (
    <View style={styles.container}>
      <GradientHeader title="My Connections" subtitle="Mutual matches & interests received" />

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
            Received ({receivedLikes.length})
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
        data={
          activeTab === 'received'
            ? receivedLikes
            : activeTab === 'matches'
            ? matches
            : sentLikes
        }
        keyExtractor={(item, index) => `${item.id || index}`}
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
          const profile = item.sender || item.profile || item.user || item;
          const imageUri =
            profile.profileImage ||
            profile.profileImageUrl ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';

          return (
            <View style={styles.connectionCard}>
              <TouchableOpacity
                onPress={() =>
                  profile.id &&
                  router.push({
                    pathname: '/profile/[id]',
                    params: { id: String(profile.id) },
                  })
                }
                style={styles.avatarWrap}
              >
                <Image
                  source={{ uri: imageUri }}
                  style={[styles.avatar, !isPremium && activeTab === 'received' && styles.blurredAvatar]}
                />
                {!isPremium && activeTab === 'received' && (
                  <View style={styles.lockOverlay}>
                    <Lock size={16} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.infoCol}>
                <Text style={styles.profileName}>
                  {!isPremium && activeTab === 'received'
                    ? 'Someone interested in you'
                    : `${profile.firstName || 'Member'}, ${profile.age || 26}`}
                </Text>
                <Text style={styles.profileMeta}>
                  {profile.profession || 'Professional'} · {profile.district || 'Colombo'}
                </Text>
              </View>

              {/* Actions based on tab */}
              {activeTab === 'received' ? (
                isPremium ? (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.acceptBtn}
                      onPress={() => handleRespond(item.id, 'ACCEPT')}
                    >
                      <Check size={16} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rejectBtn}
                      onPress={() => handleRespond(item.id, 'REJECT')}
                    >
                      <X size={16} color={Colors.textMuted} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.upgradeBtn}
                    onPress={() => router.push('/(tabs)/premium')}
                  >
                    <Crown size={12} color={Colors.primaryDark} />
                    <Text style={styles.upgradeText}>Unlock</Text>
                  </TouchableOpacity>
                )
              ) : activeTab === 'matches' ? (
                <TouchableOpacity
                  style={styles.chatBtn}
                  onPress={() =>
                    router.push({
                      pathname: '/chat/[id]',
                      params: { id: String(item.conversationId || profile.id) },
                    })
                  }
                >
                  <MessageCircle size={15} color="#fff" />
                  <Text style={styles.chatBtnText}>Chat</Text>
                </TouchableOpacity>
              ) : null}
            </View>
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
  segmentedRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
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
    gap: 5,
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
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.primaryExtraLight,
  },
  blurredAvatar: {
    opacity: 0.25,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(61, 31, 18, 0.7)',
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: {
    flex: 1,
  },
  profileName: {
    fontFamily: Fonts?.serif || 'serif',
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  profileMeta: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 6,
  },
  acceptBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.verifiedGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryExtraLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  upgradeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark,
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
  emptyContainer: {
    paddingTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontFamily: Fonts?.serif || 'serif',
    fontSize: 20,
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
