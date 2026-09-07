import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Fonts, Spacing, Radius, Shadows } from '../../constants/theme';
import { GradientHeader } from '../../components/ui/GradientHeader';
import { ProfileCard } from '../../components/home/ProfileCard';
import { FilterModal } from '../../components/home/FilterModal';
import { useProfiles } from '../../hooks/useProfiles';
import { useToggleLike, useSentLikes, useLikeQuota } from '../../hooks/useLikes';
import { Filter, Sparkles, Heart, Crown } from 'lucide-react-native';
import useAuthStore from '../../store/useAuthStore';

export default function DiscoverScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [filters, setFilters] = useState<any>({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortOrder, setSortOrder] = useState('');

  const isPremium = Boolean(
    user?.premium ||
    user?.isPremium ||
    user?.subscription?.plan === 'premium' ||
    user?.subscription?.plan === 'PRO' ||
    user?.subscription?.plan === 'VIP' ||
    user?.role === 'PREMIUM'
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useProfiles(filters, sortOrder, user?.partnerPreferences);

  const { data: sentLikes = [] } = useSentLikes();
  const { data: quota } = useLikeQuota();
  const { mutate: mutateToggleLike } = useToggleLike();

  const profiles = useMemo(() => {
    return data?.pages.flatMap((page: any) => page.items || page.content || []) || [];
  }, [data]);

  const sentLikeMap = useMemo(() => {
    const map = new Map<number, string>();
    sentLikes.forEach((l: any) => {
      map.set(Number(l.profileId || l.userId), l.type);
    });
    return map;
  }, [sentLikes]);

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter((v) => {
      if (Array.isArray(v)) return v.length > 0;
      return v !== '' && v !== null && v !== undefined && v !== false;
    }).length;
  }, [filters]);

  const likesRemaining = quota?.likesRemaining ?? 15;
  const likeLimit = quota?.likeLimit ?? 15;

  const handleToggleLike = (profileId: string | number, type: 'NORMAL' | 'STAR') => {
    mutateToggleLike({ profileId, type });
  };

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  return (
    <View style={styles.container}>
      {/* Signature SriMatch Gradient Header */}
      <GradientHeader
        title="Discover Matches"
        subtitle={`Welcome, ${user?.firstName || 'Member'} ✦`}
        rightElement={
          <TouchableOpacity
            style={styles.filterHeaderBtn}
            onPress={() => setShowFilterModal(true)}
            activeOpacity={0.7}
          >
            <Filter size={18} color="#ffffff" />
            {activeFilterCount > 0 && (
              <View style={styles.activeFilterBadge}>
                <Text style={styles.activeFilterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        }
      />

      {/* Match Cards List */}
      <FlatList
        data={profiles}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          !isPremium ? (
            <View style={styles.quotaCard}>
              <View style={styles.quotaHeader}>
                <View style={styles.quotaTitleRow}>
                  <Heart size={14} color={Colors.likePink} fill={Colors.likePink} />
                  <Text style={styles.quotaLabel}>Likes Remaining</Text>
                </View>
                <Text style={styles.quotaCount}>
                  {likesRemaining} / {likeLimit}
                </Text>
              </View>

              <View style={styles.quotaTrack}>
                <View
                  style={[
                    styles.quotaFill,
                    {
                      width: `${Math.min(
                        100,
                        Math.max(0, (likesRemaining / (likeLimit || 15)) * 100)
                      )}%`,
                    },
                  ]}
                />
              </View>

              <TouchableOpacity
                style={styles.quotaUpgradeRow}
                onPress={() => router.push('/(tabs)/premium')}
                activeOpacity={0.7}
              >
                <Crown size={12} color="#d4a017" />
                <Text style={styles.quotaUpgradeText}>
                  Upgrade to Premium for Unlimited Likes ✦
                </Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[Colors.primaryMedium]}
            tintColor={Colors.primaryMedium}
          />
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={Colors.primaryMedium} />
              <Text style={styles.loadingText}>Finding compatible matches...</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <Sparkles size={36} color={Colors.primaryLight} />
              </View>
              <Text style={styles.emptyTitle}>No Matches Found</Text>
              <Text style={styles.emptySub}>
                Try adjusting your search filters to explore more profiles across Sri Lanka.
              </Text>
              <TouchableOpacity style={styles.resetFilterBtn} onPress={handleResetFilters}>
                <Text style={styles.resetFilterText}>Reset Filters ✦</Text>
              </TouchableOpacity>
            </View>
          )
        }
        renderItem={({ item }) => {
          const isLiked = sentLikeMap.get(Number(item.id)) === 'NORMAL';
          const isStarred = sentLikeMap.get(Number(item.id)) === 'STAR';
          return (
            <ProfileCard
              profile={item}
              isLiked={isLiked}
              isStarred={isStarred}
              onToggleLike={handleToggleLike}
            />
          );
        }}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color={Colors.primaryMedium} />
            </View>
          ) : null
        }
      />

      {/* Full Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        filters={filters}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf8f4',
  },
  listContent: {
    paddingTop: Spacing.md,
    paddingBottom: 100,
  },
  filterHeaderBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeFilterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#e07a30',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#3d1f12',
  },
  activeFilterBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  quotaCard: {
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.base,
    backgroundColor: '#fdf5ee',
    borderWidth: 1,
    borderColor: '#f0ddd5',
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  quotaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  quotaTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quotaLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4a3028',
  },
  quotaCount: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  quotaTrack: {
    height: 6,
    backgroundColor: '#ede5e0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  quotaFill: {
    height: '100%',
    backgroundColor: Colors.primaryMedium,
    borderRadius: 3,
  },
  quotaUpgradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quotaUpgradeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primaryMedium,
  },
  centerContainer: {
    padding: Spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 13,
    color: Colors.textMuted,
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xxl,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fdf0e8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d1810',
    marginBottom: Spacing.xs,
  },
  emptySub: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: Spacing.lg,
    maxWidth: 280,
  },
  resetFilterBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primaryDark,
    borderRadius: Radius.full,
  },
  resetFilterText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  footerLoader: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
});
