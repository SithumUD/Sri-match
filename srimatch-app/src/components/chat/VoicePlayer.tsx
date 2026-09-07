import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Play, Pause, Volume2 } from 'lucide-react-native';
import { Colors } from '../../constants/theme';

interface VoicePlayerProps {
  audioUrl: string;
  isMine: boolean;
}

export const VoicePlayer: React.FC<VoicePlayerProps> = ({ audioUrl, isMine }) => {
  const player = useAudioPlayer(audioUrl);
  const status = useAudioPlayerStatus(player);

  const togglePlay = () => {
    try {
      if (status.playing) {
        player.pause();
      } else {
        if (status.didJustFinish || (status.currentTime >= status.duration && status.duration > 0)) {
          player.seekTo(0);
        }
        player.play();
      }
    } catch (e) {
      console.warn('Voice playback toggle notice:', e);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const durationSec = status.duration || 0;
  const currentSec = status.currentTime || 0;
  const progressPercent = durationSec > 0 ? (currentSec / durationSec) * 100 : 0;
  const remainingSec = Math.max(0, durationSec - currentSec);

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
        {status.isBuffering ? (
          <ActivityIndicator size="small" color={isMine ? Colors.primaryDark : '#ffffff'} />
        ) : status.playing ? (
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
            {status.playing ? `-${formatTime(remainingSec)}` : formatTime(durationSec)}
          </Text>
          <View style={styles.volumeWrap}>
            <Volume2 size={11} color={isMine ? 'rgba(255,255,255,0.7)' : Colors.textMuted} />
            <Text style={[styles.timeText, isMine ? styles.mineTimeText : styles.otherTimeText]}>
              {formatTime(durationSec)}
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
