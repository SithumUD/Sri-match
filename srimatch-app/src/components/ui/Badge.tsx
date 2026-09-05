import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Spacing } from '../../constants/theme';
import { Check, Zap, Crown, Shield } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface BadgeProps {
  type: 'verified' | 'boosted' | 'premium' | 'custom';
  text?: string;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ type, text, style }) => {
  if (type === 'verified') {
    return (
      <View style={[styles.verifiedBadge, style]}>
        <Check size={10} color={Colors.gold} strokeWidth={3} />
        <Text style={styles.verifiedText}>Verified</Text>
      </View>
    );
  }

  if (type === 'boosted') {
    return (
      <LinearGradient
        colors={Colors.gradients.boost as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.boostedBadge, style]}
      >
        <Zap size={10} color="#fff" fill="#fff" />
        <Text style={styles.boostedText}>Boosted</Text>
      </LinearGradient>
    );
  }

  if (type === 'premium') {
    return (
      <LinearGradient
        colors={Colors.gradients.gold as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.premiumBadge, style]}
      >
        <Crown size={10} color={Colors.primaryDark} fill={Colors.primaryDark} />
        <Text style={styles.premiumText}>{text || 'Premium'}</Text>
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.customBadge, style]}>
      <Text style={styles.customText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(61, 31, 18, 0.88)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    gap: 4,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.gold,
  },
  boostedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    gap: 4,
  },
  boostedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    gap: 4,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  customBadge: {
    backgroundColor: Colors.primaryExtraLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  customText: {
    fontSize: 11,
    color: Colors.primaryMedium,
    fontWeight: '600',
  },
});

export default Badge;
