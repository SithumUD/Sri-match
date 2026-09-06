import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Colors, Spacing, Radius } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { VoicePlayer } from './VoicePlayer';
import { ImageIcon, Maximize2 } from 'lucide-react-native';

interface ChatBubbleProps {
  message: {
    id: string | number;
    content?: string;
    senderId?: string | number;
    createdAt?: string;
    type?: string;
    mediaUrl?: string;
    mediaType?: string;
    mediaSize?: number;
  };
  isMine: boolean;
  avatarUrl?: string;
  onImagePress?: (imageUrl: string) => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isMine,
  avatarUrl,
  onImagePress,
}) => {
  const [imageLoading, setImageLoading] = useState(true);

  const timeString = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  const isImage =
    message.type === 'IMAGE' ||
    (message.mediaUrl &&
      (message.mediaType?.startsWith('image/') ||
        /\.(jpg|jpeg|png|webp|gif)$/i.test(message.mediaUrl)));

  const isAudio =
    message.type === 'AUDIO' ||
    (message.mediaUrl &&
      (message.mediaType?.startsWith('audio/') ||
        /\.(webm|mp3|ogg|wav|m4a|aac)$/i.test(message.mediaUrl)));

  const contentText = message.content || '';
  const showCaption =
    isImage && contentText && contentText !== 'Image' && contentText !== 'photo';

  return (
    <View style={[styles.row, isMine ? styles.mineRow : styles.otherRow]}>
      {/* Partner avatar on left for received messages */}
      {!isMine && avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={styles.partnerAvatar} />
      ) : null}

      {/* Bubble Container */}
      <View style={[styles.bubbleWrapper, isMine ? styles.mineWrapper : styles.otherWrapper]}>
        {isMine ? (
          <LinearGradient
            colors={['#3d1f12', '#74351b', '#8b4e2e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.bubble, styles.mineBubble, isImage && styles.imageBubble]}
          >
            {/* Image message */}
            {isImage && message.mediaUrl && (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => onImagePress && onImagePress(message.mediaUrl!)}
                style={styles.imageContainer}
              >
                <Image
                  source={{ uri: message.mediaUrl }}
                  style={styles.mediaImage}
                  resizeMode="cover"
                  onLoadEnd={() => setImageLoading(false)}
                />
                {imageLoading && (
                  <View style={styles.imageLoader}>
                    <ActivityIndicator size="small" color="#ffffff" />
                  </View>
                )}
                <View style={styles.expandIconBadge}>
                  <Maximize2 size={12} color="#ffffff" />
                </View>
              </TouchableOpacity>
            )}

            {/* Audio / Voice message */}
            {isAudio && message.mediaUrl && (
              <VoicePlayer audioUrl={message.mediaUrl} isMine={true} />
            )}

            {/* Text message / image caption */}
            {(!isImage && !isAudio) || showCaption ? (
              <Text style={[styles.mineText, isImage && styles.captionText]}>
                {contentText}
              </Text>
            ) : null}

            {/* Timestamp */}
            {timeString ? (
              <Text style={[styles.mineTime, isImage && styles.imageTime]}>{timeString}</Text>
            ) : null}
          </LinearGradient>
        ) : (
          <View style={[styles.bubble, styles.otherBubble, isImage && styles.imageBubble]}>
            {/* Image message */}
            {isImage && message.mediaUrl && (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => onImagePress && onImagePress(message.mediaUrl!)}
                style={styles.imageContainer}
              >
                <Image
                  source={{ uri: message.mediaUrl }}
                  style={styles.mediaImage}
                  resizeMode="cover"
                  onLoadEnd={() => setImageLoading(false)}
                />
                {imageLoading && (
                  <View style={styles.imageLoader}>
                    <ActivityIndicator size="small" color={Colors.primaryMedium} />
                  </View>
                )}
                <View style={styles.expandIconBadge}>
                  <Maximize2 size={12} color="#ffffff" />
                </View>
              </TouchableOpacity>
            )}

            {/* Audio / Voice message */}
            {isAudio && message.mediaUrl && (
              <VoicePlayer audioUrl={message.mediaUrl} isMine={false} />
            )}

            {/* Text message / image caption */}
            {(!isImage && !isAudio) || showCaption ? (
              <Text style={[styles.otherText, isImage && styles.captionText]}>
                {contentText}
              </Text>
            ) : null}

            {/* Timestamp */}
            {timeString ? (
              <Text style={[styles.otherTime, isImage && styles.imageTime]}>{timeString}</Text>
            ) : null}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    marginVertical: 4,
    paddingHorizontal: Spacing.base,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  mineRow: {
    justifyContent: 'flex-end',
  },
  otherRow: {
    justifyContent: 'flex-start',
    gap: 8,
  },
  partnerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primaryExtraLight,
    marginBottom: 2,
  },
  bubbleWrapper: {
    maxWidth: '78%',
  },
  mineWrapper: {
    alignItems: 'flex-end',
  },
  otherWrapper: {
    alignItems: 'flex-start',
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
    shadowColor: '#3d1f12',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  imageBubble: {
    paddingHorizontal: 5,
    paddingTop: 5,
    paddingBottom: 7,
  },
  mineBubble: {
    borderBottomRightRadius: 3,
  },
  otherBubble: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderBottomLeftRadius: 3,
  },
  mineText: {
    fontSize: 14.5,
    color: '#ffffff',
    lineHeight: 20.5,
  },
  otherText: {
    fontSize: 14.5,
    color: Colors.text,
    lineHeight: 20.5,
  },
  captionText: {
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 2,
  },
  mineTime: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.72)',
    alignSelf: 'flex-end',
    marginTop: 3,
  },
  otherTime: {
    fontSize: 10,
    color: Colors.textMuted,
    alignSelf: 'flex-end',
    marginTop: 3,
  },
  imageTime: {
    paddingHorizontal: 6,
  },
  imageContainer: {
    width: 220,
    height: 180,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.06)',
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  imageLoader: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  expandIconBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 10,
    padding: 4,
  },
});

export default ChatBubble;
