import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, Radius } from '../../constants/theme';
import { X, Filter, RotateCcw, Crown, ChevronDown, Check, Sparkles } from 'lucide-react-native';
import { CustomButton } from '../ui/CustomButton';
import useAuthStore from '../../store/useAuthStore';
import { useRouter } from 'expo-router';

interface FilterModalProps {
  visible: boolean;
  filters: any;
  onClose: () => void;
  onApply: (newFilters: any) => void;
  onReset: () => void;
}

const DISTRICTS = [
  'All Districts',
  'Ampara',
  'Anuradhapura',
  'Badulla',
  'Batticaloa',
  'Colombo',
  'Galle',
  'Gampaha',
  'Hambantota',
  'Jaffna',
  'Kalutara',
  'Kandy',
  'Kegalle',
  'Kilinochchi',
  'Kurunegala',
  'Mannar',
  'Matale',
  'Matara',
  'Moneragala',
  'Mullaitivu',
  'Nuwara Eliya',
  'Polonnaruwa',
  'Puttalam',
  'Ratnapura',
  'Trincomalee',
  'Vavuniya',
];

const RELIGIONS = ['All Religions', 'Buddhist', 'Hindu', 'Muslim', 'Christian', 'Catholic', 'No Religion', 'Other'];
const ETHNICITIES = ['All Ethnicities', 'Sinhalese', 'Tamil', 'Moor', 'Burgher', 'Malay', 'Other'];
const MARITAL_STATUSES = ['Any Status', 'Never Married', 'Divorced', 'Widowed', 'Separated', 'Annulled'];
const EDUCATION_LEVELS = ['Any Education', 'Bachelors', 'Masters', 'Diploma', 'Doctorate', 'High School', 'Professional Certification', 'Other'];
const INDUSTRIES = ['Any Industry', 'Technology', 'Healthcare', 'Finance', 'Education', 'Engineering', 'Arts', 'Government', 'Other'];
const INCOME_RANGES = ['Any Income', 'Less than 50k', '50k - 100k', '100k - 200k', '200k - 500k', 'Above 500k'];
const BODY_TYPES = ['Any', 'Slim', 'Athletic', 'Average', 'Overweight', 'Plus Size', 'Muscular'];
const SMOKING_HABITS = ['Any', 'Never', 'Occasionally', 'Regularly', 'Trying to Quit'];
const DRINKING_HABITS = ['Any', 'Never', 'Socially', 'Occasionally', 'Regularly'];
const DIETARY_PREFS = ['Any', 'Vegetarian', 'Vegan', 'Non Vegetarian', 'Pescatarian', 'No Preference'];
const INTEREST_OPTIONS = ['Music', 'Travel', 'Photography', 'Reading', 'Movies', 'Gaming', 'Cooking', 'Sports', 'Yoga', 'Dancing'];

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  filters,
  onClose,
  onApply,
  onReset,
}) => {
  const router = useRouter();
  const { user } = useAuthStore();
  const isPremium = Boolean(
    user?.premium ||
    user?.isPremium ||
    user?.subscription?.plan === 'premium' ||
    user?.subscription?.plan === 'PRO' ||
    user?.subscription?.plan === 'VIP' ||
    user?.role === 'PREMIUM'
  );

  const [localFilters, setLocalFilters] = useState<any>(filters || {});
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    setLocalFilters(filters || {});
  }, [filters, visible]);

  const handleSelect = (key: string, val: any) => {
    const isAny =
      val === 'All Districts' ||
      val === 'All Religions' ||
      val === 'All Ethnicities' ||
      val === 'Any Status' ||
      val === 'Any Education' ||
      val === 'Any Industry' ||
      val === 'Any Income' ||
      val === 'Any' ||
      val === '';

    setLocalFilters((prev: any) => ({
      ...prev,
      [key]: isAny ? '' : val,
    }));
  };

  const handleToggleInterest = (interest: string) => {
    setLocalFilters((prev: any) => {
      const current = prev.interests || [];
      const updated = current.includes(interest)
        ? current.filter((i: string) => i !== interest)
        : [...current, interest];
      return { ...prev, interests: updated };
    });
  };

  const handleSave = () => {
    onApply(localFilters);
    onClose();
  };

  const handleResetFilters = () => {
    onReset();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Filter size={18} color={Colors.primaryDark} />
              <Text style={styles.headerTitle}>Filter Matches</Text>
            </View>
            <View style={styles.headerActionRow}>
              <TouchableOpacity onPress={handleResetFilters} style={styles.resetBtn}>
                <RotateCcw size={14} color={Colors.primaryMedium} />
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <X size={20} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Premium Promo banner for Free Users */}
            {!isPremium && (
              <View style={styles.premiumBanner}>
                <View style={styles.premiumBannerHeader}>
                  <Crown size={15} color="#d4a017" />
                  <Text style={styles.premiumBannerTitle}>Unlock Premium Filters</Text>
                </View>
                <Text style={styles.premiumBannerSub}>
                  Filter by Education, Income, Profession, Lifestyle and Habits to find your ideal match faster.
                </Text>
                <TouchableOpacity
                  style={styles.upgradeBtn}
                  onPress={() => {
                    onClose();
                    router.push('/(tabs)/premium');
                  }}
                >
                  <Text style={styles.upgradeBtnText}>Upgrade to Premium ✦</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* SECTION 1: BASIC FILTERS */}
            <Text style={styles.sectionHeading}>Basic Filters</Text>

            {/* Gender */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Looking For</Text>
              <View style={styles.chipRow}>
                {[
                  { label: 'Any', val: '' },
                  { label: 'Female', val: 'female' },
                  { label: 'Male', val: 'male' },
                ].map((item) => {
                  const isSelected = (localFilters.gender || '') === item.val;
                  return (
                    <TouchableOpacity
                      key={item.label}
                      style={[styles.chip, isSelected && styles.selectedChip]}
                      onPress={() => handleSelect('gender', item.val)}
                    >
                      <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Age Range Stepper */}
            <View style={styles.section}>
              <View style={styles.rangeHeader}>
                <Text style={styles.sectionLabel}>Age Range</Text>
                <Text style={styles.rangeValueText}>
                  {localFilters.ageFrom || 18} – {localFilters.ageTo || 60} years
                </Text>
              </View>
              <View style={styles.stepperRow}>
                <View style={styles.stepperCol}>
                  <Text style={styles.stepperLabel}>Min Age</Text>
                  <View style={styles.stepperControls}>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() =>
                        setLocalFilters((p: any) => ({
                          ...p,
                          ageFrom: Math.max(18, (p.ageFrom || 18) - 1),
                        }))
                      }
                    >
                      <Text style={styles.stepBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.stepperNum}>{localFilters.ageFrom || 18}</Text>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() =>
                        setLocalFilters((p: any) => ({
                          ...p,
                          ageFrom: Math.min((p.ageTo || 60) - 1, (p.ageFrom || 18) + 1),
                        }))
                      }
                    >
                      <Text style={styles.stepBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.stepperCol}>
                  <Text style={styles.stepperLabel}>Max Age</Text>
                  <View style={styles.stepperControls}>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() =>
                        setLocalFilters((p: any) => ({
                          ...p,
                          ageTo: Math.max((p.ageFrom || 18) + 1, (p.ageTo || 60) - 1),
                        }))
                      }
                    >
                      <Text style={styles.stepBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.stepperNum}>{localFilters.ageTo || 60}</Text>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() =>
                        setLocalFilters((p: any) => ({
                          ...p,
                          ageTo: Math.min(75, (p.ageTo || 60) + 1),
                        }))
                      }
                    >
                      <Text style={styles.stepBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* Marital Status */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Marital Status</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
                {MARITAL_STATUSES.map((status) => {
                  const val = status === 'Any Status' ? '' : status;
                  const isSelected = (localFilters.maritalStatus || '') === val;
                  return (
                    <TouchableOpacity
                      key={status}
                      style={[styles.chip, isSelected && styles.selectedChip]}
                      onPress={() => handleSelect('maritalStatus', val)}
                    >
                      <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
                        {status}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* City Search */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>City / Town</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Colombo, Kandy, Galle"
                placeholderTextColor={Colors.textLight}
                value={localFilters.city || ''}
                onChangeText={(text) => handleSelect('city', text)}
              />
            </View>

            {/* District */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>District</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
                {DISTRICTS.map((d) => {
                  const val = d === 'All Districts' ? '' : d;
                  const isSelected = (localFilters.district || '') === val;
                  return (
                    <TouchableOpacity
                      key={d}
                      style={[styles.chip, isSelected && styles.selectedChip]}
                      onPress={() => handleSelect('district', val)}
                    >
                      <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
                        {d}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Religion */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Religion</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
                {RELIGIONS.map((r) => {
                  const val = r === 'All Religions' ? '' : r;
                  const isSelected = (localFilters.religion || '') === val;
                  return (
                    <TouchableOpacity
                      key={r}
                      style={[styles.chip, isSelected && styles.selectedChip]}
                      onPress={() => handleSelect('religion', val)}
                    >
                      <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
                        {r}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Ethnicity */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Ethnicity</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
                {ETHNICITIES.map((e) => {
                  const val = e === 'All Ethnicities' ? '' : e;
                  const isSelected = (localFilters.ethnicity || '') === val;
                  return (
                    <TouchableOpacity
                      key={e}
                      style={[styles.chip, isSelected && styles.selectedChip]}
                      onPress={() => handleSelect('ethnicity', val)}
                    >
                      <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
                        {e}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Verified Only Toggle */}
            <View style={[styles.section, styles.toggleRow]}>
              <Text style={styles.sectionLabel}>Verified Profiles Only</Text>
              <Switch
                value={Boolean(localFilters.verified)}
                onValueChange={(v) => handleSelect('verified', v)}
                trackColor={{ false: '#e8ddd8', true: Colors.primaryMedium }}
                thumbColor="#ffffff"
              />
            </View>

            {/* SECTION 2: ADVANCED & PREMIUM FILTERS */}
            <TouchableOpacity
              style={styles.advancedToggleBtn}
              onPress={() => setShowAdvanced(!showAdvanced)}
            >
              <View style={styles.advancedToggleLeft}>
                <Crown size={16} color="#d4a017" />
                <Text style={styles.advancedToggleText}>
                  Advanced Filters {!isPremium ? '(Premium)' : ''}
                </Text>
              </View>
              <ChevronDown
                size={18}
                color={Colors.primaryMedium}
                style={{ transform: [{ rotate: showAdvanced ? '180deg' : '0deg' }] }}
              />
            </TouchableOpacity>

            {showAdvanced && (
              <View style={styles.advancedSection}>
                {/* Education */}
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Education Level</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
                    {EDUCATION_LEVELS.map((edu) => {
                      const val = edu === 'Any Education' ? '' : edu;
                      const isSelected = (localFilters.education || '') === val;
                      return (
                        <TouchableOpacity
                          key={edu}
                          style={[styles.chip, isSelected && styles.selectedChip]}
                          onPress={() => handleSelect('education', val)}
                        >
                          <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
                            {edu}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Profession Search */}
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Profession</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. Doctor, Software Engineer, Teacher"
                    placeholderTextColor={Colors.textLight}
                    value={localFilters.profession || ''}
                    onChangeText={(text) => handleSelect('profession', text)}
                  />
                </View>

                {/* Industry */}
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Industry</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
                    {INDUSTRIES.map((ind) => {
                      const val = ind === 'Any Industry' ? '' : ind;
                      const isSelected = (localFilters.industry || '') === val;
                      return (
                        <TouchableOpacity
                          key={ind}
                          style={[styles.chip, isSelected && styles.selectedChip]}
                          onPress={() => handleSelect('industry', val)}
                        >
                          <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
                            {ind}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Income */}
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Income Range</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
                    {INCOME_RANGES.map((inc) => {
                      const val = inc === 'Any Income' ? '' : inc;
                      const isSelected = (localFilters.income || '') === val;
                      return (
                        <TouchableOpacity
                          key={inc}
                          style={[styles.chip, isSelected && styles.selectedChip]}
                          onPress={() => handleSelect('income', val)}
                        >
                          <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
                            {inc}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Body Type */}
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Body Type</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
                    {BODY_TYPES.map((bt) => {
                      const val = bt === 'Any' ? '' : bt;
                      const isSelected = (localFilters.bodyType || '') === val;
                      return (
                        <TouchableOpacity
                          key={bt}
                          style={[styles.chip, isSelected && styles.selectedChip]}
                          onPress={() => handleSelect('bodyType', val)}
                        >
                          <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
                            {bt}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Smoking */}
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Smoking</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
                    {SMOKING_HABITS.map((sm) => {
                      const val = sm === 'Any' ? '' : sm;
                      const isSelected = (localFilters.smoking || '') === val;
                      return (
                        <TouchableOpacity
                          key={sm}
                          style={[styles.chip, isSelected && styles.selectedChip]}
                          onPress={() => handleSelect('smoking', val)}
                        >
                          <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
                            {sm}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Drinking */}
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Drinking</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
                    {DRINKING_HABITS.map((dr) => {
                      const val = dr === 'Any' ? '' : dr;
                      const isSelected = (localFilters.drinking || '') === val;
                      return (
                        <TouchableOpacity
                          key={dr}
                          style={[styles.chip, isSelected && styles.selectedChip]}
                          onPress={() => handleSelect('drinking', val)}
                        >
                          <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
                            {dr}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Dietary */}
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Dietary Preference</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
                    {DIETARY_PREFS.map((dp) => {
                      const val = dp === 'Any' ? '' : dp;
                      const isSelected = (localFilters.dietaryPreferences || '') === val;
                      return (
                        <TouchableOpacity
                          key={dp}
                          style={[styles.chip, isSelected && styles.selectedChip]}
                          onPress={() => handleSelect('dietaryPreferences', val)}
                        >
                          <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
                            {dp}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Interests Tags */}
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Interests & Hobbies</Text>
                  <View style={styles.interestWrap}>
                    {INTEREST_OPTIONS.map((interest) => {
                      const isSelected = (localFilters.interests || []).includes(interest);
                      return (
                        <TouchableOpacity
                          key={interest}
                          style={[styles.interestChip, isSelected && styles.selectedInterestChip]}
                          onPress={() => handleToggleInterest(interest)}
                        >
                          <Text style={[styles.interestChipText, isSelected && styles.selectedInterestChipText]}>
                            {interest}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>

          {/* Footer Action Buttons */}
          <View style={styles.footer}>
            <CustomButton
              title="Apply Filters"
              variant="primary"
              onPress={handleSave}
              style={{ flex: 1 }}
            />
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(20,6,2,0.65)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0ddd5',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d1810',
  },
  headerActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#fdf5ee',
  },
  resetText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryMedium,
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  premiumBanner: {
    backgroundColor: '#fdf5ee',
    borderWidth: 1,
    borderColor: '#f0ddd5',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  premiumBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  premiumBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4a3028',
  },
  premiumBannerSub: {
    fontSize: 12,
    color: '#9a7060',
    lineHeight: 17,
    marginBottom: 10,
  },
  upgradeBtn: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  upgradeBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: Colors.primaryMedium,
    marginBottom: 12,
  },
  section: {
    marginBottom: 18,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4a3028',
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  scrollChips: {
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fdf8f4',
    borderWidth: 1.5,
    borderColor: '#e8ddd8',
  },
  selectedChip: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primaryDark,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b4a3a',
  },
  selectedChipText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  rangeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rangeValueText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryMedium,
  },
  stepperRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stepperCol: {
    flex: 1,
    backgroundColor: '#fdf8f4',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8ddd8',
  },
  stepperLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 6,
    textAlign: 'center',
  },
  stepperControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e8ddd8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  stepperNum: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d1810',
  },
  textInput: {
    backgroundColor: '#fdf8f4',
    borderWidth: 1.5,
    borderColor: '#e8ddd8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#2d1810',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  advancedToggleBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#f0ddd5',
    borderBottomWidth: 1,
    borderBottomColor: '#f0ddd5',
    marginVertical: 14,
  },
  advancedToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  advancedToggleText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  advancedSection: {
    paddingTop: 10,
  },
  interestWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#fdf8f4',
    borderWidth: 1,
    borderColor: '#e8ddd8',
  },
  selectedInterestChip: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primaryDark,
  },
  interestChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b4a3a',
  },
  selectedInterestChipText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#f0ddd5',
    backgroundColor: '#ffffff',
  },
});
