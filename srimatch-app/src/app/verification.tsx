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
  Modal,
} from 'react-native';
import { Colors, Fonts, Spacing, Radius, Shadows } from '../constants/theme';
import { GradientHeader } from '../components/ui/GradientHeader';
import { CustomButton } from '../components/ui/CustomButton';
import { VerificationService, UserService } from '../services';
import {
  ShieldCheck,
  Upload,
  Camera,
  CheckCircle2,
  AlertCircle,
  Lock,
  Clock,
  Sparkles,
  Phone,
  Smartphone,
  ChevronRight,
  RefreshCw,
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

  // Phone Verification State
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [phoneOtpModal, setPhoneOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    if (user?.phoneNumber) {
      setPhoneNumber(user.phoneNumber);
    }
  }, [user?.phoneNumber]);

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

  const isIdVerified = Boolean(
    user?.verified ||
    user?.isVerified ||
    user?.idVerified ||
    status?.status === 'APPROVED' ||
    status?.status === 'VERIFIED'
  );

  const isPhoneVerified = Boolean(user?.phoneVerified);

  const isUnderReview = status?.status === 'UNDER_REVIEW' || status?.status === 'PENDING';

  // ── Phone OTP Handlers ──
  const handleRequestPhoneOtp = async () => {
    if (!phoneNumber || phoneNumber.trim().length < 9) {
      Alert.alert('Invalid Number', 'Please enter a valid Sri Lankan mobile number (e.g., 0771234567 or +94771234567).');
      return;
    }
    setSendingOtp(true);
    setPhoneError('');
    try {
      const res: any = await UserService.requestPhoneOtp(phoneNumber.trim());
      if (res?.data?.success || res?.success) {
        setPhoneOtpModal(true);
      } else {
        Alert.alert('SMS Failed', res?.data?.message || res?.message || 'Could not send SMS verification code.');
      }
    } catch (e: any) {
      Alert.alert('SMS Error', e?.response?.data?.message || e?.message || 'Failed to connect to Notify.lk SMS Gateway.');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (!otpCode || otpCode.trim().length !== 6) {
      setPhoneError('Please enter the 6-digit verification code.');
      return;
    }
    setVerifyingOtp(true);
    setPhoneError('');
    try {
      const res: any = await UserService.verifyPhone(otpCode.trim());
      if (res?.data?.success || res?.success) {
        setPhoneOtpModal(false);
        setOtpCode('');
        await refreshProfile();
        Alert.alert('Phone Verified! ✓', 'Your mobile number is now authenticated and securely linked.');
      } else {
        setPhoneError(res?.data?.message || res?.message || 'Invalid or expired code.');
      }
    } catch (e: any) {
      setPhoneError(e?.response?.data?.message || e?.message || 'Verification failed. Please try again.');
    } finally {
      setVerifyingOtp(false);
    }
  };

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
        'Your identity verification documents have been received. Our security team reviews submissions within 2-4 hours.'
      );
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || e?.message || 'Failed to submit verification documents.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <GradientHeader title="Profile Verification" subtitle="Earn the trusted green tick on your profile" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {checking ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color={Colors.primaryMedium} />
            <Text style={styles.loaderText}>Checking verification status...</Text>
          </View>
        ) : isIdVerified && isPhoneVerified ? (
          /* FULLY VERIFIED STATE UI */
          <View style={styles.verifiedCard}>
            <View style={styles.verifiedBadgeIconWrap}>
              <CheckCircle2 size={48} color="#16a34a" />
            </View>
            <Text style={styles.verifiedStateTitle}>Profile Fully Verified ✓</Text>
            <Text style={styles.verifiedStateSub}>
              Congratulations! Both your mobile phone and government identity have been authenticated. Your profile proudly displays the verified green badge across discovery and member searches.
            </Text>

            <View style={styles.verifiedDetailsBox}>
              <View style={styles.verifiedDetailRow}>
                <CheckCircle2 size={16} color="#16a34a" />
                <Text style={styles.verifiedDetailText}>Phone Verified: {user?.phoneNumber || 'SMS Authenticated'}</Text>
              </View>
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
                <Text style={styles.verifiedDetailText}>Encrypted & Stored Securely</Text>
              </View>
            </View>

            <CustomButton
              title="Return to Profile"
              variant="primary"
              onPress={() => router.back()}
              style={{ marginTop: Spacing.lg, width: '100%' }}
            />
          </View>
        ) : (
          /* UNVERIFIED / PARTIAL VERIFICATION FORM */
          <>
            {/* Top Status Banner */}
            <View style={styles.statusCard}>
              <View style={styles.verifiedRow}>
                <ShieldCheck size={36} color={Colors.primaryMedium} />
                <View style={styles.statusTextCol}>
                  <Text style={styles.statusTitle}>Get Trusted & Verified</Text>
                  <Text style={styles.statusSub}>
                    Complete phone and ID verification to receive up to 300% more connection requests and establish instant trust.
                  </Text>
                </View>
              </View>

              {/* Progress summary badges */}
              <View style={styles.verificationBadgesRow}>
                <View style={[styles.miniBadge, isPhoneVerified ? styles.miniBadgeActive : styles.miniBadgeInactive]}>
                  <Smartphone size={13} color={isPhoneVerified ? '#16a34a' : Colors.textMuted} />
                  <Text style={[styles.miniBadgeText, isPhoneVerified && styles.miniBadgeTextActive]}>
                    Step 1: Phone {isPhoneVerified ? '✓' : ''}
                  </Text>
                </View>
                <View style={[styles.miniBadge, isIdVerified ? styles.miniBadgeActive : isUnderReview ? styles.miniBadgePending : styles.miniBadgeInactive]}>
                  <ShieldCheck size={13} color={isIdVerified ? '#16a34a' : isUnderReview ? '#d97706' : Colors.textMuted} />
                  <Text style={[styles.miniBadgeText, isIdVerified && styles.miniBadgeTextActive, isUnderReview && { color: '#d97706' }]}>
                    Step 2: ID & Selfie {isIdVerified ? '✓' : isUnderReview ? '(Review)' : ''}
                  </Text>
                </View>
              </View>
            </View>

            {/* ═══════════════════════════════════════════════════════════════
                STEP 1: MOBILE NUMBER SMS VERIFICATION (Notify.lk)
            ═══════════════════════════════════════════════════════════════ */}
            <View style={styles.card}>
              <View style={styles.stepHeaderRow}>
                <View style={[styles.stepNumCircle, isPhoneVerified && styles.stepNumCircleDone]}>
                  {isPhoneVerified ? (
                    <CheckCircle2 size={16} color="#ffffff" />
                  ) : (
                    <Text style={styles.stepNumText}>1</Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>Mobile Number Verification</Text>
                  <Text style={styles.cardSub}>
                    Verify your Sri Lankan mobile number with a secure SMS OTP code via Notify.lk.
                  </Text>
                </View>
              </View>

              {isPhoneVerified ? (
                <View style={styles.phoneVerifiedBox}>
                  <CheckCircle2 size={20} color="#16a34a" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.phoneVerifiedTitle}>Phone Verified ✓</Text>
                    <Text style={styles.phoneVerifiedSub}>{user?.phoneNumber || phoneNumber} · Verified via Notify.lk SMS</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.phoneFormBox}>
                  <Text style={styles.fieldLabel}>Mobile Phone Number</Text>
                  <View style={styles.phoneInputRow}>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="07XXXXXXXX or 947XXXXXXXX"
                      placeholderTextColor={Colors.textLight}
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      keyboardType="phone-pad"
                    />
                    <TouchableOpacity
                      style={styles.verifySmsBtn}
                      onPress={handleRequestPhoneOtp}
                      disabled={sendingOtp || !phoneNumber}
                    >
                      {sendingOtp ? (
                        <ActivityIndicator size="small" color={Colors.primaryMedium} />
                      ) : (
                        <Text style={styles.verifySmsBtnText}>Send SMS Code</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* ═══════════════════════════════════════════════════════════════
                STEP 2 & 3: ID DOCUMENT & SELFIE VERIFICATION
            ═══════════════════════════════════════════════════════════════ */}
            {isIdVerified ? (
              <View style={styles.card}>
                <View style={styles.phoneVerifiedBox}>
                  <CheckCircle2 size={20} color="#16a34a" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.phoneVerifiedTitle}>Identity Document Verified ✓</Text>
                    <Text style={styles.phoneVerifiedSub}>Government ID & Live Selfie validated by SriMatch moderation.</Text>
                  </View>
                </View>
              </View>
            ) : isUnderReview ? (
              <View style={styles.pendingCard}>
                <View style={styles.pendingIconWrap}>
                  <Clock size={36} color="#e07a30" />
                </View>
                <Text style={styles.pendingTitle}>ID Verification Under Review</Text>
                <Text style={styles.pendingSub}>
                  We have safely received your ID documents and live selfie. Our moderation team is currently reviewing your submission (typically 2–4 hours).
                </Text>
              </View>
            ) : (
              <>
                {/* Document Selection & Upload */}
                <View style={styles.card}>
                  <View style={styles.stepHeaderRow}>
                    <View style={styles.stepNumCircle}>
                      <Text style={styles.stepNumText}>2</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardTitle}>Upload Government ID</Text>
                      <Text style={styles.cardSub}>Select your official identification document</Text>
                    </View>
                  </View>

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

                  <Text style={styles.uploadSectionTitle}>Upload ID Photos</Text>

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
                  <View style={styles.stepHeaderRow}>
                    <View style={styles.stepNumCircle}>
                      <Text style={styles.stepNumText}>3</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardTitle}>Live Selfie Liveness Check</Text>
                      <Text style={styles.cardSub}>
                        Take a quick selfie to verify that your face matches the submitted ID photo.
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.selfieBox} onPress={() => pickImage('selfie')}>
                    {selfieImage ? (
                      <Image source={{ uri: selfieImage }} style={styles.selfiePreview} resizeMode="cover" />
                    ) : (
                      <View style={styles.uploadPlaceholder}>
                        <Camera size={32} color={Colors.primaryMedium} />
                        <Text style={styles.uploadTitle}>Take a Live Selfie</Text>
                        <Text style={styles.uploadSub}>Ensure your face is well-lit and clear</Text>
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
          </>
        )}
      </ScrollView>

      {/* ── SMS OTP Verification Modal (Notify.lk) ── */}
      <Modal
        visible={phoneOtpModal}
        transparent
        animationType="fade"
        onRequestClose={() => setPhoneOtpModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconWrap}>
              <Phone size={24} color={Colors.primaryMedium} />
            </View>

            <Text style={styles.modalTitle}>Verify Mobile Number</Text>
            <Text style={styles.modalSub}>
              We sent a 6-digit verification code to <Text style={{ fontWeight: '700' }}>{phoneNumber}</Text> via Notify.lk SMS Gateway.
            </Text>

            <TextInput
              style={styles.modalOtpInput}
              value={otpCode}
              onChangeText={setOtpCode}
              placeholder="000000"
              placeholderTextColor={Colors.textLight}
              keyboardType="number-pad"
              maxLength={6}
            />

            {phoneError ? <Text style={styles.modalError}>{phoneError}</Text> : null}

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: Colors.border }]}
                onPress={() => setPhoneOtpModal(false)}
              >
                <Text style={[styles.modalBtnText, { color: Colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: Colors.primaryMedium }]}
                onPress={handleVerifyPhoneOtp}
                disabled={verifyingOtp}
              >
                {verifyingOtp ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={[styles.modalBtnText, { color: '#ffffff' }]}>Confirm Code</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.base,
    backgroundColor: '#ffffff',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fed7aa',
    ...Shadows.card,
  },
  pendingIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff7ed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  pendingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#c2410c',
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  pendingSub: {
    fontSize: 12.5,
    color: '#6b4a3a',
    textAlign: 'center',
    lineHeight: 18,
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
  verificationBadgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#f7eee9',
  },
  miniBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  miniBadgeActive: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  miniBadgePending: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  miniBadgeInactive: {
    backgroundColor: '#fdf8f5',
    borderColor: '#e8ddd8',
  },
  miniBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  miniBadgeTextActive: {
    color: '#16a34a',
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
  stepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: Spacing.sm,
  },
  stepNumCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primaryMedium,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumCircleDone: {
    backgroundColor: '#16a34a',
  },
  stepNumText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2d1810',
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 17,
  },
  phoneVerifiedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f0fdf4',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    marginTop: Spacing.xs,
  },
  phoneVerifiedTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#166534',
  },
  phoneVerifiedSub: {
    fontSize: 11.5,
    color: '#15803d',
    marginTop: 1,
  },
  phoneFormBox: {
    marginTop: Spacing.xs,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b4a3a',
    marginBottom: 4,
  },
  phoneInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#fdf8f5',
    borderWidth: 1.5,
    borderColor: '#e8ddd8',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 9,
    fontSize: 13.5,
    color: Colors.text,
  },
  verifySmsBtn: {
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifySmsBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  docTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
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
    height: 130,
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
    fontSize: 12.5,
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
    height: 160,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: '#c9856a',
    borderStyle: 'dashed',
    backgroundColor: '#fdf5ee',
    overflow: 'hidden',
    marginTop: Spacing.xs,
  },
  selfiePreview: {
    width: '100%',
    height: '100%',
  },
  submitWrap: {
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxl,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  modalIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryExtraLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  modalSub: {
    fontSize: 12.5,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.lg,
  },
  modalOtpInput: {
    width: '80%',
    backgroundColor: Colors.surfaceSoft,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.xl,
    paddingVertical: 12,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 6,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  modalError: {
    fontSize: 12,
    color: Colors.errorRed,
    marginBottom: Spacing.md,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});

