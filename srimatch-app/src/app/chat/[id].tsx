import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Fonts, Spacing, Radius, Shadows } from '../../constants/theme';
import { useChatMessages } from '../../hooks/useLikes';
import { ChatService, ReportService } from '../../services';
import { ChatBubble } from '../../components/chat/ChatBubble';
import { ChevronLeft, Send, Flag, Shield, Phone, Video } from 'lucide-react-native';
import useAuthStore from '../../store/useAuthStore';
import useCallStore from '../../store/useCallStore';
import { useQueryClient } from '@tanstack/react-query';

export default function ChatScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id, recipientName, recipientImage } = useLocalSearchParams();
  const { user } = useAuthStore();
  const { startCall } = useCallStore();
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);

  const { data: messages = [], isLoading } = useChatMessages(id as string);

  const handleSend = async () => {
    if (!inputText.trim() || sending) return;
    const text = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      await ChatService.sendMessage(id as string, text);
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages', id] });
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
    } catch (e) {
      console.warn('Failed to send message:', e);
    } finally {
      setSending(false);
    }
  };

  const name = (recipientName as string) || 'Match';
  const avatarUri = (recipientImage as string) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        style={styles.container}
      >
        {/* Chat Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={Colors.text} />
          </TouchableOpacity>

          <Image source={{ uri: avatarUri }} style={styles.headerAvatar} />

          <View style={styles.headerTextCol}>
            <Text style={styles.headerName} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.headerStatus}>Online · Matched ✦</Text>
          </View>

          {/* Call Actions */}
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() =>
                startCall(
                  { id: id as string, name, avatar: avatarUri },
                  'VOICE',
                  Boolean(user?.isPremium || user?.premium || user?.isPremiumActive)
                )
              }
              style={styles.headerActionBtn}
              accessibilityLabel="Voice Call"
            >
              <Phone size={18} color={Colors.primaryMedium} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                startCall(
                  { id: id as string, name, avatar: avatarUri },
                  'VIDEO',
                  Boolean(user?.isPremium || user?.premium || user?.isPremiumActive)
                )
              }
              style={styles.headerActionBtn}
              accessibilityLabel="Video Call"
            >
              <Video size={18} color={Colors.primaryMedium} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Safety Tip Bar */}
        <View style={styles.safetyBar}>
          <Shield size={13} color={Colors.primaryMedium} />
          <Text style={styles.safetyText}>
            Never share bank or financial information in messages.
          </Text>
        </View>

        {/* Message Bubble List */}
        <FlatList
          data={messages}
          keyExtractor={(item, index) => `${item.id || index}`}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isMine = item.senderId === user?.id || item.isMine;
            return <ChatBubble message={item} isMine={isMine} />;
          }}
        />

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder={`Message ${name}...`}
            placeholderTextColor={Colors.textLight}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || sending}
          >
            <Send size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    padding: 4,
    marginRight: 6,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryExtraLight,
    marginRight: Spacing.sm,
  },
  headerTextCol: {
    flex: 1,
  },
  headerName: {
    fontFamily: Fonts?.serif || 'serif',
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  headerStatus: {
    fontSize: 11,
    color: Colors.verifiedGreen,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceSoft,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safetyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryExtraLight,
    paddingHorizontal: Spacing.base,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  safetyText: {
    fontSize: 11,
    color: Colors.primaryMedium,
    fontWeight: '500',
    flex: 1,
  },
  messageList: {
    paddingVertical: Spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  textInput: {
    flex: 1,
    minHeight: 42,
    maxHeight: 100,
    backgroundColor: Colors.surfaceSoft,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: Colors.text,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primaryMedium,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.glow,
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});
