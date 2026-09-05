import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  Linking,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import { Colors, Fonts, Spacing, Radius, Shadows } from '../../constants/theme';
import { GradientHeader } from '../../components/ui/GradientHeader';
import { CustomButton } from '../../components/ui/CustomButton';
import { CustomInput } from '../../components/ui/CustomInput';
import { useSubscriptionOverview } from '../../hooks/useLikes';
import { SubscriptionService, BoostService, TikTokService } from '../../services';
import {
  Crown,
  Zap,
  Check,
  X,
  Upload,
  Building2,
  Sparkles,
  ShieldCheck,
  Clock,
  Copy,
  Lock,
  Heart,
  Eye,
  Video,
  ExternalLink,
  CheckCircle2,
  Sliders,
  PhoneCall,
  MessageCircle,
  TrendingUp,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import useAuthStore from '../../store/useAuthStore';

export default function PremiumScreen() {
  const { user, refreshProfile } = useAuthStore();
  const { data: overview, isLoading, refetch } = useSubscriptionOverview();

  // Modals
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [showTiktokModal, setShowTiktokModal] = useState(false);

  // Selected items for purchase
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedBoostPkg, setSelectedBoostPkg] = useState<any>(null);
  const [selectedTiktokPkg, setSelectedTiktokPkg] = useState<any>(null);

  // Slips & form states
  const [planSlipUri, setPlanSlipUri] = useState<string | null>(null);
  const [planRef, setPlanRef] = useState('');
  const [submittingPlan, setSubmittingPlan] = useState(false);

  const [boostSlipUri, setBoostSlipUri] = useState<string | null>(null);
  const [submittingBoost, setSubmittingBoost] = useState(false);

  const [tiktokSlipUri, setTiktokSlipUri] = useState<string | null>(null);
  const [submittingTiktok, setSubmittingTiktok] = useState(false);

  const [activatingBoost, setActivatingBoost] = useState(false);

  // Extract overview data
  const isPremiumUser = Boolean(
    user?.premium ||
    user?.isPremium ||
    user?.subscription?.plan === 'premium' ||
    user?.subscription?.plan === 'PRO' ||
    user?.subscription?.plan === 'VIP' ||
    user?.role === 'PREMIUM'
  );

  const activeSub = overview?.activeSubscription || null;
  const isPremium = activeSub?.status === 'ACTIVE' || isPremiumUser;
  const hasPendingApproval = overview?.hasPendingApproval || false;

  const subscription = activeSub || (isPremiumUser ? {
    packageName: 'Premium Member',
    status: 'ACTIVE',
    endDate: user?.premiumExpiryDate,
    daysRemaining: 30,
  } : null);

  const plans = overview?.packages || [];
  const boostPackages = overview?.boostPackages || [];
  const tiktokPackages = overview?.tiktokPackages || [];
  const myPromotions = overview?.myTikTokPromotions || [];
  const activePromotion = myPromotions.find((p: any) =>
    ['PENDING', 'PROCESSING', 'PUBLISHED'].includes(p.status)
  );

  const boostStatus = overview?.boostStatus || null;
  const boostActive = Boolean(boostStatus?.isBoosted || boostStatus?.boosted);
  const remainingBoosts = boostStatus?.remainingBoosts ?? 0;
  const boostExpiresAt = boostStatus?.boostExpiresAt ? new Date(boostStatus.boostExpiresAt) : null;
  const nextRenewalAt = boostStatus?.nextRenewalAt ? new Date(boostStatus.nextRenewalAt) : null;

  const bankDetails = overview?.bankDetails || [
    {
      id: 1,
      bankName: 'Commercial Bank of Ceylon',
      accountName: 'SriMatch (Pvt) Ltd',
      accountHolderName: 'SriMatch (Pvt) Ltd',
      accountNumber: '1000 4589 2310',
      branch: 'Kollupitiya Branch',
      branchName: 'Kollupitiya Branch',
    },
  ];

  const handleCopyAccount = async (accountNum: string) => {
    await Clipboard.setStringAsync(accountNum);
    Alert.alert('Copied!', `Account number ${accountNum} copied to clipboard.`);
  };

  const pickSlip = async (type: 'plan' | 'boost' | 'tiktok') => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission Required', 'Photo library permission is needed to upload receipt slip.');
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!res.canceled && res.assets?.[0]?.uri) {
      if (type === 'plan') setPlanSlipUri(res.assets[0].uri);
      if (type === 'boost') setBoostSlipUri(res.assets[0].uri);
      if (type === 'tiktok') setTiktokSlipUri(res.assets[0].uri);
    }
  };

  // 1. Activate Boost
  const handleActivateBoost = async () => {
    if (boostActive) {
      Alert.alert('Boost Active', `Your boost is already running until ${boostExpiresAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`);
      return;
    }
    if (remainingBoosts <= 0) {
      Alert.alert('No Boosts Available', 'You have 0 boosts remaining. Purchase a boost package below!');
      return;
    }

    setActivatingBoost(true);
    try {
      const res: any = await BoostService.activateBoost();
      if (res?.success || res?.status === 200 || res?.data) {
        Alert.alert('Boost Activated! 🚀', "You'll appear at the top of results for the next hour.");
        await refetch();
      } else {
        Alert.alert('Notice', res?.message || 'Failed to activate boost.');
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Could not activate boost.');
    } finally {
      setActivatingBoost(false);
    }
  };

  // 2. Open Plan Purchase Modal
  const handleInitiatePlanPurchase = (plan: any) => {
    if (isPremium) {
      Alert.alert('Active Subscription', 'You already have an active Premium membership! You cannot purchase another package until your current plan expires.');
      return;
    }
    if (hasPendingApproval) {
      Alert.alert('Payment Pending', 'You already have a payment awaiting approval. Please wait for admin confirmation.');
      return;
    }
    setSelectedPlan(plan);
    setPlanSlipUri(null);
    setPlanRef('');
    setShowPlanModal(true);
  };

  // 3. Submit Plan Receipt
  const handleSubmitPlanReceipt = async () => {
    if (!planSlipUri || !selectedPlan) {
      Alert.alert('Receipt Required', 'Please upload a photo of your bank deposit or transfer slip.');
      return;
    }

    setSubmittingPlan(true);
    try {
      const formData = new FormData();
      const filename = planSlipUri.split('/').pop() || 'slip.jpg';
      formData.append('packageId', String(selectedPlan.id));
      formData.append('receipt', { uri: planSlipUri, name: filename, type: 'image/jpeg' } as any);
      if (planRef) formData.append('reference', planRef);

      await SubscriptionService.submitPaymentSlip(selectedPlan.id, formData);
      Alert.alert('Receipt Submitted! ✦', 'Thank you! Admin will review and activate your subscription shortly.');
      setShowPlanModal(false);
      setSelectedPlan(null);
      setPlanSlipUri(null);
      await refetch();
      await refreshProfile();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || e?.message || 'Failed to submit receipt.');
    } finally {
      setSubmittingPlan(false);
    }
  };

  // 4. Open Boost Purchase Modal
  const handleOpenBoostModal = (pkg: any) => {
    setSelectedBoostPkg(pkg);
    setBoostSlipUri(null);
    setShowBoostModal(true);
  };

  // 5. Submit Boost Receipt
  const handleSubmitBoostReceipt = async () => {
    if (!boostSlipUri || !selectedBoostPkg) {
      Alert.alert('Receipt Required', 'Please select a photo of your payment receipt.');
      return;
    }

    setSubmittingBoost(true);
    try {
      await BoostService.submitBoostReceipt(selectedBoostPkg.id, boostSlipUri);
      Alert.alert('Receipt Submitted! ⚡', 'Your boost credits will be added once admin approves payment.');
      setShowBoostModal(false);
      setSelectedBoostPkg(null);
      setBoostSlipUri(null);
      await refetch();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || e?.message || 'Failed to submit boost payment.');
    } finally {
      setSubmittingBoost(false);
    }
  };

  // 6. Open TikTok Modal
  const handleOpenTiktokModal = (pkg: any) => {
    if (activePromotion) {
      Alert.alert('Active Promotion', 'You already have an active or pending TikTok spotlight feature.');
      return;
    }
    setSelectedTiktokPkg(pkg);
    setTiktokSlipUri(null);
    setShowTiktokModal(true);
  };

  // 7. Submit TikTok Receipt
  const handleSubmitTiktokReceipt = async () => {
    if (!tiktokSlipUri || !selectedTiktokPkg) {
      Alert.alert('Receipt Required', 'Please upload your payment receipt for TikTok spotlight.');
      return;
    }

    setSubmittingTiktok(true);
    try {
      await TikTokService.submitPromotion(selectedTiktokPkg.id, tiktokSlipUri);
      Alert.alert('Promotion Submitted! 🎬', 'Admin will review and produce your TikTok spotlight video.');
      setShowTiktokModal(false);
      setSelectedTiktokPkg(null);
      setTiktokSlipUri(null);
      await refetch();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || e?.message || 'Failed to submit TikTok request.');
    } finally {
      setSubmittingTiktok(false);
    }
  };

  const handleCancelPlan = () => {
    Alert.alert(
      'Cancel Premium',
      'Are you sure you want to cancel your premium subscription? You will lose access to premium features upon expiry.',
      [{ text: 'Stay Premium', style: 'cancel' }, { text: 'Confirm Cancel', style: 'destructive' }]
    );
  };

  const fmtDate = (d?: string) => {
    if (!d) return 'Active Member';
    try {
      return new Date(d).toLocaleDateString('en-LK', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return d;
    }
  };

  return (
    <View style={styles.container}>
      <GradientHeader
        title={isPremium ? 'Your Premium' : 'Unlock Premium'}
        subtitle={isPremium ? 'Managing your SriMatch Premium subscription' : 'Find your perfect match faster with premium features'}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Pending Approval Notice Banner */}
        {hasPendingApproval && (
          <View style={styles.pendingNoticeBanner}>
            <View style={styles.pendingNoticeIcon}>
              <Clock size={20} color="#8b4e2e" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.pendingNoticeTitle}>Payment Approval Pending</Text>
              <Text style={styles.pendingNoticeSub}>
                We've received your receipt and are currently reviewing it. Your premium benefits will be activated shortly.
              </Text>
            </View>
          </View>
        )}

        {/* ── 1. Current Plan Card (Web Parity) ── */}
        <View style={styles.currentPlanCard}>
          <LinearGradient
            colors={['#3d1f12', '#6b3526', '#8b4e2e'] as any}
            style={styles.currentPlanHeader}
          >
            <View>
              <Text style={styles.currentPlanTitle}>Your Current Plan</Text>
              <Text style={styles.currentPlanSub}>
                {isPremium ? "You're enjoying all premium features" : 'Upgrade to access all features'}
              </Text>
            </View>
            <View style={styles.planStatusPill}>
              {isPremium ? (
                <>
                  <Crown size={14} color="#e8c97a" />
                  <Text style={styles.planStatusText}>Premium Member</Text>
                </>
              ) : (
                <>
                  <Lock size={14} color="rgba(255,255,255,0.7)" />
                  <Text style={[styles.planStatusText, { color: '#e8ddd8' }]}>Free Plan</Text>
                </>
              )}
            </View>
          </LinearGradient>

          <View style={styles.currentPlanBody}>
            <View style={styles.planDetailsList}>
              {isPremium ? (
                <>
                  <View style={styles.detailRow}>
                    <CheckCircle2 size={15} color="#16a34a" />
                    <Text style={styles.detailText}>
                      Status: <Text style={{ color: '#16a34a', fontWeight: '700' }}>{subscription?.status || 'ACTIVE'}</Text>
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <CheckCircle2 size={15} color="#16a34a" />
                    <Text style={styles.detailText}>
                      Plan: <Text style={{ fontWeight: '700' }}>{subscription?.packageName || 'Premium Member'}</Text>
                    </Text>
                  </View>
                  {subscription?.daysRemaining > 0 && (
                    <View style={styles.detailRow}>
                      <CheckCircle2 size={15} color="#16a34a" />
                      <Text style={styles.detailText}>
                        Time remaining: <Text style={{ fontWeight: '700' }}>{subscription.daysRemaining} days</Text>
                      </Text>
                    </View>
                  )}
                  {subscription?.endDate && (
                    <View style={styles.expiryPillRow}>
                      <Crown size={12} color={Colors.primaryMedium} />
                      <Text style={styles.expiryPillText}>Expires: {fmtDate(subscription.endDate)}</Text>
                    </View>
                  )}
                </>
              ) : (
                <>
                  <View style={styles.detailRow}>
                    <CheckCircle2 size={15} color="#16a34a" />
                    <Text style={styles.detailText}>15 likes per 5 days</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <CheckCircle2 size={15} color="#16a34a" />
                    <Text style={styles.detailText}>Basic profile browsing & search</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <X size={15} color="#dc2626" />
                    <Text style={[styles.detailText, { color: Colors.textMuted }]}>No star likes or spotlight boost</Text>
                  </View>
                </>
              )}
            </View>

            {/* Action Group */}
            <View style={styles.planActionGroup}>
              {isPremium ? (
                <View style={styles.premiumActionsRow}>
                  <TouchableOpacity
                    style={[styles.btnBoost, (boostActive || remainingBoosts <= 0) && styles.btnDisabled]}
                    onPress={handleActivateBoost}
                    disabled={boostActive || activatingBoost || remainingBoosts <= 0}
                  >
                    <Zap size={14} color="#ffffff" />
                    <Text style={styles.btnBoostText}>
                      {activatingBoost ? 'Activating...' : boostActive ? 'Boost Active ✓' : `Activate Boost (${remainingBoosts})`}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.btnCancelPlan} onPress={handleCancelPlan}>
                    <Text style={styles.btnCancelPlanText}>Cancel Plan</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.btnUpgradeHero}
                  onPress={() => {
                    if (plans.length > 0) handleInitiatePlanPurchase(plans[0]);
                  }}
                >
                  <Crown size={15} color="#ffffff" />
                  <Text style={styles.btnUpgradeHeroText}>Upgrade to Premium ✦</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* ── 2. Profile Boost Section with Packages & Buy Boost ── */}
        <View style={styles.boostSectionCard}>
          <LinearGradient
            colors={['#1a0a00', '#4a1c08', '#c93a1a'] as any}
            style={styles.boostSectionHeader}
          >
            <Text style={styles.boostSectionTitle}>⚡ Profile Boost</Text>
            <Text style={styles.boostSectionSub}>Appear at the top of browse results for 1 hour</Text>
          </LinearGradient>

          {/* Boost Status Bar */}
          <View style={styles.boostStatusBar}>
            <View style={styles.boostStatCol}>
              <Text style={styles.boostStatLabel}>Remaining Boosts</Text>
              <Text style={styles.boostStatVal}>{remainingBoosts}</Text>
              {isPremium && nextRenewalAt && (
                <Text style={styles.boostStatSub}>+3 on {fmtDate(nextRenewalAt.toISOString())}</Text>
              )}
            </View>

            <View style={styles.boostStatCol}>
              <Text style={styles.boostStatLabel}>Status</Text>
              {boostActive ? (
                <View style={styles.boostActiveBadge}>
                  <Zap size={12} color="#ffffff" />
                  <Text style={styles.boostActiveBadgeText}>Active</Text>
                </View>
              ) : (
                <Text style={styles.boostInactiveText}>Inactive</Text>
              )}
              {boostActive && boostExpiresAt && (
                <Text style={styles.boostStatSub}>
                  Expires {boostExpiresAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.btnBoostSmall, (boostActive || remainingBoosts <= 0) && styles.btnDisabled]}
              onPress={handleActivateBoost}
              disabled={boostActive || activatingBoost || remainingBoosts <= 0}
            >
              <Zap size={13} color="#ffffff" />
              <Text style={styles.btnBoostSmallText}>
                {activatingBoost ? '...' : boostActive ? 'Active' : 'Boost Now'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Boost Packages to Buy */}
          {boostPackages.length > 0 && (
            <View style={styles.boostPackagesGrid}>
              <Text style={styles.boostPackagesHeading}>Buy Additional Boosts</Text>
              <View style={styles.boostCardsRow}>
                {boostPackages.map((pkg: any) => (
                  <View key={pkg.id} style={styles.boostPkgCard}>
                    <Text style={styles.boostPkgName}>{pkg.name}</Text>
                    <Text style={styles.boostPkgCount}>{pkg.boostCount}</Text>
                    <Text style={styles.boostPkgCountLabel}>{pkg.boostCount === 1 ? 'boost' : 'boosts'}</Text>
                    <Text style={styles.boostPkgPrice}>Rs. {Number(pkg.price).toLocaleString()}</Text>
                    <Text style={styles.boostPkgDesc} numberOfLines={2}>{pkg.description}</Text>

                    <TouchableOpacity
                      style={styles.boostPkgBuyBtn}
                      onPress={() => handleOpenBoostModal(pkg)}
                    >
                      <Text style={styles.boostPkgBuyBtnText}>Buy Now</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* ── 3. TikTok Spotlight Section ── */}
        <View style={styles.tiktokCard}>
          <LinearGradient colors={['#6b21a8', '#9333ea'] as any} style={styles.tiktokHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Video size={20} color="#ffffff" />
              <Text style={styles.tiktokTitle}>TikTok Spotlight</Text>
            </View>
            <Text style={styles.tiktokSub}>
              Get your profile featured on the SriMatch TikTok page (@srimatch) and reach thousands of potential matches.
            </Text>
          </LinearGradient>

          <View style={styles.tiktokBody}>
            {/* Active Promotion Status Banner */}
            {activePromotion && (
              <View style={[
                styles.promoBanner,
                activePromotion.status === 'PUBLISHED' ? { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' } : { backgroundColor: '#fef9c3', borderColor: '#fde047' }
              ]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.promoBannerTitle}>
                    {activePromotion.status === 'PUBLISHED' && '🟢 Live on TikTok!'}
                    {activePromotion.status === 'PROCESSING' && '🔵 Being Processed...'}
                    {activePromotion.status === 'PENDING' && '🟡 Awaiting Review'}
                  </Text>
                  <Text style={styles.promoBannerSub}>
                    {activePromotion.packageName} · {activePromotion.durationDays} day(s)
                  </Text>
                </View>
                {activePromotion.tiktokPostUrl ? (
                  <TouchableOpacity
                    style={styles.btnViewTiktok}
                    onPress={() => Linking.openURL(activePromotion.tiktokPostUrl)}
                  >
                    <ExternalLink size={12} color="#ffffff" />
                    <Text style={styles.btnViewTiktokText}>View on TikTok</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            )}

            {/* TikTok Packages */}
            {tiktokPackages.length > 0 && (
              <View style={styles.tiktokPackagesGrid}>
                {tiktokPackages.map((tp: any) => (
                  <View key={tp.id} style={styles.tiktokPkgCard}>
                    <Text style={styles.tiktokPkgName}>{tp.name}</Text>
                    <View style={styles.tiktokDurationBadge}>
                      <Clock size={10} color="#6b21a8" />
                      <Text style={styles.tiktokDurationText}>{tp.durationDays} {tp.durationDays === 1 ? 'Day' : 'Days'}</Text>
                    </View>
                    <View style={styles.tiktokPriceRow}>
                      <Text style={styles.tiktokPkgPrice}>Rs. {Number(tp.price).toLocaleString()}</Text>
                      {tp.offerPercentage > 0 && (
                        <Text style={styles.tiktokDiscountText}>-{tp.offerPercentage}%</Text>
                      )}
                    </View>
                    {tp.description ? <Text style={styles.tiktokPkgDesc}>{tp.description}</Text> : null}

                    <TouchableOpacity
                      style={[styles.btnGetTiktok, activePromotion && styles.btnDisabled]}
                      onPress={() => handleOpenTiktokModal(tp)}
                      disabled={Boolean(activePromotion)}
                    >
                      <Text style={styles.btnGetTiktokText}>
                        {activePromotion ? 'Promotion Active' : 'Get Featured'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* ── 4. Why Go Premium Grid ── */}
        <View style={styles.whyCard}>
          <Text style={styles.whyTitle}>Why Go Premium?</Text>
          <Text style={styles.whySub}>Join thousands of Sri Lankans who found their life partner on SriMatch</Text>

          <View style={styles.whyGrid}>
            {[
              { icon: Heart, title: 'Find Match Faster', text: 'Premium members match 3× faster with unlimited likes & star likes.' },
              { icon: Eye, title: 'See Who Likes You', text: 'Discover profiles that have already expressed direct interest in you.' },
              { icon: ShieldCheck, title: 'Trusted & Verified', text: 'Premium accounts receive top placement and build instant trust.' },
            ].map((item, idx) => (
              <View key={idx} style={styles.whyItem}>
                <View style={styles.whyIconWrap}>
                  <item.icon size={20} color={Colors.primaryDark} />
                </View>
                <Text style={styles.whyItemTitle}>{item.title}</Text>
                <Text style={styles.whyItemText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── 5. Features Comparison Matrix ── */}
        <View style={styles.comparisonCard}>
          <Text style={styles.comparisonTitle}>Plan Comparison</Text>
          <Text style={styles.comparisonSub}>Everything you get with Premium</Text>

          <View style={styles.comparisonTable}>
            {[
              { name: 'Daily Likes', free: '15 / 5 Days', prem: 'Unlimited' },
              { name: 'Priority Star Likes 👑', free: '❌', prem: 'Unlimited' },
              { name: 'Advanced & Lifestyle Search Filters', free: '❌', prem: 'Full Access' },
              { name: 'Direct Messaging with Matches', free: 'Mutual only', prem: 'Instant' },
              { name: 'Spotlight Profile Boosts', free: '❌', prem: 'Included' },
              { name: 'Priority Placement in Discovery', free: 'Normal', prem: 'Top Ranked' },
            ].map((row, i) => (
              <View key={i} style={styles.compRow}>
                <Text style={styles.compFeature}>{row.name}</Text>
                <Text style={styles.compFree}>{row.free}</Text>
                <Text style={styles.compPrem}>{row.prem}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── 6. Membership Plans (HIDDEN IF USER ALREADY HAS ACTIVE SUBSCRIPTION) ── */}
        {!isPremium && (
          <View style={styles.plansSection}>
            <View style={styles.sectionHeadingRow}>
              <Text style={styles.sectionHeading}>Choose Your Plan</Text>
              <Text style={styles.sectionSubHeading}>Longer plans offer greater savings</Text>
            </View>

            {isLoading ? (
              <ActivityIndicator size="large" color={Colors.primaryMedium} style={{ marginVertical: 20 }} />
            ) : (
              <View style={styles.plansGrid}>
                {plans.map((plan: any) => (
                  <TouchableOpacity
                    key={plan.id}
                    style={styles.planCard}
                    onPress={() => handleInitiatePlanPurchase(plan)}
                    activeOpacity={0.85}
                  >
                    {plan.offerPercentage > 0 && (
                      <View style={styles.planOfferBadge}>
                        <Text style={styles.planOfferText}>{plan.offerPercentage}% OFF</Text>
                      </View>
                    )}

                    <Text style={styles.planTitle}>{plan.title}</Text>
                    <View style={styles.planPriceRow}>
                      <Text style={styles.planCurrency}>Rs.</Text>
                      <Text style={styles.planPriceVal}>{Number(plan.price).toLocaleString()}</Text>
                    </View>
                    <Text style={styles.planDuration}>
                      {plan.timelineMonths} {plan.timelineMonths === 1 ? 'Month' : 'Months'} Access
                    </Text>

                    <TouchableOpacity
                      style={styles.btnChoosePlan}
                      onPress={() => handleInitiatePlanPurchase(plan)}
                    >
                      <Text style={styles.btnChoosePlanText}>Choose Plan</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ── MODAL 1: SUBSCRIPTION PAYMENT & SLIP UPLOAD ─────────── */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <Modal visible={showPlanModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Complete Your Purchase</Text>
              <TouchableOpacity onPress={() => setShowPlanModal(false)} style={styles.modalCloseBtn}>
                <X size={20} color="#6b4a3a" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              {/* Order Summary */}
              {selectedPlan && (
                <View style={styles.orderSummaryBox}>
                  <View>
                    <Text style={styles.orderPlanName}>
                      <Crown size={14} color="#d4a017" /> {selectedPlan.title}
                    </Text>
                    <Text style={styles.orderPlanSub}>Validity: {selectedPlan.timelineMonths} months</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.orderPriceBig}>Rs. {Number(selectedPlan.price).toLocaleString()}</Text>
                    <Text style={styles.orderPriceSub}>one-time</Text>
                  </View>
                </View>
              )}

              {/* Bank Transfer Details */}
              <View style={styles.modalBankBox}>
                <Text style={styles.modalBankHeading}>
                  <Building2 size={14} color={Colors.primaryMedium} /> Bank Transfer Details
                </Text>
                {bankDetails.map((b: any) => (
                  <View key={b.id} style={styles.bankDetailItem}>
                    <Text style={styles.bankItemText}>Bank: <Text style={{ fontWeight: '700' }}>{b.bankName}</Text></Text>
                    <Text style={styles.bankItemText}>Branch: {b.branch || b.branchName}</Text>
                    <TouchableOpacity
                      style={styles.accountCopyRow}
                      onPress={() => handleCopyAccount(b.accountNumber)}
                    >
                      <Text style={styles.bankItemText}>
                        Account: <Text style={{ fontWeight: '800', color: Colors.primaryDark }}>{b.accountNumber}</Text>
                      </Text>
                      <Copy size={13} color={Colors.primaryMedium} />
                    </TouchableOpacity>
                    <Text style={styles.bankItemText}>Name: {b.accountName || b.accountHolderName}</Text>
                  </View>
                ))}
              </View>

              {/* Receipt Upload */}
              <Text style={styles.modalUploadLabel}>Upload Bank Receipt / Slip</Text>
              {planSlipUri ? (
                <View style={styles.modalSlipPreviewWrap}>
                  <Image source={{ uri: planSlipUri }} style={styles.modalSlipPreview} resizeMode="cover" />
                  <TouchableOpacity style={styles.btnChangeSlip} onPress={() => pickSlip('plan')}>
                    <Text style={styles.btnChangeSlipText}>Change Slip Image</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.modalUploadBox} onPress={() => pickSlip('plan')}>
                  <Upload size={24} color={Colors.primaryMedium} />
                  <Text style={styles.modalUploadBoxTitle}>Select Payment Receipt / Screenshot</Text>
                  <Text style={styles.modalUploadBoxSub}>Tap to open gallery</Text>
                </TouchableOpacity>
              )}

              <CustomInput
                label="Transaction Reference / Sender Note"
                placeholder="e.g. Ref #123456 or your name"
                value={planRef}
                onChangeText={setPlanRef}
              />

              <CustomButton
                title={submittingPlan ? 'Submitting Receipt...' : 'Submit Receipt for Verification ✦'}
                variant="primary"
                onPress={handleSubmitPlanReceipt}
                loading={submittingPlan}
                disabled={submittingPlan}
                style={{ marginTop: Spacing.md }}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ── MODAL 2: BUY BOOST PACKAGE MODAL ────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <Modal visible={showBoostModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>⚡ Purchase Boost Package</Text>
              <TouchableOpacity onPress={() => setShowBoostModal(false)} style={styles.modalCloseBtn}>
                <X size={20} color="#6b4a3a" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              {selectedBoostPkg && (
                <View style={styles.orderSummaryBox}>
                  <View>
                    <Text style={styles.orderPlanName}>
                      <Zap size={14} color="#c93a1a" /> {selectedBoostPkg.name}
                    </Text>
                    <Text style={styles.orderPlanSub}>
                      {selectedBoostPkg.boostCount} boost{selectedBoostPkg.boostCount > 1 ? 's' : ''} · 1 hour each
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.orderPriceBig}>Rs. {Number(selectedBoostPkg.price).toLocaleString()}</Text>
                    <Text style={styles.orderPriceSub}>one-time</Text>
                  </View>
                </View>
              )}

              {/* Bank Details */}
              <View style={styles.modalBankBox}>
                <Text style={styles.modalBankHeading}>
                  <Building2 size={14} color={Colors.primaryMedium} /> Bank Transfer Details
                </Text>
                {bankDetails.map((b: any) => (
                  <View key={b.id} style={styles.bankDetailItem}>
                    <Text style={styles.bankItemText}>Bank: <Text style={{ fontWeight: '700' }}>{b.bankName}</Text></Text>
                    <TouchableOpacity
                      style={styles.accountCopyRow}
                      onPress={() => handleCopyAccount(b.accountNumber)}
                    >
                      <Text style={styles.bankItemText}>
                        Account: <Text style={{ fontWeight: '800', color: Colors.primaryDark }}>{b.accountNumber}</Text>
                      </Text>
                      <Copy size={13} color={Colors.primaryMedium} />
                    </TouchableOpacity>
                    <Text style={styles.bankItemText}>Name: {b.accountName || b.accountHolderName}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.modalUploadLabel}>Upload Payment Receipt Slip</Text>
              {boostSlipUri ? (
                <View style={styles.modalSlipPreviewWrap}>
                  <Image source={{ uri: boostSlipUri }} style={styles.modalSlipPreview} resizeMode="cover" />
                  <TouchableOpacity style={styles.btnChangeSlip} onPress={() => pickSlip('boost')}>
                    <Text style={styles.btnChangeSlipText}>Change Slip Image</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.modalUploadBox} onPress={() => pickSlip('boost')}>
                  <Upload size={24} color={Colors.primaryMedium} />
                  <Text style={styles.modalUploadBoxTitle}>Select Payment Receipt / Screenshot</Text>
                  <Text style={styles.modalUploadBoxSub}>Tap to open gallery</Text>
                </TouchableOpacity>
              )}

              <CustomButton
                title={submittingBoost ? 'Submitting...' : 'Submit Boost Receipt ⚡'}
                variant="primary"
                onPress={handleSubmitBoostReceipt}
                loading={submittingBoost}
                disabled={submittingBoost}
                style={{ marginTop: Spacing.md }}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ── MODAL 3: TIKTOK SPOTLIGHT MODAL ─────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <Modal visible={showTiktokModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🎬 TikTok Spotlight Feature</Text>
              <TouchableOpacity onPress={() => setShowTiktokModal(false)} style={styles.modalCloseBtn}>
                <X size={20} color="#6b4a3a" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              {selectedTiktokPkg && (
                <View style={styles.orderSummaryBox}>
                  <View>
                    <Text style={styles.orderPlanName}>
                      <Video size={14} color="#6b21a8" /> {selectedTiktokPkg.name}
                    </Text>
                    <Text style={styles.orderPlanSub}>Duration: {selectedTiktokPkg.durationDays} Days Featured</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.orderPriceBig}>Rs. {Number(selectedTiktokPkg.price).toLocaleString()}</Text>
                    <Text style={styles.orderPriceSub}>one-time</Text>
                  </View>
                </View>
              )}

              {/* Bank Details */}
              <View style={styles.modalBankBox}>
                <Text style={styles.modalBankHeading}>
                  <Building2 size={14} color={Colors.primaryMedium} /> Bank Transfer Details
                </Text>
                {bankDetails.map((b: any) => (
                  <View key={b.id} style={styles.bankDetailItem}>
                    <Text style={styles.bankItemText}>Bank: <Text style={{ fontWeight: '700' }}>{b.bankName}</Text></Text>
                    <TouchableOpacity
                      style={styles.accountCopyRow}
                      onPress={() => handleCopyAccount(b.accountNumber)}
                    >
                      <Text style={styles.bankItemText}>
                        Account: <Text style={{ fontWeight: '800', color: Colors.primaryDark }}>{b.accountNumber}</Text>
                      </Text>
                      <Copy size={13} color={Colors.primaryMedium} />
                    </TouchableOpacity>
                    <Text style={styles.bankItemText}>Name: {b.accountName || b.accountHolderName}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.modalUploadLabel}>Upload Payment Receipt Slip</Text>
              {tiktokSlipUri ? (
                <View style={styles.modalSlipPreviewWrap}>
                  <Image source={{ uri: tiktokSlipUri }} style={styles.modalSlipPreview} resizeMode="cover" />
                  <TouchableOpacity style={styles.btnChangeSlip} onPress={() => pickSlip('tiktok')}>
                    <Text style={styles.btnChangeSlipText}>Change Slip Image</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.modalUploadBox} onPress={() => pickSlip('tiktok')}>
                  <Upload size={24} color={Colors.primaryMedium} />
                  <Text style={styles.modalUploadBoxTitle}>Select Payment Receipt / Screenshot</Text>
                  <Text style={styles.modalUploadBoxSub}>Tap to open gallery</Text>
                </TouchableOpacity>
              )}

              <CustomButton
                title={submittingTiktok ? 'Submitting...' : 'Submit TikTok Request 🎬'}
                variant="primary"
                onPress={handleSubmitTiktokReceipt}
                loading={submittingTiktok}
                disabled={submittingTiktok}
                style={{ marginTop: Spacing.md }}
              />
            </ScrollView>
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
  pendingNoticeBanner: {
    margin: Spacing.base,
    backgroundColor: '#fff9f2',
    borderWidth: 1,
    borderColor: '#f0ddd5',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadows.subtle,
  },
  pendingNoticeIcon: {
    backgroundColor: '#fdf0e8',
    padding: 8,
    borderRadius: 8,
  },
  pendingNoticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8b4e2e',
    marginBottom: 2,
  },
  pendingNoticeSub: {
    fontSize: 11,
    color: '#9a7060',
    lineHeight: 16,
  },

  /* ── Current Plan Card ── */
  currentPlanCard: {
    margin: Spacing.base,
    backgroundColor: '#ffffff',
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0ddd5',
    ...Shadows.card,
  },
  currentPlanHeader: {
    padding: Spacing.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentPlanTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  currentPlanSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  planStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  planStatusText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  currentPlanBody: {
    padding: Spacing.base,
  },
  planDetailsList: {
    gap: 8,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    color: '#4a3028',
  },
  expiryPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fdf5ee',
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  expiryPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  planActionGroup: {
    marginTop: Spacing.xs,
  },
  premiumActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btnBoost: {
    flex: 1,
    backgroundColor: '#c93a1a',
    paddingVertical: 10,
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  btnBoostText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  btnCancelPlan: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#e8ddd8',
    backgroundColor: '#fdf8f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancelPlanText: {
    color: '#9a7060',
    fontSize: 12,
    fontWeight: '600',
  },
  btnUpgradeHero: {
    backgroundColor: Colors.primaryDark,
    paddingVertical: 12,
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadows.subtle,
  },
  btnUpgradeHeroText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  btnDisabled: {
    opacity: 0.5,
  },

  /* ── ⚡ Boost Section ── */
  boostSectionCard: {
    margin: Spacing.base,
    backgroundColor: '#ffffff',
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0ddd5',
    ...Shadows.card,
  },
  boostSectionHeader: {
    padding: Spacing.base,
  },
  boostSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  boostSectionSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  boostStatusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff5f0',
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: '#f5ddd5',
  },
  boostStatCol: {
    gap: 2,
  },
  boostStatLabel: {
    fontSize: 10,
    color: '#9a7060',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  boostStatVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#c93a1a',
  },
  boostStatSub: {
    fontSize: 10,
    color: '#9a7060',
  },
  boostActiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#c93a1a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  boostActiveBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  boostInactiveText: {
    fontSize: 12,
    color: '#9a7060',
    fontWeight: '500',
  },
  btnBoostSmall: {
    backgroundColor: '#c93a1a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  btnBoostSmallText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  boostPackagesGrid: {
    padding: Spacing.base,
  },
  boostPackagesHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2d1810',
    marginBottom: Spacing.sm,
  },
  boostCardsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  boostPkgCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#e8ddd8',
    borderRadius: Radius.md,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  boostPkgName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2d1810',
    marginBottom: 4,
  },
  boostPkgCount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#c93a1a',
  },
  boostPkgCountLabel: {
    fontSize: 9,
    color: '#9a7060',
    marginBottom: 4,
  },
  boostPkgPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2d1810',
    marginBottom: 4,
  },
  boostPkgDesc: {
    fontSize: 9,
    color: '#9a7060',
    textAlign: 'center',
    lineHeight: 12,
    marginBottom: 8,
    minHeight: 24,
  },
  boostPkgBuyBtn: {
    backgroundColor: '#c93a1a',
    width: '100%',
    paddingVertical: 5,
    borderRadius: 6,
    alignItems: 'center',
  },
  boostPkgBuyBtnText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },

  /* ── 🎬 TikTok Spotlight Section ── */
  tiktokCard: {
    margin: Spacing.base,
    backgroundColor: '#ffffff',
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ede9fe',
    ...Shadows.card,
  },
  tiktokHeader: {
    padding: Spacing.base,
  },
  tiktokTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  tiktokSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
    lineHeight: 16,
  },
  tiktokBody: {
    padding: Spacing.base,
  },
  promoBanner: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  promoBannerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2d1810',
  },
  promoBannerSub: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
  },
  btnViewTiktok: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2d1810',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  btnViewTiktokText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  tiktokPackagesGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  tiktokPkgCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#ede9fe',
    borderRadius: Radius.md,
    padding: 10,
    backgroundColor: '#fafafa',
  },
  tiktokPkgName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b21a8',
    marginBottom: 4,
  },
  tiktokDurationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ede9fe',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  tiktokDurationText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#6b21a8',
  },
  tiktokPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  tiktokPkgPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2d1810',
  },
  tiktokDiscountText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#dc2626',
  },
  tiktokPkgDesc: {
    fontSize: 9,
    color: '#6b4a3a',
    lineHeight: 12,
    marginBottom: 8,
  },
  btnGetTiktok: {
    backgroundColor: '#6b21a8',
    paddingVertical: 6,
    borderRadius: Radius.full,
    alignItems: 'center',
    marginTop: 'auto',
  },
  btnGetTiktokText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },

  /* ── Why Go Premium ── */
  whyCard: {
    margin: Spacing.base,
    backgroundColor: '#ffffff',
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: '#f0ddd5',
    ...Shadows.card,
  },
  whyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2d1810',
  },
  whySub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  whyGrid: {
    gap: 12,
  },
  whyItem: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  whyIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fdf5ee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whyItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2d1810',
  },
  whyItemText: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 16,
    flex: 1,
  },

  /* ── Comparison Table ── */
  comparisonCard: {
    margin: Spacing.base,
    backgroundColor: '#ffffff',
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: '#f0ddd5',
    ...Shadows.card,
  },
  comparisonTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2d1810',
  },
  comparisonSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  comparisonTable: {
    gap: 6,
  },
  compRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#faf3ef',
  },
  compFeature: {
    fontSize: 11,
    color: '#4a3028',
    flex: 1.4,
  },
  compFree: {
    fontSize: 10,
    color: Colors.textMuted,
    flex: 0.8,
    textAlign: 'center',
  },
  compPrem: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primaryMedium,
    flex: 0.8,
    textAlign: 'right',
  },

  /* ── Membership Plans (Only when NOT premium) ── */
  plansSection: {
    marginTop: Spacing.xs,
  },
  sectionHeadingRow: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d1810',
  },
  sectionSubHeading: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  plansGrid: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
  },
  planCard: {
    backgroundColor: '#ffffff',
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1.5,
    borderColor: '#e8ddd8',
    position: 'relative',
    ...Shadows.card,
  },
  planOfferBadge: {
    position: 'absolute',
    top: -9,
    right: Spacing.base,
    backgroundColor: '#dc2626',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  planOfferText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
  },
  planTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2d1810',
    marginBottom: 4,
  },
  planPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 2,
  },
  planCurrency: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  planPriceVal: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  planDuration: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  btnChoosePlan: {
    backgroundColor: Colors.primaryDark,
    paddingVertical: 10,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  btnChoosePlanText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },

  /* ── Modals Common Styles ── */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.base,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#f0ddd5',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d1810',
  },
  modalCloseBtn: {
    padding: 4,
  },
  orderSummaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fdf5ee',
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#f0ddd5',
  },
  orderPlanName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2d1810',
  },
  orderPlanSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  orderPriceBig: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  orderPriceSub: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  modalBankBox: {
    backgroundColor: '#fdf8f4',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#e8ddd8',
    marginBottom: Spacing.md,
  },
  modalBankHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: 6,
  },
  bankDetailItem: {
    gap: 4,
  },
  bankItemText: {
    fontSize: 11,
    color: '#4a3028',
  },
  accountCopyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalUploadLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2d1810',
    marginBottom: 6,
  },
  modalUploadBox: {
    borderWidth: 1.5,
    borderColor: '#c9856a',
    borderStyle: 'dashed',
    borderRadius: Radius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fdf5ee',
    marginBottom: Spacing.md,
  },
  modalUploadBoxTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginTop: 4,
  },
  modalUploadBoxSub: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  modalSlipPreviewWrap: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#e8ddd8',
  },
  modalSlipPreview: {
    width: '100%',
    height: 160,
  },
  btnChangeSlip: {
    backgroundColor: 'rgba(20,6,2,0.7)',
    paddingVertical: 6,
    alignItems: 'center',
  },
  btnChangeSlipText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
});
