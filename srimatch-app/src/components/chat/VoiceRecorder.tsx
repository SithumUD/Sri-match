import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import {
  useAudioRecorder,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from 'expo-audio';
import { X, Send } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '../../constants/theme';

interface VoiceRecorderProps {
  onRecordingComplete: (audioUri: string, durationSeconds: number) => void;
  onCancel: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete, onCancel }) => {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [durationSecs, setDurationSecs] = useState(0);
  const [isPreparing, setIsPreparing] = useState(true);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<any>(null);

  useEffect(() => {
    // Pulse animation for recording indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();

    startRecording();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      try {
        recorder.stop().catch(() => {});
        setAudioModeAsync({ allowsRecording: false }).catch(() => {});
      } catch (e) {}
    };
  }, []);

  const startRecording = async () => {
    try {
      setIsPreparing(true);
      const permission = await requestRecordingPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Please allow microphone access to record voice messages.');
        onCancel();
        return;
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      await recorder.prepareToRecordAsync();
      recorder.record();
      setIsPreparing(false);

      // Start elapsed timer
      timerRef.current = setInterval(() => {
        setDurationSecs(prev => prev + 1);
      }, 1000);
    } catch (e) {
      console.warn('Failed to start recording:', e);
      Alert.alert('Error', 'Could not access microphone to record voice note.');
      onCancel();
    }
  };

  const handleStopAndSend = async () => {
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      await recorder.stop();
      const uri = recorder.uri;
      await setAudioModeAsync({ allowsRecording: false });

      if (uri) {
        const finalDuration = Math.max(1, durationSecs);
        onRecordingComplete(uri, finalDuration);
      } else {
        onCancel();
      }
    } catch (e) {
      console.warn('Error stopping recording:', e);
      onCancel();
    }
  };

  const handleCancel = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    try {
      await recorder.stop();
      await setAudioModeAsync({ allowsRecording: false });
    } catch (e) {}
    onCancel();
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      {/* Cancel button */}
      <TouchableOpacity
        onPress={handleCancel}
        style={styles.cancelBtn}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <X size={20} color={Colors.textMuted} />
      </TouchableOpacity>

      {/* Recording status & indicator */}
      <View style={styles.statusRow}>
        <Animated.View style={[styles.redDot, { transform: [{ scale: pulseAnim }] }]} />
        <Text style={styles.recordingText}>
          {isPreparing ? 'Connecting mic...' : `Recording voice note · ${formatTimer(durationSecs)}`}
        </Text>
      </View>

      {/* Send voice button */}
      <TouchableOpacity
        onPress={handleStopAndSend}
        style={[styles.sendBtn, isPreparing && styles.disabledBtn]}
        disabled={isPreparing}
      >
        <Send size={16} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSoft,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  redDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ef4444',
  },
  recordingText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledBtn: {
    opacity: 0.5,
  },
});

export default VoiceRecorder;
