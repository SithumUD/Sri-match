import React, { useState, useRef, useEffect } from 'react';
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
  Modal,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useChatMessages, useConversations } from '../../hooks/useLikes';
import { ChatService } from '../../services';
import { ChatBubble } from '../../components/chat/ChatBubble';
import { VoiceRecorder } from '../../components/chat/VoiceRecorder';
import {
  ChevronLeft,
  Send,
  Shield,
  Phone,
  Video,
  Image as ImageIcon,
  Mic,
  X,
  Maximize2,
  Heart,
  Sparkles,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import useAuthStore from '../../store/useAuthStore';
import useCallStore from '../../store/useCallStore';
import { useQueryClient } from '@tanstack/react-query';

export default function ChatScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id, recipientName, recipientImage, recipientId } = useLocalSearchParams();
  const { user } = useAuthStore();
  const { startCall } = useCallStore();

  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [imageCaption, setImageCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);

  const { data: conversations = [] } = useConversations();

  // Find conversation if id passed is a user or profile ID instead of matchId
  const matchedConv = conversations.find(
    (c: any) =>
      String(c.id) === String(id) ||
      String(c.otherUser?.id) === String(id) ||
      String(c.otherUser?.id) === String(recipientId) ||
      String(c.otherUser?.userId) === String(id) ||
      String(c.otherUser?.userId) === String(recipientId)
  );

  const activeMatchId = matchedConv?.id ? String(matchedConv.id) : (id as string);
  const name =
    (recipientName as string) ||
    matchedConv?.otherUser?.name ||
    matchedConv?.otherUser?.firstName ||
    'Match';
  const avatarUri =
    (recipientImage as string) ||
    matchedConv?.otherUser?.profileImageUrl ||
    matchedConv?.otherUser?.profileImage ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';

  const flatListRef = useRef<FlatList>(null);
  const { data: messages = [], isLoading } = useChatMessages(activeMatchId);

  const currentUserId = user?.id ?? user?.userId;

  // Resolve other participant user id
  const targetReceiverId =
    recipientId ||
    matchedConv?.otherUser?.id ||
    matchedConv?.otherUser?.userId ||
    messages.find((m: any) => {
      const sId = m.senderId ?? m.sender?.id ?? m.sender_id;
      return sId != null && currentUserId != null && String(sId) !== String(currentUserId);
    })?.senderId ||
    messages.find((m: any) => {
      const rId = m.receiverId ?? m.receiver?.id ?? m.receiver_id;
      return rId != null && currentUserId != null && String(rId) !== String(currentUserId);
    })?.receiverId;

  // Auto-scroll on new message
  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages.length]);

  const handleSendText = async () => {
    if (!inputText.trim() || sending) return;
    const text = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      if (targetReceiverId) {
        await ChatService.sendMessage({
          matchId: Number(activeMatchId),
          receiverId: Number(targetReceiverId),
          content: text,
          type: 'TEXT',
        });
      } else {
        await ChatService.sendMessage(activeMatchId, text);
      }
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages', activeMatchId] });
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
    } catch (e: any) {
      console.warn('Failed to send message:', e);
      Alert.alert('Error', e?.response?.data?.message || e?.message || 'Could not send message.');
    } finally {
      setSending(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Please grant photo library access to share images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImageUri(result.assets[0].uri);
      }
    } catch (e) {
      console.warn('Image picker error:', e);
    }
  };

  const handleSendSelectedImage = async () => {
    if (!selectedImageUri || isUploading) return;
    try {
      setIsUploading(true);
      const uri = selectedImageUri;
      const filename = uri.split('/').pop() || 'chat_image.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const mimeType = match ? `image/${match[1]}` : 'image/jpeg';

      const formData = new FormData();
      formData.append('file', {
        uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
        name: filename,
        type: mimeType,
      } as any);

      const uploadRes: any = await ChatService.uploadMedia(formData);
      const mediaUrl = uploadRes?.data?.url || uploadRes?.url;

      if (!mediaUrl) {
        Alert.alert('Upload Failed', uploadRes?.message || 'Could not upload image.');
        return;
      }

      const payload = {
        matchId: Number(activeMatchId),
        receiverId: targetReceiverId ? Number(targetReceiverId) : undefined,
        content: imageCaption.trim() || 'Image',
        type: 'IMAGE',
        mediaUrl: mediaUrl,
        mediaType: uploadRes?.data?.mediaType || mimeType,
        mediaSize: uploadRes?.data?.size,
      };

      await ChatService.sendMessage(payload);
      setSelectedImageUri(null);
      setImageCaption('');
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages', activeMatchId] });
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
    } catch (err: any) {
      console.warn('Failed to upload/send image:', err);
      Alert.alert('Error', err?.message || 'Failed to send image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleVoiceRecordingComplete = async (audioUri: string, durationSeconds: number) => {
    try {
      setIsUploading(true);
      setIsRecordingVoice(false);

      const filename = audioUri.split('/').pop() || 'voice_note.m4a';
      const formData = new FormData();
      formData.append('file', {
        uri: Platform.OS === 'android' ? audioUri : audioUri.replace('file://', ''),
        name: filename,
        type: 'audio/m4a',
      } as any);

      const uploadRes: any = await ChatService.uploadMedia(formData);
      const mediaUrl = uploadRes?.data?.url || uploadRes?.url;

      if (!mediaUrl) {
        Alert.alert('Upload Failed', 'Could not upload voice note.');
        return;
      }

      const payload = {
        matchId: Number(activeMatchId),
        receiverId: targetReceiverId ? Number(targetReceiverId) : undefined,
        content: 'Voice Message',
        type: 'AUDIO',
        mediaUrl: mediaUrl,
        mediaType: uploadRes?.data?.mediaType || 'audio/m4a',
        mediaSize: uploadRes?.data?.size,
      };

      await ChatService.sendMessage(payload);
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages', activeMatchId] });
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
    } catch (err: any) {
      console.warn('Voice message delivery error:', err);
      Alert.alert('Error', err?.message || 'Failed to send voice message');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        style={styles.container}
      >
        {/* Chat Header (Online status removed) */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={Colors.text} />
          </TouchableOpacity>

          <Image source={{ uri: avatarUri }} style={styles.headerAvatar} />

          <View style={styles.headerTextCol}>
            <Text style={styles.headerName} numberOfLines={1}>
              {name}
            </Text>
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
              <Phone size={17} color={Colors.primaryMedium} />
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
              <Video size={17} color={Colors.primaryMedium} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Safety Tip Bar */}
        <View style={styles.safetyBar}>
          <Shield size={13} color={Colors.primaryMedium} />
          <Text style={styles.safetyText}>
            Never share financial details or send money in chat.
          </Text>
        </View>

        {/* Message Bubble List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => `${item.id || index}`}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            if (messages.length > 0) {
              flatListRef.current?.scrollToEnd({ animated: false });
            }
          }}
          onLayout={() => {
            if (messages.length > 0) {
              flatListRef.current?.scrollToEnd({ animated: false });
            }
          }}
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.emptyChatContainer}>
                <View style={styles.emptyChatAvatarWrap}>
                  <Image source={{ uri: avatarUri }} style={styles.emptyChatAvatar} />
                  <View style={styles.emptyChatHeartBadge}>
                    <Heart size={14} color="#fff" fill="#fff" />
                  </View>
                </View>
                <Text style={styles.emptyChatTitle}>You matched with {name}! 💖</Text>
                <Text style={styles.emptyChatSubtitle}>
                  Say hello and break the ice to start getting to know each other.
                </Text>

                <View style={styles.icebreakersRow}>
                  {['👋 Hi there!', '✨ How is your day going?', '🌸 Nice to connect with you!'].map((starter, i) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.icebreakerChip}
                      onPress={() => setInputText(starter)}
                    >
                      <Sparkles size={12} color={Colors.primaryDark} />
                      <Text style={styles.icebreakerText}>{starter}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : (
              <View style={styles.loadingChatContainer}>
                <ActivityIndicator size="small" color={Colors.primaryMedium} />
                <Text style={styles.loadingChatText}>Loading conversation...</Text>
              </View>
            )
          }
          renderItem={({ item }) => {
            const msgSenderId = item.senderId ?? item.sender?.id ?? item.sender_id;
            let isMine = false;
            if (item.isMine !== undefined) {
              isMine = Boolean(item.isMine);
            } else if (targetReceiverId != null && msgSenderId != null) {
              isMine = String(msgSenderId) !== String(targetReceiverId);
            } else if (currentUserId != null && msgSenderId != null) {
              isMine = String(msgSenderId) === String(currentUserId);
            }

            return (
              <ChatBubble
                message={item}
                isMine={isMine}
                avatarUrl={!isMine ? avatarUri : undefined}
                onImagePress={(url) => setLightboxImageUrl(url)}
              />
            );
          }}
        />

        {/* Selected Image Preview Attachment Bar */}
        {selectedImageUri && (
          <View style={styles.imagePreviewBar}>
            <View style={styles.previewThumbWrap}>
              <Image source={{ uri: selectedImageUri }} style={styles.previewThumb} />
              <TouchableOpacity
                style={styles.removeImageBtn}
                onPress={() => {
                  setSelectedImageUri(null);
                  setImageCaption('');
                }}
              >
                <X size={14} color="#fff" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.captionInput}
              placeholder="Add a caption..."
              placeholderTextColor={Colors.textLight}
              value={imageCaption}
              onChangeText={setImageCaption}
            />

            <TouchableOpacity
              style={[styles.sendMediaBtn, isUploading && styles.disabledBtn]}
              onPress={handleSendSelectedImage}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Send size={16} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Active Voice Recording Bar */}
        {isRecordingVoice ? (
          <View style={styles.voiceRecorderContainer}>
            <VoiceRecorder
              onRecordingComplete={handleVoiceRecordingComplete}
              onCancel={() => setIsRecordingVoice(false)}
            />
          </View>
        ) : (
          /* Standard Input Bar */
          !selectedImageUri && (
            <View style={styles.inputContainer}>
              {/* Image Picker Button */}
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={handlePickImage}
                disabled={sending || isUploading}
                accessibilityLabel="Share Image"
              >
                <ImageIcon size={20} color={Colors.primaryMedium} />
              </TouchableOpacity>

              {/* Voice Message Button */}
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => setIsRecordingVoice(true)}
                disabled={sending || isUploading}
                accessibilityLabel="Record Voice Note"
              >
                <Mic size={20} color={Colors.primaryMedium} />
              </TouchableOpacity>

              {/* Text Input */}
              <TextInput
                style={styles.textInput}
                placeholder={`Message ${name}...`}
                placeholderTextColor={Colors.textLight}
                value={inputText}
                onChangeText={setInputText}
                multiline
              />

              {/* Send Button */}
              <TouchableOpacity
                style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
                onPress={handleSendText}
                disabled={!inputText.trim() || sending}
              >
                {sending ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Send size={16} color="#ffffff" />
                )}
              </TouchableOpacity>
            </View>
          )
        )}
      </KeyboardAvoidingView>

      {/* Lightbox Image Modal */}
      <Modal
        visible={Boolean(lightboxImageUrl)}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLightboxImageUrl(null)}
      >
        <View style={styles.lightboxModal}>
          <StatusBar barStyle="light-content" backgroundColor="#000" />
          <TouchableOpacity
            style={styles.closeLightboxBtn}
            onPress={() => setLightboxImageUrl(null)}
          >
            <X size={24} color="#fff" />
          </TouchableOpacity>
          {lightboxImageUrl && (
            <Image
              source={{ uri: lightboxImageUrl }}
              style={styles.lightboxImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
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
    width: 38,
    height: 38,
    borderRadius: 19,
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
    gap: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryExtraLight,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 90,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryMedium,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  voiceRecorderContainer: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  imagePreviewBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 10,
  },
  previewThumbWrap: {
    position: 'relative',
  },
  previewThumb: {
    width: 50,
    height: 50,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceSoft,
  },
  removeImageBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ef4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captionInput: {
    flex: 1,
    height: 40,
    backgroundColor: Colors.surfaceSoft,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    fontSize: 13,
    color: Colors.text,
  },
  sendMediaBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightboxModal: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeLightboxBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 8,
  },
  lightboxImage: {
    width: '100%',
    height: '85%',
  },
  emptyChatContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 1.5,
    paddingHorizontal: Spacing.lg,
  },
  emptyChatAvatarWrap: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  emptyChatAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.primaryLight,
  },
  emptyChatHeartBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.likePink,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  emptyChatTitle: {
    fontFamily: Fonts.headingBold,
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  emptyChatSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.lg,
    maxWidth: 280,
  },
  icebreakersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  icebreakerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryUltraLight,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  icebreakerText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    color: Colors.primaryDark,
  },
  loadingChatContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 2,
    gap: 8,
  },
  loadingChatText: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.textMuted,
  },
});
