import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Radius } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface ChatBubbleProps {
  message: {
    id: string | number;
    content: string;
    senderId: string | number;
    createdAt?: string;
  };
  isMine: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isMine }) => {
  const timeString = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  if (isMine) {
    return (
      <View style={[styles.wrapper, styles.mineWrapper]}>
        <LinearGradient
          colors={Colors.gradients.header as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.bubble, styles.mineBubble]}
        >
          <Text style={styles.mineText}>{message.content}</Text>
          {timeString ? <Text style={styles.mineTime}>{timeString}</Text> : null}
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, styles.otherWrapper]}>
      <View style={[styles.bubble, styles.otherBubble]}>
        <Text style={styles.otherText}>{message.content}</Text>
        {timeString ? <Text style={styles.otherTime}>{timeString}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 4,
    paddingHorizontal: Spacing.base,
    flexDirection: 'row',
  },
  mineWrapper: {
    justifyContent: 'flex-end',
  },
  otherWrapper: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.lg,
  },
  mineBubble: {
    borderBottomRightRadius: 2,
  },
  otherBubble: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomLeftRadius: 2,
  },
  mineText: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
  },
  otherText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  mineTime: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  otherTime: {
    fontSize: 10,
    color: Colors.textLight,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
});

export default ChatBubble;
