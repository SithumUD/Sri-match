import React, { useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Crown,
  Sparkles,
  X,
} from 'lucide-react-native';
import { Colors, Fonts, Radius, Shadows } from '../../constants/theme';
import useCallStore from '../../store/useCallStore';
import useAuthStore from '../../store/useAuthStore';
import { useRouter } from 'expo-router';

export const MobileCallModal: React.FC = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    activeCall,
    callStatus,
    callDuration,
    isMuted,
    isSpeakerOn,
    isVideoOff,
    toggleMute,
    toggleSpeaker,
    toggleVideo,
    endCall,
    incrementDuration,
  } = useCallStore();

  const isPremium = Boolean(user?.isPremium || user?.premium || user?.isPremiumActive);

  // Active call duration counter
  useEffect(() => {
    let timer: any = null;
    if (callStatus === 'CONNECTED') {
      timer = setInterval(() => {
        incrementDuration();
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [callStatus, incrementDuration]);

  if (!activeCall) return null;

  const { partner, callType, isCaller } = activeCall;
  const isVideo = callType === 'VIDEO';

  // If free user attempted to start a call, show upgrade modal
  if (!isPremium && isCaller) {
    return (
      <Modal visible={!!activeCall} transparent animationType="fade" statusBarTranslucent>
        <View style={styles.overlay}>
          <View style={styles.upgradeCard}>
            <TouchableOpacity
              onPress={endCall}
              style={styles.closeBtn}
              accessibilityLabel="Close"
            >
              <X size={20} color={Colors.textMuted} />
            </TouchableOpacity>

            <View style={styles.upgradeIconBox}>
              {isVideo ? (
                <Video size={32} color={Colors.primaryMedium} />
              ) : (
                <Crown size={32} color={Colors.goldDark} />
              )}
            </View>

            <View style={styles.premiumTag}>
              <Crown size={12} color="#b45309" />
              <Text style={styles.premiumTagText}>Premium Feature</Text>
            </View>

            <Text style={styles.upgradeTitle}>
              {isVideo ? 'HD Video Calling' : 'Private Voice Calling'}
            </Text>

            <Text style={styles.upgradeDesc}>
              Upgrade to <Text style={{ fontWeight: 'bold', color: Colors.primaryDark }}>SriMatch Premium</Text> to enjoy unlimited, secure private calls with {partner?.name || 'your match'}.
            </Text>

            <TouchableOpacity
              onPress={() => {
                endCall();
                router.push('/(tabs)/premium');
              }}
              style={styles.upgradeBtn}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={Colors.gradients.primaryBtn}
                style={styles.upgradeBtnGradient}
              >
                <Sparkles size={16} color={Colors.gold} />
                <Text style={styles.upgradeBtnText}>Upgrade to Premium ✦</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const statusText =
    callStatus === 'CONNECTED'
      ? formatDuration(callDuration)
      : callStatus === 'RINGING'
      ? 'Calling partner…'
      : 'Connecting…';

  return (
    <Modal visible={!!activeCall} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <LinearGradient
          colors={['#2a130a', '#1a0c06', '#0d0603']}
          style={styles.callScreen}
        >
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View style={styles.callTypeBadge}>
              <Crown size={13} color={Colors.gold} />
              <Text style={styles.callTypeText}>
                SriMatch {isVideo ? 'HD Video' : 'Voice'} Call
              </Text>
            </View>
            <View style={styles.durationPill}>
              <Text style={styles.durationText}>{statusText}</Text>
            </View>
          </View>

          {/* Center: Partner Avatar & Name */}
          <View style={styles.centerSection}>
            <View style={styles.avatarWrap}>
              <Image
                source={{
                  uri:
                    partner?.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
                }}
                style={styles.callAvatar}
              />
            </View>

            <Text style={styles.partnerName}>{partner?.name || 'Partner'}</Text>
            <Text style={styles.encryptedNotice}>
              {callStatus === 'CONNECTED' ? 'Encrypted Connection Active' : 'Ringing…'}
            </Text>
          </View>

          {/* Controls Bar */}
          <View style={styles.controlsBar}>
            {/* Mute Toggle */}
            <TouchableOpacity
              onPress={toggleMute}
              style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
              activeOpacity={0.8}
            >
              {isMuted ? <MicOff size={22} color="#ffffff" /> : <Mic size={22} color="#ffffff" />}
            </TouchableOpacity>

            {/* Video Toggle (for video calls) */}
            {isVideo && (
              <TouchableOpacity
                onPress={toggleVideo}
                style={[styles.controlBtn, isVideoOff && styles.controlBtnActive]}
                activeOpacity={0.8}
              >
                {isVideoOff ? (
                  <VideoOff size={22} color="#ffffff" />
                ) : (
                  <Video size={22} color="#ffffff" />
                )}
              </TouchableOpacity>
            )}

            {/* Speaker Toggle */}
            <TouchableOpacity
              onPress={toggleSpeaker}
              style={[styles.controlBtn, isSpeakerOn && styles.controlBtnActive]}
              activeOpacity={0.8}
            >
              {isSpeakerOn ? (
                <Volume2 size={22} color="#ffffff" />
              ) : (
                <VolumeX size={22} color="#ffffff" />
              )}
            </TouchableOpacity>

            {/* End Call Button */}
            <TouchableOpacity
              onPress={endCall}
              style={[styles.controlBtn, styles.endCallBtn]}
              activeOpacity={0.8}
            >
              <PhoneOff size={26} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callScreen: {
    width: '100%',
    height: '100%',
    paddingTop: 54,
    paddingBottom: 48,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  callTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  callTypeText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontFamily: Fonts.medium,
  },
  durationPill: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  durationText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
  centerSection: {
    alignItems: 'center',
  },
  avatarWrap: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: Colors.primaryLight,
    overflow: 'hidden',
    marginBottom: 20,
    ...Shadows.glow,
  },
  callAvatar: {
    width: '100%',
    height: '100%',
  },
  partnerName: {
    fontSize: 28,
    fontFamily: Fonts.serif,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  encryptedNotice: {
    fontSize: 13,
    color: 'rgba(232,201,184,0.8)',
    fontFamily: Fonts.regular,
  },
  controlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    width: '100%',
  },
  controlBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlBtnActive: {
    backgroundColor: '#dc2626',
  },
  endCallBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#dc2626',
    ...Shadows.glow,
  },
  upgradeCard: {
    width: '90%',
    maxWidth: 360,
    backgroundColor: '#ffffff',
    borderRadius: Radius.xxl,
    padding: 28,
    alignItems: 'center',
    position: 'relative',
    ...Shadows.card,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fdf5f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fdf0e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eddcd2',
  },
  premiumTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    marginBottom: 12,
  },
  premiumTagText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#92400e',
    textTransform: 'uppercase',
  },
  upgradeTitle: {
    fontSize: 22,
    fontFamily: Fonts.serif,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  upgradeDesc: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 24,
  },
  upgradeBtn: {
    width: '100%',
    borderRadius: Radius.full,
    overflow: 'hidden',
    ...Shadows.glow,
  },
  upgradeBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  upgradeBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default MobileCallModal;
