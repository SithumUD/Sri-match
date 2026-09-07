import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, Radius, Shadows } from '../constants/theme';
import { GradientHeader } from '../components/ui/GradientHeader';
import { CustomInput } from '../components/ui/CustomInput';
import { CustomButton } from '../components/ui/CustomButton';
import ProfileService from '../services/profile.service';
import {
  Camera,
  Plus,
  Trash2,
  User,
  MapPin,
  BookOpen,
  GraduationCap,
  Activity,
  Sparkles,
  Target,
  Check,
  Star,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import useAuthStore from '../store/useAuthStore';
import { useRouter } from 'expo-router';

const DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Moneragala', 'Ratnapura', 'Kegalle',
];

const RELIGIONS = ['Buddhist', 'Hindu', 'Muslim', 'Christian', 'Catholic', 'No Religion', 'Other'];
const ETHNICITIES = ['Sinhalese', 'Tamil', 'Moor', 'Burgher', 'Malay', 'Other'];
const MARITAL_STATUSES = ['Never Married', 'Divorced', 'Widowed', 'Separated', 'Annulled'];
const EDUCATION_LEVELS = ['High School', 'Diploma', 'Bachelors', 'Masters', 'Doctorate', 'Professional Certification', 'Other'];
const BODY_TYPES = ['Slim', 'Athletic', 'Average', 'Overweight', 'Plus Size', 'Muscular'];
const COMPLEXIONS = ['Fair', 'Wheatish', 'Medium', 'Dusky', 'Dark'];
const SMOKING_HABITS = ['Never', 'Occasionally', 'Regularly', 'Trying to Quit'];
const DRINKING_HABITS = ['Never', 'Socially', 'Occasionally', 'Regularly'];
const DIETARY_PREFS = ['Vegetarian', 'Vegan', 'Non Vegetarian', 'Pescatarian', 'No Preference'];
const INDUSTRIES = ['Technology', 'Healthcare', 'Finance', 'Education', 'Engineering', 'Arts', 'Government', 'Other'];
const INCOME_RANGES = ['Less than 50k', '50k - 100k', '100k - 200k', '200k - 500k', 'Above 500k'];
const INTEREST_OPTIONS = ['Music', 'Travel', 'Photography', 'Reading', 'Movies', 'Gaming', 'Cooking', 'Sports', 'Yoga', 'Dancing'];

