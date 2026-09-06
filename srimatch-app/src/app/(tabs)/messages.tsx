import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { Colors, Fonts, Spacing, Radius, Shadows } from '../../constants/theme';
import { GradientHeader } from '../../components/ui/GradientHeader';
import { CustomInput } from '../../components/ui/CustomInput';
import { useConversations } from '../../hooks/useLikes';
import { Search, MessageCircle, Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function MessagesScreen() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: conversations = [], isLoading, refetch, isRefetching } = useConversations();

  const filtered = conversations.filter((c: any) => {
    const name = c.otherUser?.name || c.otherUser?.firstName || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <View style={styles.container}>
      <GradientHeader title="Messages" subtitle="Real-time chats with your matches" />

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <CustomInput
          placeholder="Search conversations..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          leftIcon={<Search size={18} color={Colors.textMuted} />}
          containerStyle={{ marginBottom: 0 }}
        />
      </View>

      {/* Conversations List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[Colors.primaryMedium]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <MessageCircle size={38} color={Colors.primaryLight} />
            </View>
            <Text style={styles.emptyTitle}>No Conversations Yet</Text>
            <Text style={styles.emptySub}>
              Once you match with someone, your conversation will appear here. Start exploring profiles!
            </Text>
            <TouchableOpacity
              style={styles.findMatchBtn}
              onPress={() => router.push('/(tabs)')}
            >
              <Text style={styles.findMatchText}>Find Matches ✦</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => {
          const other = item.otherUser || {};
          const imageUri =
            other.profileImageUrl ||
            other.profileImage ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';

          return (
            <TouchableOpacity
              style={styles.conversationItem}
              activeOpacity={0.75}
              onPress={() =>
                router.push({
                  pathname: '/chat/[id]',
                  params: {
                    id: String(item.id),
                    recipientName: other.name || other.firstName || 'Match',
                    recipientImage: imageUri,
                    recipientId: String(other.id || other.userId || ''),
                  },
                })
              }
            >
              <Image source={{ uri: imageUri }} style={styles.avatar} />
              
              <View style={styles.infoCol}>
                <View style={styles.topRow}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {other.name || other.firstName || 'Match'}
                  </Text>
                  {item.lastMessageTime && (
                    <Text style={styles.timeText}>
                      {new Date(item.lastMessageTime).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                  )}
                </View>

                <Text style={styles.lastMessage} numberOfLines={1}>
                  {item.lastMessage || 'Say hello to break the ice ✦'}
                </Text>
              </View>

              {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadCount}>{item.unreadCount}</Text>
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
  searchWrapper: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  listContent: {
    padding: Spacing.base,
    paddingBottom: 100,
  },
  conversationItem: {
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primaryExtraLight,
    marginRight: Spacing.md,
  },
  infoCol: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    fontFamily: Fonts?.serif || 'serif',
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  timeText: {
    fontSize: 11,
    color: Colors.textLight,
  },
  lastMessage: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  unreadBadge: {
    backgroundColor: Colors.primaryMedium,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    marginLeft: Spacing.xs,
  },
  unreadCount: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  emptyContainer: {
    paddingTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryExtraLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontFamily: Fonts?.serif || 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: Spacing.lg,
  },
  findMatchBtn: {
    backgroundColor: Colors.primaryExtraLight,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  findMatchText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryMedium,
  },
});
