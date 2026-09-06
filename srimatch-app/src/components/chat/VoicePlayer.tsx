import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { Play, Pause, Volume2 } from 'lucide-react-native';
import { Colors } from '../../constants/theme';

interface VoicePlayerProps {
  audioUrl: string;
  isMine: boolean;
}

export const VoicePlayer: React.FC<VoicePlayerProps> = ({ audioUrl, isMine }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);

  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  const loadSound = async (): Promise<Audio.Sound | null> => {
    try {
      setIsLoading(true);
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      const { sound: newSound, status } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );

      soundRef.current = newSound;
      setSound(newSound);

      if (status.isLoaded && status.durationMillis) {
        setDurationMillis(status.durationMillis);
      }
      setIsLoading(false);
      return newSound;
    } catch (e) {
      console.warn('Failed to load audio:', e);
      setIsLoading(false);
      return null;
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (!status.isLoaded) {
      if (status.error) {
        console.warn(`Audio playback error: ${status.error}`);
      }
      return;
    }

    setPositionMillis(status.positionMillis || 0);
    if (status.durationMillis) {
      setDurationMillis(status.durationMillis);
    }
    setIsPlaying(status.isPlaying || false);

    if (status.didJustFinish) {
      setIsPlaying(false);
      setPositionMillis(0);
    }
  };

  const togglePlay = async () => {
    try {
      let currentSound = sound;
      if (!currentSound) {
        currentSound = await loadSound();
        if (!currentSound) return;
      }

      if (isPlaying) {
        await currentSound.pauseAsync();
      } else {
        if (positionMillis >= durationMillis && durationMillis > 0) {
          await currentSound.setPositionAsync(0);
        }
        await currentSound.playAsync();
      }
    } catch (e) {
      console.warn('Error toggling audio play:', e);
    }
  };

  const formatTime = (millis: number) => {
    if (!millis || isNaN(millis)) return '0:00';
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercent = durationMillis > 0 ? (positionMillis / durationMillis) * 100 : 0;
  const remainingMillis = Math.max(0, durationMillis - positionMillis);

  // 18 decorative audio waveform bars
  const barHeights = [
    25, 45, 70, 90, 60, 35, 75, 100, 85, 50,
    65, 95, 55, 30, 80, 60, 40, 75
  ];

  return (
    <View style={styles.container}>
      {/* Play/Pause Button */}
      <TouchableOpacity
        style={[styles.playBtn, isMine ? styles.minePlayBtn : styles.otherPlayBtn]}
        onPress={togglePlay}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={isMine ? Colors.primaryDark : '#ffffff'} />
        ) : isPlaying ? (
          <Pause size={15} color={isMine ? Colors.primaryDark : '#ffffff'} fill={isMine ? Colors.primaryDark : '#ffffff'} />
        ) : (
          <Play size={15} color={isMine ? Colors.primaryDark : '#ffffff'} fill={isMine ? Colors.primaryDark : '#ffffff'} />
        )}
      </TouchableOpacity>

      {/* Waveform and Timer */}
      <View style={styles.waveCol}>
        <View style={styles.waveRow}>
          {barHeights.map((heightPercent, idx) => {
            const barPercent = (idx / barHeights.length) * 100;
            const isPlayed = barPercent <= progressPercent;

            return (
              <View
                key={idx}
                style={[
                  styles.waveBar,
                  { height: `${heightPercent}%` },
                  isMine
                    ? isPlayed
                      ? styles.minePlayedBar
                      : styles.mineUnplayedBar
                    : isPlayed
                    ? styles.otherPlayedBar
                    : styles.otherUnplayedBar,
                ]}
              />
            );
          })}
        </View>

        <View style={styles.timeRow}>
          <Text style={[styles.timeText, isMine ? styles.mineTimeText : styles.otherTimeText]}>
            {isPlaying ? `-${formatTime(remainingMillis)}` : formatTime(durationMillis || 0)}
          </Text>
          <View style={styles.volumeWrap}>
            <Volume2 size={11} color={isMine ? 'rgba(255,255,255,0.7)' : Colors.textMuted} />
            <Text style={[styles.timeText, isMine ? styles.mineTimeText : styles.otherTimeText]}>
              {formatTime(durationMillis || 0)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
    minWidth: 200,
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  minePlayBtn: {
    backgroundColor: '#ffffff',
  },
  otherPlayBtn: {
    backgroundColor: Colors.primaryMedium,
  },
  waveCol: {
    flex: 1,
    justifyContent: 'center',
  },
  waveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 24,
    paddingHorizontal: 2,
  },
  waveBar: {
    width: 3,
    borderRadius: 2,
  },
  minePlayedBar: {
    backgroundColor: '#ffffff',
  },
  mineUnplayedBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  otherPlayedBar: {
    backgroundColor: Colors.primaryMedium,
  },
  otherUnplayedBar: {
    backgroundColor: Colors.border,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  volumeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  timeText: {
    fontSize: 10,
    fontFamily: 'monospace',
  },
  mineTimeText: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  otherTimeText: {
    color: Colors.textSecondary,
  },
});

export default VoicePlayer;