type EditTab = 'basic' | 'location' | 'religion' | 'career' | 'lifestyle' | 'interests' | 'preferences';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, refreshProfile } = useAuthStore();

  const [activeTab, setActiveTab] = useState<EditTab>('basic');
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);

  const [formData, setFormData] = useState<any>({
    firstName: '',
    lastName: '',
    gender: 'female',
    dateOfBirth: '',
    maritalStatus: 'Never Married',
    hasChildren: false,
    height: 165,
    bodyType: 'Average',
    complexion: 'Fair',
    ethnicity: 'Sinhalese',
    city: '',
    district: 'Colombo',
    placeOfBirth: '',
    religion: 'Buddhist',
    religiousPractices: '',
    languages: ['Sinhala', 'English'],
    familyBackground: '',
    familyType: 'Nuclear',
    weddingPreferences: '',
    education: "Bachelor's Degree",
    educationLevel: 'Bachelors',
    fieldOfStudy: '',
    profession: '',
    industry: 'Technology',
    employer: '',
    workLocation: 'Colombo',
    income: '100k - 200k',
    relocationWillingness: 'Within Sri Lanka',
    dietaryPreferences: 'Non Vegetarian',
    smoking: 'Never',
    drinking: 'Never',
    healthHabits: '',
    lifestyle: '',
    about: '',
    interests: ['Music', 'Travel'],
    dealbreakers: '',
    favoriteThings: {
      food: '',
      movies: '',
      books: '',
      places: '',
    },
    partnerPreferences: {
      minAge: 24,
      maxAge: 32,
      minHeight: 155,
      maxHeight: 185,
      religion: 'Any',
      educationLevel: 'Bachelors',
    },
  });

  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    loadFullProfile();
  }, []);

  const loadFullProfile = async () => {
    try {
      setFetchingProfile(true);
      const res: any = await ProfileService.getMyProfile();
      const p = res?.data || res || {};

      setFormData((prev: any) => ({
        ...prev,
        firstName: p.firstName || user?.firstName || '',
        lastName: p.lastName || user?.lastName || '',
        gender: p.gender || 'female',
        dateOfBirth: p.dateOfBirth ? String(p.dateOfBirth).split('T')[0] : '',
        maritalStatus: p.maritalStatus || 'Never Married',
        hasChildren: Boolean(p.hasChildren),
        height: p.height || 165,
        bodyType: p.bodyType || 'Average',
        complexion: p.complexion || 'Fair',
        ethnicity: p.ethnicity || 'Sinhalese',
        city: p.city || '',
        district: p.district || 'Colombo',
        placeOfBirth: p.placeOfBirth || '',
        religion: p.religion || 'Buddhist',
        religiousPractices: p.religiousPractices || '',
        languages: Array.isArray(p.languages) ? p.languages : ['Sinhala', 'English'],
        familyBackground: p.familyBackground || '',
        familyType: p.familyType || 'Nuclear',
        weddingPreferences: p.weddingPreferences || '',
        education: p.education || p.educationLevel || "Bachelor's Degree",
        educationLevel: p.educationLevel || p.education || 'Bachelors',
        fieldOfStudy: p.fieldOfStudy || '',
        profession: p.profession || '',
        industry: p.industry || 'Technology',
        employer: p.employer || '',
        workLocation: p.workLocation || '',
        income: p.income || '100k - 200k',
        relocationWillingness: p.relocationWillingness || 'Within Sri Lanka',
        dietaryPreferences: p.dietaryPreferences || 'Non Vegetarian',
        smoking: p.smoking || 'Never',
        drinking: p.drinking || 'Never',
        healthHabits: p.healthHabits || '',
        lifestyle: p.lifestyle || '',
        about: p.about || '',
        interests: Array.isArray(p.interests) ? p.interests : ['Music', 'Travel'],
        dealbreakers: p.dealbreakers || '',
        favoriteThings: p.favoriteThings || { food: '', movies: '', books: '', places: '' },
        partnerPreferences: p.partnerPreferences || { minAge: 24, maxAge: 32, minHeight: 155, maxHeight: 185 },
      }));

      const profileImages =
        (Array.isArray(p.profileImages) && p.profileImages.length > 0 && p.profileImages) ||
        (Array.isArray(p.images) && p.images.length > 0 && p.images) ||
        (p.primaryImageUrl && [p.primaryImageUrl]) ||
        [];
      setImages(profileImages);
    } catch (e) {
      console.warn('Could not load profile details', e);
    } finally {
      setFetchingProfile(false);
    }
  };

  const handleChange = (key: string, val: any) => {
    setFormData((p: any) => ({ ...p, [key]: val }));
  };

  const handleFavoriteChange = (key: string, val: string) => {
    setFormData((p: any) => ({
      ...p,
      favoriteThings: { ...(p.favoriteThings || {}), [key]: val },
    }));
  };

  const handlePartnerPrefChange = (key: string, val: any) => {
    setFormData((p: any) => ({
      ...p,
      partnerPreferences: { ...(p.partnerPreferences || {}), [key]: val },
    }));
  };

  const handleToggleInterest = (interest: string) => {
    setFormData((p: any) => {
      const cur = p.interests || [];
      const updated = cur.includes(interest)
        ? cur.filter((i: string) => i !== interest)
        : [...cur, interest];
      return { ...p, interests: updated };
    });
  };

  const handleAddPhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission Required', 'Photo library permission is needed to add photos.');
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!res.canceled && res.assets?.[0]?.uri) {
      const uri = res.assets[0].uri;
      try {
        const fData = new FormData();
        const fName = uri.split('/').pop() || 'photo.jpg';
        fData.append('file', { uri, name: fName, type: 'image/jpeg' } as any);
        fData.append('isPrimary', String(images.length === 0));

        const uploadRes: any = await ProfileService.uploadProfileImage(fData);
        if (uploadRes?.data?.profileImages) {
          setImages(uploadRes.data.profileImages);
        } else if (uploadRes?.data?.primaryImageUrl) {
          setImages((prev) => [...prev, uploadRes.data.primaryImageUrl]);
        }
        await refreshProfile();
        Alert.alert('Photo Uploaded', 'Your profile picture has been updated.');
      } catch (e: any) {
        Alert.alert('Upload Failed', e?.response?.data?.message || e?.message || 'Could not upload image.');
      }
    }
  };

  const handleDeletePhoto = async (target: any) => {
    const imageUrl = typeof target === 'string' ? target : (target?.imageUrl || target?.url || target?.id);
    if (!imageUrl) return;

    Alert.alert('Delete Photo', 'Are you sure you want to remove this profile photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await ProfileService.deleteProfileImage(imageUrl);
            setImages((prev) =>
              prev.filter((img) => (typeof img === 'string' ? img : (img?.imageUrl || img?.url || img?.id)) !== imageUrl)
            );
            await refreshProfile();
          } catch (e) {
            console.warn('Could not delete image', e);
          }
        },
      },
    ]);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await ProfileService.updateProfile(formData);
      await refreshProfile();
      Alert.alert('Profile Updated! ✦', 'Your changes have been saved successfully.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || e?.message || 'Could not update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProfile) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primaryMedium} />
        <Text style={styles.loadingText}>Loading your profile details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GradientHeader title="Edit Profile" subtitle="Update your personal details & photos" showBack />

      {/* Tabs Navigation */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {[
            { key: 'basic', label: 'Basic', icon: User },
            { key: 'location', label: 'Location', icon: MapPin },
            { key: 'religion', label: 'Culture & Family', icon: BookOpen },
            { key: 'career', label: 'Career', icon: GraduationCap },
            { key: 'lifestyle', label: 'Lifestyle', icon: Activity },
            { key: 'interests', label: 'Interests', icon: Sparkles },
            { key: 'preferences', label: 'Preferences', icon: Target },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabBtn, isActive && styles.activeTabBtn]}
                onPress={() => setActiveTab(tab.key as EditTab)}
              >
                <Icon size={14} color={isActive ? Colors.primaryDark : Colors.textMuted} />
                <Text style={[styles.tabBtnText, isActive && styles.activeTabBtnText]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Photo Gallery Manager (Always Visible on Top) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Photo Gallery ({images.length}/6)</Text>
          <Text style={styles.cardSub}>Upload high-quality portrait photos to increase match rate.</Text>

          <View style={styles.photoGrid}>
            {images.map((img: any, idx: number) => {
              const uri = typeof img === 'string' ? img : (img?.imageUrl || img?.url);
              return (
                <View key={idx} style={styles.photoWrap}>
                  <Image source={{ uri }} style={styles.photoItem} resizeMode="cover" />
                  {idx === 0 && (
                    <View style={styles.primaryBadge}>
                      <Text style={styles.primaryBadgeText}>PRIMARY</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.deletePhotoBtn}
                    onPress={() => handleDeletePhoto(img)}
                  >
                    <Trash2 size={12} color="#fff" />
                  </TouchableOpacity>
                </View>
              );
            })}

            {images.length < 6 && (
              <TouchableOpacity style={styles.addPhotoBox} onPress={handleAddPhoto}>
                <Plus size={24} color={Colors.primaryMedium} />
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* SECTION 1: BASIC INFO */}
        {activeTab === 'basic' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Basic Identity</Text>

            <CustomInput
              label="First Name"
              value={formData.firstName}
              onChangeText={(v) => handleChange('firstName', v)}
            />

            <CustomInput
              label="Last Name"
              value={formData.lastName}
              onChangeText={(v) => handleChange('lastName', v)}
            />

            <Text style={styles.inputLabel}>Gender</Text>
            <View style={styles.chipRow}>
              {['female', 'male'].map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.chip, formData.gender === g && styles.selectedChip]}
                  onPress={() => handleChange('gender', g)}
                >
                  <Text style={[styles.chipText, formData.gender === g && styles.selectedChipText]}>
                    {g.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <CustomInput
              label="Date of Birth (YYYY-MM-DD)"
              value={formData.dateOfBirth}
              placeholder="e.g. 1996-05-14"
              onChangeText={(v) => handleChange('dateOfBirth', v)}
            />

            <Text style={styles.inputLabel}>Marital Status</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
              {MARITAL_STATUSES.map((ms) => (
                <TouchableOpacity
                  key={ms}
                  style={[styles.chip, formData.maritalStatus === ms && styles.selectedChip]}
                  onPress={() => handleChange('maritalStatus', ms)}
                >
                  <Text style={[styles.chipText, formData.maritalStatus === ms && styles.selectedChipText]}>
                    {ms}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <CustomInput
              label="Height (in cm)"
              value={String(formData.height || 165)}
              keyboardType="numeric"
              onChangeText={(v) => handleChange('height', Number(v))}
            />

            <Text style={styles.inputLabel}>Body Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
              {BODY_TYPES.map((bt) => (
                <TouchableOpacity
                  key={bt}
                  style={[styles.chip, formData.bodyType === bt && styles.selectedChip]}
                  onPress={() => handleChange('bodyType', bt)}
                >
                  <Text style={[styles.chipText, formData.bodyType === bt && styles.selectedChipText]}>
                    {bt}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.inputLabel}>Complexion</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
              {COMPLEXIONS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.chip, formData.complexion === c && styles.selectedChip]}
                  onPress={() => handleChange('complexion', c)}
                >
                  <Text style={[styles.chipText, formData.complexion === c && styles.selectedChipText]}>
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* SECTION 2: LOCATION */}
        {activeTab === 'location' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Location & Origins</Text>

            <CustomInput
              label="Current City / Town"
              value={formData.city}
              placeholder="e.g. Colombo, Kandy, Nugegoda"
              onChangeText={(v) => handleChange('city', v)}
            />

            <Text style={styles.inputLabel}>District</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
              {DISTRICTS.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.chip, formData.district === d && styles.selectedChip]}
                  onPress={() => handleChange('district', d)}
                >
                  <Text style={[styles.chipText, formData.district === d && styles.selectedChipText]}>
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <CustomInput
              label="Place of Birth"
              value={formData.placeOfBirth}
              placeholder="e.g. Kurunegala, Jaffna, Galle"
              onChangeText={(v) => handleChange('placeOfBirth', v)}
            />
          </View>
        )}

        {/* SECTION 3: RELIGION, CULTURE & FAMILY */}
        {activeTab === 'religion' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Cultural & Family Heritage</Text>

            <Text style={styles.inputLabel}>Religion</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
              {RELIGIONS.map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.chip, formData.religion === r && styles.selectedChip]}
                  onPress={() => handleChange('religion', r)}
                >
                  <Text style={[styles.chipText, formData.religion === r && styles.selectedChipText]}>
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <CustomInput
              label="Religious Practices / Values"
              value={formData.religiousPractices}
              placeholder="e.g. Regular temple visits, devout, moderate"
              onChangeText={(v) => handleChange('religiousPractices', v)}
            />

            <Text style={styles.inputLabel}>Ethnicity</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
              {ETHNICITIES.map((e) => (
                <TouchableOpacity
                  key={e}
                  style={[styles.chip, formData.ethnicity === e && styles.selectedChip]}
                  onPress={() => handleChange('ethnicity', e)}
                >
                  <Text style={[styles.chipText, formData.ethnicity === e && styles.selectedChipText]}>
                    {e}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <CustomInput
              label="Family Background & Siblings"
              value={formData.familyBackground}
              placeholder="e.g. Parents are retired teachers, 1 younger brother"
              multiline
              numberOfLines={3}
              onChangeText={(v) => handleChange('familyBackground', v)}
            />

            <CustomInput
              label="Wedding Preferences"
              value={formData.weddingPreferences}
              placeholder="e.g. Traditional Poruwa ceremony with close family"
              onChangeText={(v) => handleChange('weddingPreferences', v)}
            />
          </View>
        )}

        {/* SECTION 4: CAREER & EDUCATION */}
        {activeTab === 'career' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Education & Career</Text>

            <Text style={styles.inputLabel}>Education Level</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
              {EDUCATION_LEVELS.map((edu) => (
                <TouchableOpacity
                  key={edu}
                  style={[styles.chip, formData.educationLevel === edu && styles.selectedChip]}
                  onPress={() => {
                    handleChange('educationLevel', edu);
                    handleChange('education', edu);
                  }}
                >
                  <Text style={[styles.chipText, formData.educationLevel === edu && styles.selectedChipText]}>
                    {edu}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <CustomInput
              label="Field of Study / Degree"
              value={formData.fieldOfStudy}
              placeholder="e.g. Computer Science, Accounting, Medicine"
              onChangeText={(v) => handleChange('fieldOfStudy', v)}
            />

            <CustomInput
              label="Profession / Job Title"
              value={formData.profession}
              placeholder="e.g. Senior Software Engineer"
              onChangeText={(v) => handleChange('profession', v)}
            />

            <Text style={styles.inputLabel}>Industry</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
              {INDUSTRIES.map((ind) => (
                <TouchableOpacity
                  key={ind}
                  style={[styles.chip, formData.industry === ind && styles.selectedChip]}
                  onPress={() => handleChange('industry', ind)}
                >
                  <Text style={[styles.chipText, formData.industry === ind && styles.selectedChipText]}>
                    {ind}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <CustomInput
              label="Employer / Company Name"
              value={formData.employer}
              placeholder="e.g. Tech Solutions Lanka"
              onChangeText={(v) => handleChange('employer', v)}
            />

            <CustomInput
              label="Work Location"
              value={formData.workLocation}
              placeholder="e.g. Colombo / Hybrid"
              onChangeText={(v) => handleChange('workLocation', v)}
            />

            <Text style={styles.inputLabel}>Annual Income Range</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
              {INCOME_RANGES.map((inc) => (
                <TouchableOpacity
                  key={inc}
                  style={[styles.chip, formData.income === inc && styles.selectedChip]}
                  onPress={() => handleChange('income', inc)}
                >
                  <Text style={[styles.chipText, formData.income === inc && styles.selectedChipText]}>
                    {inc}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* SECTION 5: HABITS & LIFESTYLE */}
        {activeTab === 'lifestyle' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Habits & Daily Lifestyle</Text>

            <Text style={styles.inputLabel}>Dietary Preference</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
              {DIETARY_PREFS.map((dp) => (
                <TouchableOpacity
                  key={dp}
                  style={[styles.chip, formData.dietaryPreferences === dp && styles.selectedChip]}
                  onPress={() => handleChange('dietaryPreferences', dp)}
                >
                  <Text style={[styles.chipText, formData.dietaryPreferences === dp && styles.selectedChipText]}>
                    {dp}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.inputLabel}>Smoking</Text>
            <View style={styles.chipRow}>
              {SMOKING_HABITS.map((sm) => (
                <TouchableOpacity
                  key={sm}
                  style={[styles.chip, formData.smoking === sm && styles.selectedChip]}
                  onPress={() => handleChange('smoking', sm)}
                >
                  <Text style={[styles.chipText, formData.smoking === sm && styles.selectedChipText]}>
                    {sm}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Drinking</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
              {DRINKING_HABITS.map((dr) => (
                <TouchableOpacity
                  key={dr}
                  style={[styles.chip, formData.drinking === dr && styles.selectedChip]}
                  onPress={() => handleChange('drinking', dr)}
                >
                  <Text style={[styles.chipText, formData.drinking === dr && styles.selectedChipText]}>
                    {dr}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <CustomInput
              label="Health & Fitness Habits"
              value={formData.healthHabits}
              placeholder="e.g. Regular morning workout, jogging, yoga"
              onChangeText={(v) => handleChange('healthHabits', v)}
            />

            <CustomInput
              label="Daily Routine & Philosophy"
              value={formData.lifestyle}
              placeholder="e.g. Early riser, love calm weekends, family oriented"
              multiline
              numberOfLines={3}
              onChangeText={(v) => handleChange('lifestyle', v)}
            />

            <CustomInput
              label="About Me (Personal Biography)"
              value={formData.about}
              placeholder="Write a warm, welcoming introduction about who you are and what you value in life..."
              multiline
              numberOfLines={4}
              onChangeText={(v) => handleChange('about', v)}
            />
          </View>
        )}

        {/* SECTION 6: INTERESTS & FAVORITES */}
        {activeTab === 'interests' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Interests & Favourite Things</Text>

            <Text style={styles.inputLabel}>Select Your Passions</Text>
            <View style={styles.interestWrap}>
              {INTEREST_OPTIONS.map((interest) => {
                const isSelected = (formData.interests || []).includes(interest);
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

            <Text style={[styles.inputLabel, { marginTop: Spacing.md }]}>Favourite Cuisine / Food</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Sri Lankan rice & curry, Italian, seafood"
              placeholderTextColor={Colors.textLight}
              value={formData.favoriteThings?.food || ''}
              onChangeText={(v) => handleFavoriteChange('food', v)}
            />

            <Text style={styles.inputLabel}>Favourite Movies & Directors</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Inception, Sinhala teledramas, Marvel"
              placeholderTextColor={Colors.textLight}
              value={formData.favoriteThings?.movies || ''}
              onChangeText={(v) => handleFavoriteChange('movies', v)}
            />

            <Text style={styles.inputLabel}>Favourite Places in Sri Lanka / Travel</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Ella, Mirissa, Nuwara Eliya, Sigiriya"
              placeholderTextColor={Colors.textLight}
              value={formData.favoriteThings?.places || ''}
              onChangeText={(v) => handleFavoriteChange('places', v)}
            />
          </View>
        )}

        {/* SECTION 7: PARTNER PREFERENCES */}
        {activeTab === 'preferences' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>What You Are Looking For</Text>

            {/* Age Range */}
            <Text style={styles.inputLabel}>Partner Age Range</Text>
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: Spacing.md }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.inputLabel, { fontSize: 11, marginBottom: 4 }]}>Min Age</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={String(formData.partnerPreferences?.ageRange?.[0] ?? formData.partnerPreferences?.minAge ?? 24)}
                  onChangeText={v => {
                    const val = parseInt(v) || 18;
                    const cur = Array.isArray(formData.partnerPreferences?.ageRange) ? formData.partnerPreferences.ageRange : [formData.partnerPreferences?.minAge || 24, formData.partnerPreferences?.maxAge || 32];
                    handlePartnerPrefChange('ageRange', [val, Math.max(val, cur[1])]);
                  }}
                  placeholderTextColor={Colors.textLight}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.inputLabel, { fontSize: 11, marginBottom: 4 }]}>Max Age</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={String(formData.partnerPreferences?.ageRange?.[1] ?? formData.partnerPreferences?.maxAge ?? 32)}
                  onChangeText={v => {
                    const val = parseInt(v) || 60;
                    const cur = Array.isArray(formData.partnerPreferences?.ageRange) ? formData.partnerPreferences.ageRange : [formData.partnerPreferences?.minAge || 24, formData.partnerPreferences?.maxAge || 32];
                    handlePartnerPrefChange('ageRange', [Math.min(val, cur[0]), val]);
                  }}
                  placeholderTextColor={Colors.textLight}
                />
              </View>
            </View>

            {/* Height Range */}
            <Text style={styles.inputLabel}>Partner Height Range (cm)</Text>
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: Spacing.md }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.inputLabel, { fontSize: 11, marginBottom: 4 }]}>Min Height</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={String(formData.partnerPreferences?.heightPreference?.[0] ?? formData.partnerPreferences?.minHeight ?? 150)}
                  onChangeText={v => {
                    const val = parseInt(v) || 140;
                    const cur = Array.isArray(formData.partnerPreferences?.heightPreference) ? formData.partnerPreferences.heightPreference : [formData.partnerPreferences?.minHeight || 150, formData.partnerPreferences?.maxHeight || 185];
                    handlePartnerPrefChange('heightPreference', [val, Math.max(val, cur[1])]);
                  }}
                  placeholderTextColor={Colors.textLight}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.inputLabel, { fontSize: 11, marginBottom: 4 }]}>Max Height</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={String(formData.partnerPreferences?.heightPreference?.[1] ?? formData.partnerPreferences?.maxHeight ?? 185)}
                  onChangeText={v => {
                    const val = parseInt(v) || 200;
                    const cur = Array.isArray(formData.partnerPreferences?.heightPreference) ? formData.partnerPreferences.heightPreference : [formData.partnerPreferences?.minHeight || 150, formData.partnerPreferences?.maxHeight || 185];
                    handlePartnerPrefChange('heightPreference', [Math.min(val, cur[0]), val]);
                  }}
                  placeholderTextColor={Colors.textLight}
                />
              </View>
            </View>

            {/* Preferred Gender */}
            <Text style={styles.inputLabel}>Preferred Gender</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
              {[{ value: '', label: 'No Preference' }, { value: 'MALE', label: 'Male' }, { value: 'FEMALE', label: 'Female' }, { value: 'OTHER', label: 'Other' }].map(item => (
                <TouchableOpacity
                  key={item.value}
                  style={[styles.chip, (formData.partnerPreferences?.preferredGender ?? '') === item.value && styles.selectedChip]}
                  onPress={() => handlePartnerPrefChange('preferredGender', item.value)}
                >
                  <Text style={[styles.chipText, (formData.partnerPreferences?.preferredGender ?? '') === item.value && styles.selectedChipText]}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Religion Preference */}
            <Text style={styles.inputLabel}>Religion Preference</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
              {[{ value: '', label: 'No Preference' }, { value: 'BUDDHIST', label: 'Buddhist' }, { value: 'HINDU', label: 'Hindu' }, { value: 'MUSLIM', label: 'Muslim' }, { value: 'CHRISTIAN', label: 'Christian' }, { value: 'CATHOLIC', label: 'Catholic' }, { value: 'NO_RELIGION', label: 'No Religion' }, { value: 'OTHER', label: 'Other' }].map(item => (
                <TouchableOpacity
                  key={item.value}
                  style={[styles.chip, (formData.partnerPreferences?.religionPreference ?? formData.partnerPreferences?.religion ?? '') === item.value && styles.selectedChip]}
                  onPress={() => handlePartnerPrefChange('religionPreference', item.value)}
                >
                  <Text style={[styles.chipText, (formData.partnerPreferences?.religionPreference ?? formData.partnerPreferences?.religion ?? '') === item.value && styles.selectedChipText]}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Marital Status Preference */}
            <Text style={styles.inputLabel}>Marital Status Preference</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
              {[{ value: '', label: 'No Preference' }, { value: 'NEVER_MARRIED', label: 'Never Married' }, { value: 'DIVORCED', label: 'Divorced' }, { value: 'WIDOWED', label: 'Widowed' }, { value: 'SEPARATED', label: 'Separated' }, { value: 'ANNULLED', label: 'Annulled' }].map(item => (
                <TouchableOpacity
                  key={item.value}
                  style={[styles.chip, (formData.partnerPreferences?.maritalStatusPreference ?? formData.partnerPreferences?.maritalStatus ?? '') === item.value && styles.selectedChip]}
                  onPress={() => handlePartnerPrefChange('maritalStatusPreference', item.value)}
                >
                  <Text style={[styles.chipText, (formData.partnerPreferences?.maritalStatusPreference ?? formData.partnerPreferences?.maritalStatus ?? '') === item.value && styles.selectedChipText]}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Education Level Preference */}
            <Text style={styles.inputLabel}>Min. Education Preference</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
              {[{ value: '', label: 'No Preference' }, { value: 'HIGH_SCHOOL', label: 'High School' }, { value: 'DIPLOMA', label: 'Diploma' }, { value: 'BACHELORS', label: 'Bachelors' }, { value: 'MASTERS', label: 'Masters' }, { value: 'DOCTORATE', label: 'Doctorate' }, { value: 'PROFESSIONAL_CERTIFICATION', label: 'Prof. Cert.' }].map(item => (
                <TouchableOpacity
                  key={item.value}
                  style={[styles.chip, (formData.partnerPreferences?.educationLevel ?? formData.partnerPreferences?.education ?? '') === item.value && styles.selectedChip]}
                  onPress={() => handlePartnerPrefChange('educationLevel', item.value)}
                >
                  <Text style={[styles.chipText, (formData.partnerPreferences?.educationLevel ?? formData.partnerPreferences?.education ?? '') === item.value && styles.selectedChipText]}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Location Preference */}
            <Text style={[styles.inputLabel, { marginTop: Spacing.md }]}>Location Preference</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Colombo, Western Province, or open"
              placeholderTextColor={Colors.textLight}
              value={formData.partnerPreferences?.locationPreference || formData.partnerPreferences?.location || ''}
              onChangeText={v => handlePartnerPrefChange('locationPreference', v)}
            />

            {/* Dealbreakers */}
            <Text style={[styles.inputLabel, { marginTop: Spacing.md }]}>Dealbreakers</Text>
            <TextInput
              style={[styles.textInput, { minHeight: 70, textAlignVertical: 'top' }]}
              placeholder="e.g. Smoking, dishonesty, unsupportive of career"
              placeholderTextColor={Colors.textLight}
              multiline
              numberOfLines={3}
              value={formData.dealbreakers}
              onChangeText={v => handleChange('dealbreakers', v)}
            />
          </View>
        )}

        {/* Save Button */}
        <View style={styles.saveBtnWrap}>
          <CustomButton
            title={loading ? 'Saving Changes...' : 'Save Profile Changes ✦'}
            variant="primary"
            onPress={handleSave}
            loading={loading}
            disabled={loading}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf8f4',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fdf8f4',
    padding: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 13,
    color: Colors.textMuted,
  },
  tabsContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0ddd5',
  },
  tabsScroll: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabBtn: {
    borderBottomColor: Colors.primaryDark,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  activeTabBtnText: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  card: {
    margin: Spacing.base,
    backgroundColor: '#ffffff',
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: '#f0ddd5',
    ...Shadows.card,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d1810',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  photoWrap: {
    width: 96,
    height: 120,
    borderRadius: Radius.md,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#fdf0e8',
  },
  photoItem: {
    width: '100%',
    height: '100%',
  },
  primaryBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  primaryBadgeText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '700',
  },
  deletePhotoBtn: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(220,38,38,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoBox: {
    width: 96,
    height: 120,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: '#c9856a',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fdf5ee',
  },
  addPhotoText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primaryMedium,
    marginTop: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4a3028',
    marginBottom: 6,
    marginTop: 10,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  scrollChips: {
    gap: 8,
    marginBottom: 10,
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
    fontSize: 12,
    fontWeight: '500',
    color: '#6b4a3a',
  },
  selectedChipText: {
    color: '#ffffff',
    fontWeight: '700',
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
    marginBottom: 10,
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
    fontWeight: '700',
  },
  saveBtnWrap: {
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.sm,
  },
});
