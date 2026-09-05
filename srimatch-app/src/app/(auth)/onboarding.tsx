import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Fonts, Spacing, Radius } from '../../constants/theme';
import { ShieldCheck, HeartHandshake, Sparkles, ArrowRight } from 'lucide-react-native';
import { CustomButton } from '../../components/ui/CustomButton';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: ShieldCheck,
    title: '100% NIC Verified\nGenuine Profiles',
    description:
      'Safety and trust come first. Every member is verified with government ID to guarantee a trustworthy matrimonial journey.',
    gradient: ['#3d1f12', '#6b3526'],
  },
  {
    id: '2',
    icon: Sparkles,
    title: 'Smart Preferences &\nValue Compatibility',
    description:
      'Find your perfect match tailored to your education, profession, family values, and lifestyle preferences.',
    gradient: ['#6b3526', '#8b4e2e'],
  },
  {
    id: '3',
    icon: HeartHandshake,
    title: 'Begin Your Soulful\nLove Story Today',
    description:
      'Join over 50,000 Sri Lankans locally and across the globe finding meaningful, lifelong relationships on SriMatch.',
    gradient: ['#3d1f12', '#8b4e2e'],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const completeOnboarding = async () => {
    await AsyncStorage.setItem('srimatch_has_onboarded', 'true');
    router.replace('/(auth)/login');
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Top Header with Skip Button */}
      <View style={styles.header}>
        <View style={styles.brandTitleRow}>
          <Text style={styles.brandTitle}>SriMatch</Text>
          <Text style={styles.ornament}>✦</Text>
        </View>
        <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Carousel */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => {
          const IconComponent = item.icon;
          return (
            <View style={styles.slide}>
              <View style={styles.iconCircleContainer}>
                <LinearGradient
                  colors={item.gradient as any}
                  style={styles.iconCircle}
                >
                  <IconComponent size={44} color="#ffffff" />
                </LinearGradient>
              </View>

              <Text style={styles.slideTitle}>{item.title}</Text>
              <Text style={styles.slideDescription}>{item.description}</Text>
            </View>
          );
        }}
      />

      {/* Bottom Controls */}
      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title={currentIndex === SLIDES.length - 1 ? 'Get Started ✦' : 'Continue'}
            variant="primary"
            onPress={handleNext}
            style={styles.actionBtn}
          />
        </View>

        {/* Existing User Login Prompt */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf8f4',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primaryDark,
    fontFamily: Fonts.serif,
  },
  ornament: {
    color: Colors.gold,
    fontSize: 14,
  },
  skipBtn: {
    padding: Spacing.xs,
  },
  skipText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl * 1.5,
  },
  iconCircleContainer: {
    marginBottom: Spacing.xxl,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  slideTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.primaryDark,
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: 34,
    fontFamily: Fonts.serif,
  },
  slideDescription: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: Colors.primaryMedium,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#e8ddd8',
  },
  buttonContainer: {
    marginBottom: Spacing.md,
  },
  actionBtn: {
    width: '100%',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  loginLink: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
});
