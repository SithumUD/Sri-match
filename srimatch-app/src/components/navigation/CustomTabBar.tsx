import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Spacing, Shadows } from '../../constants/theme';
import { Sparkles, HeartHandshake, MessageCircle, Crown, User } from 'lucide-react-native';

export const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: any) => {
  const insets = useSafeAreaInsets();

  const getTabConfig = (routeName: string) => {
    switch (routeName) {
      case 'index':
        return { label: 'Discover', icon: Sparkles };
      case 'connections':
        return { label: 'Connections', icon: HeartHandshake };
      case 'messages':
        return { label: 'Messages', icon: MessageCircle };
      case 'premium':
        return { label: 'Premium', icon: Crown };
      case 'profile':
        return { label: 'Profile', icon: User };
      default:
        return { label: routeName, icon: Sparkles };
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 20 : 10),
        },
      ]}
    >
      <View style={styles.bar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const { label, icon: IconComponent } = getTabConfig(route.name);

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrapper, isFocused && styles.activeIconWrapper]}>
                <IconComponent
                  size={20}
                  color={isFocused ? (route.name === 'premium' ? Colors.goldDark : Colors.primaryDark) : Colors.textLight}
                  strokeWidth={isFocused ? 2.4 : 1.8}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  isFocused && styles.activeTabLabel,
                  route.name === 'premium' && isFocused && { color: Colors.goldDark },
                ]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.xs,
    borderRadius: Radius.xxl,
    paddingVertical: 8,
    paddingHorizontal: 6,
    ...Shadows.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconWrapper: {
    width: 36,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
  },
  activeIconWrapper: {
    backgroundColor: Colors.primaryExtraLight,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.textLight,
    marginTop: 2,
  },
  activeTabLabel: {
    fontWeight: '700',
    color: Colors.primaryDark,
  },
});

export default CustomTabBar;
