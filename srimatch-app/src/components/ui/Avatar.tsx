import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius } from '../../constants/theme';
import { User, Check } from 'lucide-react-native';

interface AvatarProps {
  uri?: string | null;
  size?: number;
  isVerified?: boolean;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  size = 48,
  isVerified = false,
  style,
}) => {
  return (
    <View style={[{ width: size, height: size }, styles.container, style]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <User size={size * 0.5} color={Colors.primaryLight} />
        </View>
      )}

      {isVerified && (
        <View
          style={[
            styles.verifiedCheck,
            {
              width: size * 0.32,
              height: size * 0.32,
              borderRadius: (size * 0.32) / 2,
              bottom: 0,
              right: 0,
            },
          ]}
        >
          <Check size={size * 0.2} color="#fff" strokeWidth={3} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  placeholder: {
    backgroundColor: Colors.primaryExtraLight,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedCheck: {
    position: 'absolute',
    backgroundColor: Colors.verifiedGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
});

export default Avatar;
