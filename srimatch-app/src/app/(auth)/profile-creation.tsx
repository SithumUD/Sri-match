import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, Radius, Shadows } from '../../constants/theme';
import { CustomInput } from '../../components/ui/CustomInput';
import { CustomButton } from '../../components/ui/CustomButton';
import {
  User,
  MapPin,
  GraduationCap,
  Activity,
  Users,
  Heart,
  Star,
  CheckCircle,
  Camera,
  Plus,
  Trash2,
  Sparkles,
  Shield,
  Clock,
  ArrowRight,
  ArrowLeft,
  Check,
  Calendar as CalendarIcon,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import useProfileStore from '../../store/useProfileStore';
import useAuthStore from '../../store/useAuthStore';
import ProfileService from '../../services/profile.service';
import * as ImagePicker from 'expo-image-picker';
import { DatePickerModal } from '../../components/ui/DatePickerModal';

const PROFILE_OPTIONS = {
  maritalStatus: ['Never Married', 'Divorced', 'Widowed', 'Separated', 'Annulled'],
  religion: ['Buddhist', 'Hindu', 'Muslim', 'Christian', 'Catholic', 'No Religion', 'Other'],
  ethnicity: ['Sinhalese', 'Tamil', 'Moor', 'Burgher', 'Malay', 'Other'],
  education: ['High School', 'Diploma', 'Bachelors', 'Masters', 'Doctorate', 'Professional Certification', 'Other'],
  bodyType: ['Slim', 'Athletic', 'Average', 'Overweight', 'Plus Size', 'Muscular'],
  complexion: ['Fair', 'Wheatish', 'Medium', 'Dusky', 'Dark'],
  smoking: ['Never', 'Occasionally', 'Regularly', 'Trying to Quit'],
  drinking: ['Never', 'Socially', 'Occasionally', 'Regularly'],
  dietary: ['Vegetarian', 'Vegan', 'Non Vegetarian', 'Pescatarian', 'No Preference'],
  districts: [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha',
    'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala',
    'Mannar', 'Matale', 'Matara', 'Moneragala', 'Mullaitivu', 'Nuwara Eliya',
    'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya',
  ],
  languages: ['Sinhala', 'Tamil', 'English', 'French', 'German', 'Japanese', 'Arabic'],
  industries: ['Technology', 'Healthcare', 'Finance', 'Education', 'Engineering', 'Arts', 'Government', 'Other'],
  incomeRanges: ['Less than 50k', '50k - 100k', '100k - 200k', '200k - 500k', 'Above 500k'],
  interests: ['Music', 'Travel', 'Photography', 'Reading', 'Movies', 'Gaming', 'Cooking', 'Sports', 'Yoga', 'Dancing'],
};

const STEPS = [
  { id: 1, label: 'Basic Info', icon: User },
  { id: 2, label: 'Location', icon: MapPin },
  { id: 3, label: 'Career', icon: GraduationCap },
  { id: 4, label: 'Lifestyle', icon: Activity },
  { id: 5, label: 'Cultural', icon: Users },
  { id: 6, label: 'About You', icon: Heart },
  { id: 7, label: 'Preferences', icon: Star },
  { id: 8, label: 'Review', icon: CheckCircle },
];

export default function ProfileCreationScreen() {
  const router = useRouter();
  const { step, data, setStep, nextStep, prevStep, updateData } = useProfileStore();
  const { user, refreshProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDobDisplay = (dob?: string) => {
    if (!dob || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) return null;
    const parts = dob.split('-').map(Number);
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    return `${monthNames[parts[1] - 1]} ${parts[2]}, ${parts[0]}`;
  };

  const getAgeDisplay = (dob?: string) => {
    if (!dob || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) return null;
    const today = new Date();
    const b = new Date(dob);
    let age = today.getFullYear() - b.getFullYear();
    const m = today.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
    return `${age} Years Old`;
  };

  useEffect(() => {
    if (user && !data.firstName && !data.lastName) {
      updateData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      });
    }
  }, [user]);

  // Photo Picker
  const handlePickPhoto = async () => {
    const totalCount = (data.profileImages || []).length + pendingImages.length;
    if (totalCount >= 6) {
      Alert.alert('Maximum Reached', 'You can upload a maximum of 6 photos.');
      return;
    }

    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission Required', 'Photo library permission is needed.');
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!res.canceled && res.assets?.[0]?.uri) {
      setPendingImages((prev) => [...prev, res.assets[0].uri]);
    }
  };

  const handleRemovePhoto = (index: number, isPending: boolean) => {
    if (isPending) {
      setPendingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      const updated = [...(data.profileImages || [])];
      updated.splice(index, 1);
      updateData({ profileImages: updated });
    }
  };

  const toggleInterest = (item: string) => {
    const current = data.interests || [];
    if (current.includes(item)) {
      updateData({ interests: current.filter((i) => i !== item) });
    } else if (current.length < 10) {
      updateData({ interests: [...current, item] });
    }
  };

  const toggleLanguage = (lang: string) => {
    const current = data.languages || [];
    if (current.includes(lang)) {
      updateData({ languages: current.filter((l) => l !== lang) });
    } else if (current.length < 5) {
      updateData({ languages: [...current, lang] });
    }
  };

  // Submission handler mapping fields and Enums
  const handleSubmit = async () => {
    if (!data.about || data.about.trim().length < 20) {
      Alert.alert('Bio Required', 'Please write at least a few sentences about yourself.');
      return;
    }

    setLoading(true);
    try {
      const mapEnum = (val?: string) => {
        if (!val) return undefined;
        return val.toUpperCase().replace(/[\s'-]+/g, '_');
      };

      const payload = {
        firstName: data.firstName || user?.firstName,
        lastName: data.lastName || user?.lastName,
        gender: data.gender ? data.gender.toUpperCase() : 'MALE',
        dateOfBirth: data.dateOfBirth || '1998-05-15',
        maritalStatus: mapEnum(data.maritalStatus) || 'NEVER_MARRIED',
        hasChildren: Boolean(data.hasChildren),
        numberOfChildren: Number(data.numberOfChildren) || 0,

        district: data.district || 'Colombo',
        city: data.city || 'Colombo',
        placeOfBirth: data.placeOfBirth || '',

        religion: mapEnum(data.religion) || 'BUDDHIST',
        ethnicity: mapEnum(data.ethnicity) || 'SINHALESE',
        religiousPractices: data.religiousPractices || '',
        languages: data.languages || ['Sinhala', 'English'],

        education: mapEnum(data.education) || 'BACHELORS',
        fieldOfStudy: data.fieldOfStudy || '',
        profession: data.profession || 'Professional',
        industry: data.industry || 'Technology',
        employer: data.employer || '',
        workLocation: data.workLocation || '',
        income: data.income || '100k - 200k',

        height: parseInt(String(data.height)) || 165,
        bodyType: mapEnum(data.bodyType) || 'AVERAGE',
        complexion: mapEnum(data.complexion) || 'FAIR',

        smoking: mapEnum(data.smoking) || 'NEVER',
        drinking: mapEnum(data.drinking) || 'NEVER',
        dietaryPreferences: mapEnum(data.dietaryPreferences) || 'NON_VEGETARIAN',
        healthHabits: data.healthHabits || '',
        lifestyle: data.lifestyle || '',

        familyBackground: data.familyBackground || '',
        culturalValues: data.culturalValues || '',
        familyInvolvement: data.familyInvolvement || '',
        weddingPreferences: data.weddingPreferences || '',

        about: data.about,
        interests: data.interests || ['Music', 'Travel'],
        favoriteThings: data.favoriteThings || {},
        travelPreferences: data.travelPreferences || '',
        personalityTraits: data.personalityTraits || '',

        partnerPreferences: data.partnerPreferences || {
          ageRange: [22, 32],
          locationPreference: 'Colombo',
          educationLevel: 'Bachelors',
          religionPreference: 'Buddhist',
          maritalStatusPreference: 'Never Married',
        },
        dealbreakers: data.dealbreakers || '',
      };

      const res: any = await ProfileService.createProfile(payload);

      // Upload pending photos
      if (pendingImages.length > 0) {
        for (let i = 0; i < pendingImages.length; i++) {
          try {
            const formData = new FormData();
            const uri = pendingImages[i];
            const fname = uri.split('/').pop() || `photo_${i}.jpg`;
            formData.append('file', { uri, name: fname, type: 'image/jpeg' } as any);
            formData.append('isPrimary', i === 0 ? 'true' : 'false');
            await ProfileService.uploadProfileImage(formData);
          } catch (e) {
            console.log('Delayed photo upload error', e);
          }
        }
      }

      await refreshProfile();

      Alert.alert(
        'Profile Created! 💍',
        'Welcome to SriMatch! Your matrimonial profile has been published.',
        [
          {
            text: 'Discover Matches ✦',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || err?.message || 'Failed to complete profile creation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerBrand}>SriMatch</Text>
          <Text style={styles.headerSub}>
            Step {step} of 8 · <Text style={styles.headerStepName}>{STEPS[step - 1].label}</Text>
          </Text>
        </View>
        <View style={styles.scorePill}>
          <Sparkles size={13} color={Colors.primaryMedium} />
          <Text style={styles.scoreText}>8 Steps</Text>
        </View>
      </View>

      {/* Sleek Progress Track */}
      <View style={styles.progressBarTrack}>
        <View style={[styles.progressBarFill, { width: `${(step / 8) * 100}%` }]} />
      </View>

      {/* Step Tabs Indicator */}
      <View style={styles.stepTabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stepTabsScroll}
        >
          {STEPS.map((s) => {
            const isActive = step === s.id;
            const isDone = step > s.id;
            const IconComp = s.icon;
            return (
              <TouchableOpacity
                key={s.id}
                activeOpacity={0.7}
                style={[
                  styles.stepTab,
                  isActive && styles.activeStepTab,
                  isDone && styles.doneStepTab,
                ]}
                onPress={() => setStep(s.id)}
              >
                <IconComp
                  size={12}
                  color={isActive ? '#ffffff' : isDone ? '#16a34a' : '#8b4e2e'}
                />
                <Text
                  style={[
                    styles.stepTabText,
                    isActive && styles.activeStepTabText,
                    isDone && styles.doneStepTabText,
                  ]}
                >
                  {s.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Form Body */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            {/* ── STEP 1: Basic Info ── */}
            {step === 1 && (
              <View style={styles.stepBlock}>
                <Text style={styles.stepHeading}>Profile Photos</Text>
                <Text style={styles.stepSubHeading}>Profiles with photos receive 5× more engagement</Text>

                <View style={styles.photoGrid}>
                  {/* Remote Photos */}
                  {(data.profileImages || []).map((uri, idx) => (
                    <View key={`remote-${idx}`} style={styles.photoBox}>
                      <Image source={{ uri }} style={styles.photoImg} />
                      <TouchableOpacity
                        style={styles.btnRemovePhoto}
                        onPress={() => handleRemovePhoto(idx, false)}
                      >
                        <Trash2 size={12} color="#ffffff" />
                      </TouchableOpacity>
                      {idx === 0 && (
                        <View style={styles.primaryPhotoBadge}>
                          <Text style={styles.primaryPhotoText}>Primary</Text>
                        </View>
                      )}
                    </View>
                  ))}

                  {/* Pending Local Photos */}
                  {pendingImages.map((uri, idx) => (
                    <View key={`pending-${idx}`} style={styles.photoBox}>
                      <Image source={{ uri }} style={styles.photoImg} />
                      <TouchableOpacity
                        style={styles.btnRemovePhoto}
                        onPress={() => handleRemovePhoto(idx, true)}
                      >
                        <Trash2 size={12} color="#ffffff" />
                      </TouchableOpacity>
                    </View>
                  ))}

                  {/* Add Slot */}
                  {(data.profileImages || []).length + pendingImages.length < 6 && (
                    <TouchableOpacity style={styles.addPhotoSlot} onPress={handlePickPhoto}>
                      <Camera size={22} color={Colors.primaryMedium} />
                      <Text style={styles.addPhotoText}>Add Photo</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Name */}
                <View style={styles.row}>
                  <CustomInput
                    label="First Name"
                    placeholder="First Name"
                    value={data.firstName || user?.firstName}
                    onChangeText={(v) => updateData({ firstName: v })}
                    containerStyle={{ flex: 1 }}
                  />
                  <CustomInput
                    label="Last Name"
                    placeholder="Last Name"
                    value={data.lastName || user?.lastName}
                    onChangeText={(v) => updateData({ lastName: v })}
                    containerStyle={{ flex: 1 }}
                  />
                </View>

                {/* Gender */}
                <Text style={styles.fieldLabel}>Gender *</Text>
                <View style={styles.genderRow}>
                  {['Male', 'Female', 'Other'].map((g) => {
                    const isSel = (data.gender || 'female').toLowerCase() === g.toLowerCase();
                    return (
                      <TouchableOpacity
                        key={g}
                        style={[styles.genderBtn, isSel && styles.selectedGenderBtn]}
                        onPress={() => updateData({ gender: g.toLowerCase() })}
                      >
                        <Text style={[styles.genderBtnText, isSel && styles.selectedGenderBtnText]}>
                          {g}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Date of Birth & Marital Status */}
                <Text style={styles.fieldLabel}>Date of Birth *</Text>
                <TouchableOpacity
                  style={styles.dobCard}
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.8}
                >
                  <View style={styles.dobIconWrap}>
                    <CalendarIcon size={20} color="#8b4e2e" />
                  </View>

                  <View style={styles.dobContent}>
                    <Text style={data.dateOfBirth ? styles.dobPrimaryText : styles.dobPlaceholderText}>
                      {formatDobDisplay(data.dateOfBirth) || 'Select your date of birth'}
                    </Text>
                    <Text style={styles.dobHintText}>
                      {data.dateOfBirth ? `Born on ${data.dateOfBirth}` : 'Tap to choose birth date'}
                    </Text>
                  </View>

                  {getAgeDisplay(data.dateOfBirth) ? (
                    <View style={styles.dobAgePill}>
                      <CheckCircle size={12} color="#15803d" />
                      <Text style={styles.dobAgePillText}>{getAgeDisplay(data.dateOfBirth)}</Text>
                    </View>
                  ) : (
                    <View style={styles.dobSelectPill}>
                      <Text style={styles.dobSelectPillText}>Choose 📅</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <Text style={styles.fieldLabel}>Marital Status *</Text>
                <View style={styles.chipsRow}>
                  {PROFILE_OPTIONS.maritalStatus.map((m) => {
                    const isSel = data.maritalStatus === m;
                    return (
                      <TouchableOpacity
                        key={m}
                        style={[styles.chipBtn, isSel && styles.selectedChipBtn]}
                        onPress={() => updateData({ maritalStatus: m })}
                      >
                        <Text style={[styles.chipBtnText, isSel && styles.selectedChipBtnText]}>{m}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* ── STEP 2: Location & Heritage ── */}
            {step === 2 && (
              <View style={styles.stepBlock}>
                <Text style={styles.stepHeading}>Location & Heritage</Text>
                <Text style={styles.stepSubHeading}>Where you are based and your background</Text>

                <Text style={styles.fieldLabel}>District *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    {PROFILE_OPTIONS.districts.map((d) => {
                      const isSel = data.district === d;
                      return (
                        <TouchableOpacity
                          key={d}
                          style={[styles.chipBtn, isSel && styles.selectedChipBtn]}
                          onPress={() => updateData({ district: d })}
                        >
                          <Text style={[styles.chipBtnText, isSel && styles.selectedChipBtnText]}>{d}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>

                <CustomInput
                  label="City / Town *"
                  placeholder="e.g. Colombo 03, Dehiwala, Kandy"
                  value={data.city}
                  onChangeText={(v) => updateData({ city: v })}
                />

                <CustomInput
                  label="Place of Birth"
                  placeholder="e.g. Matara, Kandy"
                  value={data.placeOfBirth}
                  onChangeText={(v) => updateData({ placeOfBirth: v })}
                />

                <Text style={styles.fieldLabel}>Religion *</Text>
                <View style={styles.chipsRow}>
                  {PROFILE_OPTIONS.religion.map((r) => {
                    const isSel = data.religion === r;
                    return (
                      <TouchableOpacity
                        key={r}
                        style={[styles.chipBtn, isSel && styles.selectedChipBtn]}
                        onPress={() => updateData({ religion: r })}
                      >
                        <Text style={[styles.chipBtnText, isSel && styles.selectedChipBtnText]}>{r}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.fieldLabel}>Ethnicity</Text>
                <View style={styles.chipsRow}>
                  {PROFILE_OPTIONS.ethnicity.map((e) => {
                    const isSel = data.ethnicity === e;
                    return (
                      <TouchableOpacity
                        key={e}
                        style={[styles.chipBtn, isSel && styles.selectedChipBtn]}
                        onPress={() => updateData({ ethnicity: e })}
                      >
                        <Text style={[styles.chipBtnText, isSel && styles.selectedChipBtnText]}>{e}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.fieldLabel}>Languages Spoken</Text>
                <View style={styles.chipsRow}>
                  {PROFILE_OPTIONS.languages.map((l) => {
                    const isSel = (data.languages || []).includes(l);
                    return (
                      <TouchableOpacity
                        key={l}
                        style={[styles.chipBtn, isSel && styles.selectedChipBtn]}
                        onPress={() => toggleLanguage(l)}
                      >
                        <Text style={[styles.chipBtnText, isSel && styles.selectedChipBtnText]}>{l}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* ── STEP 3: Career & Education ── */}
            {step === 3 && (
              <View style={styles.stepBlock}>
                <Text style={styles.stepHeading}>Career & Education</Text>
                <Text style={styles.stepSubHeading}>Your academic achievements and profession</Text>

                <Text style={styles.fieldLabel}>Education Level *</Text>
                <View style={styles.chipsRow}>
                  {PROFILE_OPTIONS.education.map((ed) => {
                    const isSel = data.education === ed;
                    return (
                      <TouchableOpacity
                        key={ed}
                        style={[styles.chipBtn, isSel && styles.selectedChipBtn]}
                        onPress={() => updateData({ education: ed })}
                      >
                        <Text style={[styles.chipBtnText, isSel && styles.selectedChipBtnText]}>{ed}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <CustomInput
                  label="Field of Study"
                  placeholder="e.g. Computer Science, Medicine, Law"
                  value={data.fieldOfStudy}
                  onChangeText={(v) => updateData({ fieldOfStudy: v })}
                />

                <CustomInput
                  label="Profession / Job Title *"
                  placeholder="e.g. Software Engineer, Doctor, Accountant"
                  value={data.profession}
                  onChangeText={(v) => updateData({ profession: v })}
                />

                <Text style={styles.fieldLabel}>Industry</Text>
                <View style={styles.chipsRow}>
                  {PROFILE_OPTIONS.industries.map((ind) => {
                    const isSel = data.industry === ind;
                    return (
                      <TouchableOpacity
                        key={ind}
                        style={[styles.chipBtn, isSel && styles.selectedChipBtn]}
                        onPress={() => updateData({ industry: ind })}
                      >
                        <Text style={[styles.chipBtnText, isSel && styles.selectedChipBtnText]}>{ind}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <CustomInput
                  label="Employer / Company"
                  placeholder="e.g. WSO2, Commercial Bank"
                  value={data.employer}
                  onChangeText={(v) => updateData({ employer: v })}
                />

                <Text style={styles.fieldLabel}>Monthly Income Range (LKR)</Text>
                <View style={styles.chipsRow}>
                  {PROFILE_OPTIONS.incomeRanges.map((inc) => {
                    const isSel = data.income === inc;
                    return (
                      <TouchableOpacity
                        key={inc}
                        style={[styles.chipBtn, isSel && styles.selectedChipBtn]}
                        onPress={() => updateData({ income: inc })}
                      >
                        <Text style={[styles.chipBtnText, isSel && styles.selectedChipBtnText]}>{inc}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* ── STEP 4: Lifestyle & Appearance ── */}
            {step === 4 && (
              <View style={styles.stepBlock}>
                <Text style={styles.stepHeading}>Lifestyle & Appearance</Text>
                <Text style={styles.stepSubHeading}>Height, habits, and physical appearance</Text>

                <CustomInput
                  label="Height (cm)"
                  placeholder="e.g. 168"
                  keyboardType="numeric"
                  value={String(data.height || '')}
                  onChangeText={(v) => updateData({ height: v })}
                />

                <Text style={styles.fieldLabel}>Body Type</Text>
                <View style={styles.chipsRow}>
                  {PROFILE_OPTIONS.bodyType.map((bt) => {
                    const isSel = data.bodyType === bt;
                    return (
                      <TouchableOpacity
                        key={bt}
                        style={[styles.chipBtn, isSel && styles.selectedChipBtn]}
                        onPress={() => updateData({ bodyType: bt })}
                      >
                        <Text style={[styles.chipBtnText, isSel && styles.selectedChipBtnText]}>{bt}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.fieldLabel}>Complexion</Text>
                <View style={styles.chipsRow}>
                  {PROFILE_OPTIONS.complexion.map((c) => {
                    const isSel = data.complexion === c;
                    return (
                      <TouchableOpacity
                        key={c}
                        style={[styles.chipBtn, isSel && styles.selectedChipBtn]}
                        onPress={() => updateData({ complexion: c })}
                      >
                        <Text style={[styles.chipBtnText, isSel && styles.selectedChipBtnText]}>{c}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.fieldLabel}>Dietary Preference</Text>
                <View style={styles.chipsRow}>
                  {PROFILE_OPTIONS.dietary.map((d) => {
                    const isSel = data.dietaryPreferences === d;
                    return (
                      <TouchableOpacity
                        key={d}
                        style={[styles.chipBtn, isSel && styles.selectedChipBtn]}
                        onPress={() => updateData({ dietaryPreferences: d })}
                      >
                        <Text style={[styles.chipBtnText, isSel && styles.selectedChipBtnText]}>{d}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.fieldLabel}>Smoking Habits</Text>
                <View style={styles.chipsRow}>
                  {PROFILE_OPTIONS.smoking.map((s) => {
                    const isSel = data.smoking === s;
                    return (
                      <TouchableOpacity
                        key={s}
                        style={[styles.chipBtn, isSel && styles.selectedChipBtn]}
                        onPress={() => updateData({ smoking: s })}
                      >
                        <Text style={[styles.chipBtnText, isSel && styles.selectedChipBtnText]}>{s}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.fieldLabel}>Drinking Habits</Text>
                <View style={styles.chipsRow}>
                  {PROFILE_OPTIONS.drinking.map((dr) => {
                    const isSel = data.drinking === dr;
                    return (
                      <TouchableOpacity
                        key={dr}
                        style={[styles.chipBtn, isSel && styles.selectedChipBtn]}
                        onPress={() => updateData({ drinking: dr })}
                      >
                        <Text style={[styles.chipBtnText, isSel && styles.selectedChipBtnText]}>{dr}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* ── STEP 5: Cultural & Family ── */}
            {step === 5 && (
              <View style={styles.stepBlock}>
                <Text style={styles.stepHeading}>Family & Cultural Values</Text>
                <Text style={styles.stepSubHeading}>Share your family background and traditions</Text>

                <CustomInput
                  label="Family Background"
                  placeholder="e.g. Father is a retired engineer, mother a teacher, one younger brother..."
                  multiline
                  numberOfLines={3}
                  value={data.familyBackground}
                  onChangeText={(v) => updateData({ familyBackground: v })}
                />

                <CustomInput
                  label="Cultural Values & Traditions"
                  placeholder="e.g. Traditional values, family gatherings, festivals..."
                  multiline
                  numberOfLines={2}
                  value={data.culturalValues}
                  onChangeText={(v) => updateData({ culturalValues: v })}
                />

                <CustomInput
                  label="Wedding Preferences"
                  placeholder="e.g. Traditional ceremony, Poruwa ceremony, simple registration..."
                  multiline
                  numberOfLines={2}
                  value={data.weddingPreferences}
                  onChangeText={(v) => updateData({ weddingPreferences: v })}
                />
              </View>
            )}

            {/* ── STEP 6: About You & Interests ── */}
            {step === 6 && (
              <View style={styles.stepBlock}>
                <Text style={styles.stepHeading}>About You & Passions</Text>
                <Text style={styles.stepSubHeading}>Let prospective matches know your personality</Text>

                <CustomInput
                  label="About Me Bio *"
                  placeholder="Write a genuine introduction about yourself, your hobbies, and what you value in life..."
                  multiline
                  numberOfLines={5}
                  value={data.about}
                  onChangeText={(v) => updateData({ about: v })}
                />

                <Text style={styles.fieldLabel}>Interests & Passions (Choose 3–10) *</Text>
                <View style={styles.chipsRow}>
                  {PROFILE_OPTIONS.interests.map((int) => {
                    const isSel = (data.interests || []).includes(int);
                    return (
                      <TouchableOpacity
                        key={int}
                        style={[styles.chipBtn, isSel && styles.selectedChipBtn]}
                        onPress={() => toggleInterest(int)}
                      >
                        <Text style={[styles.chipBtnText, isSel && styles.selectedChipBtnText]}>{int}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <CustomInput
                  label="Favorite Food / Dishes"
                  placeholder="e.g. Rice & Curry, Seafood, Italian"
                  value={data.favoriteThings?.food}
                  onChangeText={(v) =>
                    updateData({ favoriteThings: { ...data.favoriteThings, food: v } })
                  }
                />

                <CustomInput
                  label="Favorite Movies / Shows"
                  placeholder="e.g. Drama, Comedy, Documentaries"
                  value={data.favoriteThings?.movies}
                  onChangeText={(v) =>
                    updateData({ favoriteThings: { ...data.favoriteThings, movies: v } })
                  }
                />

                <CustomInput
                  label="Travel Preferences"
                  placeholder="e.g. Nature trips, hill country, beach resorts"
                  value={data.travelPreferences}
                  onChangeText={(v) => updateData({ travelPreferences: v })}
                />
              </View>
            )}

            {/* ── STEP 7: Partner Preferences & Dealbreakers ── */}
            {step === 7 && (
              <View style={styles.stepBlock}>
                <Text style={styles.stepHeading}>Partner Preferences</Text>
                <Text style={styles.stepSubHeading}>What you are looking for in your ideal match</Text>

                <CustomInput
                  label="Location Preference"
                  placeholder="e.g. Western Province, Kandy, Open to relocate"
                  value={data.partnerPreferences?.locationPreference}
                  onChangeText={(v) =>
                    updateData({
                      partnerPreferences: { ...data.partnerPreferences, locationPreference: v },
                    })
                  }
                />

                <Text style={styles.fieldLabel}>Preferred Education Level</Text>
                <View style={styles.chipsRow}>
                  {PROFILE_OPTIONS.education.map((ed) => {
                    const isSel = data.partnerPreferences?.educationLevel === ed;
                    return (
                      <TouchableOpacity
                        key={ed}
                        style={[styles.chipBtn, isSel && styles.selectedChipBtn]}
                        onPress={() =>
                          updateData({
                            partnerPreferences: { ...data.partnerPreferences, educationLevel: ed },
                          })
                        }
                      >
                        <Text style={[styles.chipBtnText, isSel && styles.selectedChipBtnText]}>{ed}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.fieldLabel}>Preferred Religion</Text>
                <View style={styles.chipsRow}>
                  {[...PROFILE_OPTIONS.religion, 'Open to All'].map((rel) => {
                    const isSel = data.partnerPreferences?.religionPreference === rel;
                    return (
                      <TouchableOpacity
                        key={rel}
                        style={[styles.chipBtn, isSel && styles.selectedChipBtn]}
                        onPress={() =>
                          updateData({
                            partnerPreferences: { ...data.partnerPreferences, religionPreference: rel },
                          })
                        }
                      >
                        <Text style={[styles.chipBtnText, isSel && styles.selectedChipBtnText]}>{rel}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <CustomInput
                  label="Dealbreakers & Essential Criteria"
                  placeholder="e.g. Non-smoker, honesty, career ambition..."
                  multiline
                  numberOfLines={3}
                  value={data.dealbreakers}
                  onChangeText={(v) => updateData({ dealbreakers: v })}
                />
              </View>
            )}

            {/* ── STEP 8: Review & Complete ── */}
            {step === 8 && (
              <View style={styles.stepBlock}>
                <Text style={styles.stepHeading}>Review Your Profile</Text>
                <Text style={styles.stepSubHeading}>Verify your details before completing setup</Text>

                <View style={styles.reviewSummaryCard}>
                  <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Full Name:</Text>
                    <Text style={styles.reviewVal}>{data.firstName || user?.firstName} {data.lastName || user?.lastName}</Text>
                  </View>
                  <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Gender & DOB:</Text>
                    <Text style={styles.reviewVal}>{data.gender?.toUpperCase()} · {data.dateOfBirth}</Text>
                  </View>
                  <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Location:</Text>
                    <Text style={styles.reviewVal}>{data.city}, {data.district}</Text>
                  </View>
                  <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Profession:</Text>
                    <Text style={styles.reviewVal}>{data.profession} ({data.education})</Text>
                  </View>
                  <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Religion & Ethnicity:</Text>
                    <Text style={styles.reviewVal}>{data.religion} · {data.ethnicity}</Text>
                  </View>
                  <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Photos Attached:</Text>
                    <Text style={styles.reviewVal}>{(data.profileImages || []).length + pendingImages.length} Photo(s)</Text>
                  </View>
                </View>

                <View style={styles.privacyNote}>
                  <Shield size={16} color={Colors.primaryMedium} />
                  <Text style={styles.privacyNoteText}>
                    Your contact details are kept strictly private. Only approved matches will connect with you.
                  </Text>
                </View>
              </View>
            )}

            {/* Navigation Buttons */}
            <View style={styles.navRow}>
              {step > 1 && (
                <TouchableOpacity style={styles.btnPrev} onPress={prevStep}>
                  <ArrowLeft size={16} color="#6b4a3a" />
                  <Text style={styles.btnPrevText}>Back</Text>
                </TouchableOpacity>
              )}

              {step < 8 ? (
                <TouchableOpacity style={styles.btnNext} onPress={nextStep}>
                  <Text style={styles.btnNextText}>Continue</Text>
                  <ArrowRight size={16} color="#ffffff" />
                </TouchableOpacity>
              ) : (
                <CustomButton
                  title={loading ? 'Publishing Profile...' : 'Complete Profile & Match ✦'}
                  variant="primary"
                  onPress={handleSubmit}
                  loading={loading}
                  disabled={loading}
                  style={{ flex: 1 }}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date of Birth Calendar Picker Modal */}
      <DatePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelectDate={(date) => updateData({ dateOfBirth: date })}
        initialDate={data.dateOfBirth || '1998-05-15'}
      />
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
    paddingHorizontal: Spacing.base,
    paddingTop: Platform.OS === 'android' ? 8 : 4,
    paddingBottom: 6,
    backgroundColor: '#ffffff',
  },
  headerLeft: {
    gap: 1,
  },
  headerBrand: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryDark,
    fontFamily: Fonts.serif,
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  headerStepName: {
    fontWeight: '700',
    color: '#3d1f12',
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fdf5ee',
    borderWidth: 1,
    borderColor: '#f0ddd5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  scoreText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primaryMedium,
  },
  progressBarTrack: {
    width: '100%',
    height: 3,
    backgroundColor: '#ede5e0',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primaryDark,
  },
  stepTabsWrapper: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0ddd5',
  },
  stepTabsScroll: {
    paddingHorizontal: Spacing.base,
    paddingVertical: 6,
    gap: 6,
    alignItems: 'center',
  },
  stepTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: '#f5ede8',
    borderWidth: 1,
    borderColor: '#ede2dc',
  },
  activeStepTab: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primaryDark,
  },
  doneStepTab: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  stepTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b4a3a',
  },
  activeStepTabText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  doneStepTabText: {
    color: '#16a34a',
    fontWeight: '600',
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: 60,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: '#f0ddd5',
    ...Shadows.card,
  },
  stepBlock: {
    gap: 4,
  },
  stepHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2d1810',
    fontFamily: Fonts.serif,
  },
  stepSubHeading: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4a3028',
    marginTop: Spacing.xs,
    marginBottom: 6,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.md,
  },
  genderBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: '#e8ddd8',
    backgroundColor: '#fdf8f4',
    alignItems: 'center',
  },
  selectedGenderBtn: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primaryDark,
  },
  genderBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b4a3a',
  },
  selectedGenderBtnText: {
    color: '#ffffff',
  },
  dobCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e8ddd8',
    borderRadius: Radius.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: Spacing.md,
    gap: 12,
    ...Shadows.subtle,
  },
  dobIconWrap: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    backgroundColor: '#fdf5ee',
    borderWidth: 1,
    borderColor: '#f0ddd5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dobContent: {
    flex: 1,
    gap: 1,
  },
  dobPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2d1810',
    fontFamily: Fonts.serif,
  },
  dobPlaceholderText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  dobHintText: {
    fontSize: 10,
    color: '#9a7060',
  },
  dobAgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  dobAgePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803d',
  },
  dobSelectPill: {
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  dobSelectPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Spacing.md,
  },
  chipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: '#e8ddd8',
    backgroundColor: '#fdf8f4',
  },
  selectedChipBtn: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primaryDark,
  },
  chipBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b4a3a',
  },
  selectedChipBtnText: {
    color: '#ffffff',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: Spacing.md,
  },
  photoBox: {
    width: 80,
    height: 80,
    borderRadius: Radius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  photoImg: {
    width: '100%',
    height: '100%',
  },
  btnRemovePhoto: {
    position: 'absolute',
    top: 3,
    right: 3,
    backgroundColor: 'rgba(220,38,38,0.85)',
    padding: 3,
    borderRadius: Radius.full,
  },
  primaryPhotoBadge: {
    position: 'absolute',
    bottom: 3,
    left: 3,
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  primaryPhotoText: {
    fontSize: 8,
    color: '#ffffff',
    fontWeight: '700',
  },
  addPhotoSlot: {
    width: 80,
    height: 80,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: '#c9856a',
    borderStyle: 'dashed',
    backgroundColor: '#fdf5ee',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  addPhotoText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primaryMedium,
  },
  reviewSummaryCard: {
    backgroundColor: '#fdf8f4',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#f0ddd5',
    gap: 8,
    marginBottom: Spacing.md,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  reviewVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2d1810',
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f0fdf4',
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
  },
  privacyNoteText: {
    fontSize: 11,
    color: '#166534',
    flex: 1,
    lineHeight: 16,
  },
  navRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#f0ddd5',
  },
  btnPrev: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: '#e8ddd8',
    backgroundColor: '#fdf8f4',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btnPrevText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b4a3a',
  },
  btnNext: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...Shadows.subtle,
  },
  btnNextText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
});
