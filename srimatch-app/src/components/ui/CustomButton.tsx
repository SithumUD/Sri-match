import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Radius, Shadows } from '../../constants/theme';

export interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'gold' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const isGradient = variant === 'primary' || variant === 'gold';
  const gradientColors =
    variant === 'gold' ? Colors.gradients.gold : Colors.gradients.primaryBtn;

  const sizeStyles = {
    sm: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 13 },
    md: { paddingVertical: 13, paddingHorizontal: 22, fontSize: 15 },
    lg: { paddingVertical: 16, paddingHorizontal: 28, fontSize: 16 },
  }[size];

  const content = (
    <View style={styles.innerContent}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'gold' ? Colors.primaryDark : Colors.textWhite}
        />
      ) : (
        <>
          {icon && <View style={styles.iconWrap}>{icon}</View>}
          <Text
            style={[
              styles.text,
              { fontSize: sizeStyles.fontSize },
              variant === 'gold' && styles.goldText,
              variant === 'outline' && styles.outlineText,
              variant === 'ghost' && styles.ghostText,
              variant === 'danger' && styles.dangerText,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </View>
  );

  if (isGradient) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.85}
        style={[
          styles.touchable,
          variant === 'gold' ? Shadows.gold : Shadows.glow,
          disabled && styles.disabled,
          style,
        ]}
      >
        <LinearGradient
          colors={gradientColors as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.baseButton,
            { paddingVertical: sizeStyles.paddingVertical, paddingHorizontal: sizeStyles.paddingHorizontal },
          ]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.baseButton,
        styles.touchable,
        { paddingVertical: sizeStyles.paddingVertical, paddingHorizontal: sizeStyles.paddingHorizontal },
        variant === 'outline' && styles.outlineButton,
        variant === 'ghost' && styles.ghostButton,
        variant === 'danger' && styles.dangerButton,
        disabled && styles.disabled,
        style,
      ]}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  baseButton: {
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    marginRight: Spacing.sm,
  },
  text: {
    color: Colors.textWhite,
    fontWeight: '600',
    textAlign: 'center',
  },
  goldText: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primaryMedium,
  },
  outlineText: {
    color: Colors.primaryMedium,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: Colors.primaryMedium,
  },
  dangerButton: {
    backgroundColor: Colors.errorRedLight,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  dangerText: {
    color: Colors.errorRed,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default CustomButton;
