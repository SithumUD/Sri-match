import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Phone, PhoneOff, Video, Sparkles } from 'lucide-react-native';
import { Colors, Fonts, Radius, Shadows } from '../../constants/theme';
import useCallStore from '../../store/useCallStore';

export const MobileIncomingCallModal: React.FC = () => {
  const { incomingCall, acceptCall, rejectCall } = useCallStore();

  if (!incomingCall) return null;

  const isVideo = incomingCall.callType === 'VIDEO';

  return (
    <Modal visible={!!incomingCall} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <LinearGradient
          colors={['#2a130a', '#1a0c06', '#0d0603']}
          style={styles.card}
        >
          {/* Badge */}
          <View style={styles.badge}>
            <Sparkles size={12} color={Colors.gold} />
            <Text style={styles.badgeText}>
              Incoming {isVideo ? 'HD Video' : 'Voice'} Call
            </Text>
          </View>

          {/* Caller Avatar */}
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri:
                  incomingCall.senderAvatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
              }}
              style={styles.avatar}
            />
          </View>

          {/* Caller Details */}
          <Text style={styles.callerName}>{incomingCall.senderName}</Text>
          <Text style={styles.callSub}>SriMatch Match Calling…</Text>

          {/* Actions: Decline & Accept */}
          <View style={styles.actionsRow}>
            {/* Decline */}
            <View style={styles.actionCol}>
              <TouchableOpacity
                onPress={rejectCall}
                style={[styles.actionBtn, styles.declineBtn]}
                activeOpacity={0.8}
              >
                <PhoneOff size={26} color="#ffffff" />
              </TouchableOpacity>
              <Text style={styles.actionLabel}>Decline</Text>
            </View>

            {/* Accept */}
            <View style={styles.actionCol}>
              <TouchableOpacity
                onPress={acceptCall}
                style={[styles.actionBtn, styles.acceptBtn]}
                activeOpacity={0.8}
              >
                {isVideo ? (
                  <Video size={26} color="#ffffff" />
                ) : (
                  <Phone size={26} color="#ffffff" />
                )}
              </TouchableOpacity>
              <Text style={styles.actionLabel}>Accept</Text>
            </View>
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
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: Radius.xxl,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(201,133,106,0.3)',
    ...Shadows.glow,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    marginBottom: 24,
  },
  badgeText: {
    color: Colors.gold,
    fontSize: 11,
    fontFamily: Fonts.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: Colors.primaryLight,
    overflow: 'hidden',
    marginBottom: 18,
    ...Shadows.glow,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  callerName: {
    fontSize: 24,
    fontFamily: Fonts.serif,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  callSub: {
    fontSize: 13,
    color: 'rgba(232,201,184,0.8)',
    fontFamily: Fonts.regular,
    marginBottom: 36,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  actionCol: {
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  declineBtn: {
    backgroundColor: '#dc2626',
    ...Shadows.glow,
  },
  acceptBtn: {
    backgroundColor: '#16a34a',
    ...Shadows.glow,
  },
  actionLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
});

export default MobileIncomingCallModal;
