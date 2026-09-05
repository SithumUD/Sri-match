import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Colors, Fonts, Spacing, Radius, Shadows } from '../constants/theme';
import { GradientHeader } from '../components/ui/GradientHeader';
import { CustomButton } from '../components/ui/CustomButton';
import { VerificationService } from '../services';
import {
  ShieldCheck,
  Upload,
  Camera,
  CheckCircle2,
  AlertCircle,
  Lock,
  Clock,
  Sparkles,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import useAuthStore from '../store/useAuthStore';
import { useRouter } from 'expo-router';

export default function VerificationScreen() {
  const router = useRouter();
  const { user, refreshProfile } = useAuthStore();
  const [docType, setDocType] = useState<'NATIONAL_ID' | 'PASSPORT' | 'DRIVING_LICENSE'>('NATIONAL_ID');
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setChecking(true);
      const res: any = await VerificationService.getStatus();
      setStatus(res?.data || res);
    } catch (e) {
    } finally {
      setChecking(false);
    }
  };

  const isVerified = Boolean(
    user?.verified ||
    user?.isVerified ||
    user?.idVerified ||
    status?.status === 'APPROVED' ||
    status?.status === 'VERIFIED'
  );

  const isUnderReview = status?.status === 'UNDER_REVIEW' || status?.status === 'PENDING';

  const pickImage = async (type: 'front' | 'back' | 'selfie') => {
    if (type === 'selfie') {
      const camPerm = await ImagePicker.requestCameraPermissionsAsync();
      if (!camPerm.granted) {
        Alert.alert('Camera Permission Required', 'Camera access needed to capture live selfie.');
        return;
      }
      const res = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!res.canceled && res.assets?.[0]?.uri) {
        setSelfieImage(res.assets[0].uri);
      }
    } else {
      const libPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!libPerm.granted) {
        Alert.alert('Permission Required', 'Photo library access needed to select ID documents.');
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
      if (!res.canceled && res.assets?.[0]?.uri) {
        if (type === 'front') setFrontImage(res.assets[0].uri);
        if (type === 'back') setBackImage(res.assets[0].uri);
      }
    }
  };

  const handleSubmit = async () => {
    if (!frontImage) {
      Alert.alert('Document Required', 'Please upload at least the front photo of your ID/Passport.');
      return;
    }
    if (!selfieImage) {
      Alert.alert('Selfie Required', 'Please take a live selfie to verify your identity.');
      return;
    }

    setLoading(true);
    try {
      // 1. Upload Documents
      const docFormData = new FormData();
      docFormData.append('type', docType);

      const fName = frontImage.split('/').pop() || 'front.jpg';
      docFormData.append('front', { uri: frontImage, name: fName, type: 'image/jpeg' } as any);

      if (backImage) {
        const bName = backImage.split('/').pop() || 'back.jpg';
        docFormData.append('back', { uri: backImage, name: bName, type: 'image/jpeg' } as any);
      }

      const docRes: any = await VerificationService.uploadDocuments(docFormData);
      const token = docRes?.data?.selfieSessionToken || docRes?.data?.token || docRes?.token || '';

      // 2. Upload Selfie
      const selfieFormData = new FormData();
      const sName = selfieImage.split('/').pop() || 'selfie.jpg';
      if (token) selfieFormData.append('token', token);
      selfieFormData.append('selfie', { uri: selfieImage, name: sName, type: 'image/jpeg' } as any);
      await VerificationService.uploadSelfie(selfieFormData);

      await refreshProfile();
      await fetchStatus();

      Alert.alert(
        'Documents Submitted! 🛡️',
        'Your identity verification documents have been received. Our security and moderation team reviews submissions within 2-4 hours.'
      );
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || e?.message || 'Failed to submit verification documents.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <GradientHeader title="Identity Verification" subtitle="Earn the trusted green tick on your profile" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {checking ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color={Colors.primaryMedium} />
            <Text style={styles.loaderText}>Checking verification status...</Text>
          </View>
        ) : isVerified ? (
          /* VERIFIED STATE UI */
          <View style={styles.verifiedCard}>
            <View style={styles.verifiedBadgeIconWrap}>
              <CheckCircle2 size={48} color="#16a34a" />
            </View>
            <Text style={styles.verifiedStateTitle}>Identity Fully Verified ✓</Text>
            <Text style={styles.verifiedStateSub}>
              Congratulations! Your national identity has been validated by SriMatch moderation. Your profile now proudly displays the verified green badge across discovery and member profiles.
            </Text>

            <View style={styles.verifiedDetailsBox}>
              <View style={styles.verifiedDetailRow}>
                <ShieldCheck size={16} color="#16a34a" />
                <Text style={styles.verifiedDetailText}>Official ID Document Authenticated</Text>
              </View>
              <View style={styles.verifiedDetailRow}>
                <Sparkles size={16} color={Colors.primaryMedium} />
                <Text style={styles.verifiedDetailText}>Priority Placement & Trust Boost Active</Text>
              </View>
              <View style={styles.verifiedDetailRow}>
                <Lock size={16} color={Colors.textMuted} />
                <Text style={styles.verifiedDetailText}>Encrypted & Purged for Maximum Privacy</Text>
              </View>
            </View>

            <CustomButton
              title="Return to Profile"
              variant="primary"
              onPress={() => router.back()}
              style={{ marginTop: Spacing.lg, width: '100%' }}
            />
          </View>
        ) : isUnderReview ? (
          /* UNDER REVIEW STATE UI */
          <View style={styles.pendingCard}>
            <View style={styles.pendingIconWrap}>
              <Clock size={44} color="#e07a30" />
            </View>
            <Text style={styles.pendingTitle}>Verification Under Review</Text>
            <Text style={styles.pendingSub}>
              We have safely received your ID documents and live selfie. Our moderation team is currently reviewing your submission (typically completed within 2–4 hours).
            </Text>
            <View style={styles.pendingNoticeBox}>
              <Text style={styles.pendingNoticeText}>
                You will receive a notification as soon as your verified badge is activated.
              </Text>
            </View>
            <CustomButton
              title="Return to Profile"
              variant="outline"
              onPress={() => router.back()}
              style={{ marginTop: Spacing.lg, width: '100%' }}
            />
          </View>
        ) : (
          /* UNVERIFIED SUBMISSION FORM */
          <>
            {/* Top Status Card */}
            <View style={styles.statusCard}>
              <View style={styles.verifiedRow}>
                <ShieldCheck size={36} color={Colors.primaryMedium} />
                <View style={styles.statusTextCol}>
                  <Text style={styles.statusTitle}>Get Trusted & Verified</Text>
                  <Text style={styles.statusSub}>
                    Verified profiles receive up to 300% more connection requests and establish instant trust with Sri Lankan families.
                  </Text>
                </View>
              </View>
            </View>

            {/* Document Selection & Upload */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>1. Select Government ID Type</Text>
              <View style={styles.docTypeRow}>
                {[
                  { key: 'NATIONAL_ID', label: 'National ID (NIC)' },
                  { key: 'PASSPORT', label: 'Passport' },
                  { key: 'DRIVING_LICENSE', label: 'Driving License' },
                ].map((t) => (
                  <TouchableOpacity
                    key={t.key}
                    style={[styles.docTypeBtn, docType === t.key && styles.selectedDocType]}
                    onPress={() => setDocType(t.key as any)}
                  >
                    <Text style={[styles.docTypeText, docType === t.key && styles.selectedDocTypeText]}>
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.uploadSectionTitle}>Upload ID Document Photos</Text>

              {/* Front Photo */}
              <TouchableOpacity style={styles.docUploadBox} onPress={() => pickImage('front')}>
                {frontImage ? (
                  <Image source={{ uri: frontImage }} style={styles.docPreview} resizeMode="cover" />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Upload size={22} color={Colors.primaryMedium} />
                    <Text style={styles.uploadTitle}>Front Side of {docType.replace(/_/g, ' ')}</Text>
                    <Text style={styles.uploadSub}>Tap to upload clear image</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Back Photo */}
              {docType !== 'PASSPORT' && (
                <TouchableOpacity style={styles.docUploadBox} onPress={() => pickImage('back')}>
                  {backImage ? (
                    <Image source={{ uri: backImage }} style={styles.docPreview} resizeMode="cover" />
                  ) : (
                    <View style={styles.uploadPlaceholder}>
                      <Upload size={22} color={Colors.primaryMedium} />
                      <Text style={styles.uploadTitle}>Back Side of {docType.replace(/_/g, ' ')}</Text>
                      <Text style={styles.uploadSub}>Tap to upload clear image</Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* Live Selfie Verification */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>2. Live Selfie Liveness Check</Text>
              <Text style={styles.cardSub}>
                Take a quick live selfie so we can verify that your photo matches your submitted ID.
              </Text>

              <TouchableOpacity style={styles.selfieBox} onPress={() => pickImage('selfie')}>
                {selfieImage ? (
                  <Image source={{ uri: selfieImage }} style={styles.selfiePreview} resizeMode="cover" />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Camera size={32} color={Colors.primaryMedium} />
                    <Text style={styles.uploadTitle}>Take a Live Selfie</Text>
                    <Text style={styles.uploadSub}>Ensure your face is well-lit and unobstructed</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <View style={styles.submitWrap}>
              <CustomButton
                title={loading ? 'Uploading Documents...' : 'Submit Verification Request 🛡️'}
                variant="primary"
                onPress={handleSubmit}
                loading={loading}
                disabled={loading}
              />
            </View>
          </>
        )}
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
  loaderWrap: {
    padding: Spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    marginTop: Spacing.md,
    fontSize: 13,
    color: Colors.textMuted,
  },
  verifiedCard: {
    margin: Spacing.base,
    backgroundColor: '#ffffff',
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dcfce7',
    ...Shadows.card,
  },
  verifiedBadgeIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  verifiedStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#16a34a',
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  verifiedStateSub: {
    fontSize: 13,
    color: '#4a3028',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  verifiedDetailsBox: {
    width: '100%',
    backgroundColor: '#f0fdf4',
    padding: Spacing.md,
    borderRadius: Radius.md,
    gap: 10,
  },
  verifiedDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verifiedDetailText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
  },
  pendingCard: {
    margin: Spacing.base,
    backgroundColor: '#ffffff',
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fed7aa',
    ...Shadows.card,
  },
  pendingIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff7ed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  pendingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#c2410c',
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  pendingSub: {
    fontSize: 13,
    color: '#6b4a3a',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  pendingNoticeBox: {
    backgroundColor: '#fff7ed',
    padding: Spacing.md,
    borderRadius: Radius.md,
    width: '100%',
  },
  pendingNoticeText: {
    fontSize: 12,
    color: '#9a3412',
    textAlign: 'center',
    fontWeight: '500',
  },
  statusCard: {
    margin: Spacing.base,
    backgroundColor: '#ffffff',
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: '#f0ddd5',
    ...Shadows.card,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  statusTextCol: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d1810',
    marginBottom: 2,
  },
  statusSub: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 17,
  },
  card: {
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.base,
    backgroundColor: '#ffffff',
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: '#f0ddd5',
    ...Shadows.card,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2d1810',
    marginBottom: Spacing.sm,
  },
  cardSub: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  docTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: Spacing.md,
  },
  docTypeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fdf8f4',
    borderWidth: 1.5,
    borderColor: '#e8ddd8',
  },
  selectedDocType: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primaryDark,
  },
  docTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b4a3a',
  },
  selectedDocTypeText: {
    color: '#ffffff',
  },
  uploadSectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4a3028',
    marginBottom: Spacing.xs,
  },
  docUploadBox: {
    height: 140,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: '#c9856a',
    borderStyle: 'dashed',
    backgroundColor: '#fdf5ee',
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  docPreview: {
    width: '100%',
    height: '100%',
  },
  uploadPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
  },
  uploadTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginTop: 6,
  },
  uploadSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  selfieBox: {
    height: 180,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: '#c9856a',
    borderStyle: 'dashed',
    backgroundColor: '#fdf5ee',
    overflow: 'hidden',
  },
  selfiePreview: {
    width: '100%',
    height: '100%',
  },
  submitWrap: {
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.xs,
  },
});
