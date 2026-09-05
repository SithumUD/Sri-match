import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Colors, Fonts, Spacing, Radius } from '../constants/theme';
import { GradientHeader } from '../components/ui/GradientHeader';
import { CustomInput } from '../components/ui/CustomInput';
import { CustomButton } from '../components/ui/CustomButton';
import { HelpCircle, ChevronDown, ChevronUp, Mail, ShieldCheck } from 'lucide-react-native';

const FAQS = [
  {
    q: 'How does NIC verification work on SriMatch?',
    a: 'We securely verify government-issued National Identity Cards (NIC) or Passports alongside a live selfie to ensure authenticity and keep SriMatch free of fake profiles.',
  },
  {
    q: 'Can non-Sri Lankan residents join SriMatch?',
    a: 'Yes! Sri Lankan expatriates and individuals residing in the UK, Australia, Canada, UAE, and worldwide looking for Sri Lankan brides or grooms are warmly welcome.',
  },
  {
    q: 'What are Star Likes?',
    a: 'Star Likes are priority super-interests that place your profile directly at the top of the recipient’s list with a gold notification banner.',
  },
  {
    q: 'How do I activate a Premium subscription?',
    a: 'You can select a package from the Premium tab, make a bank deposit or online transfer to our official bank account, and upload your receipt slip for activation within 1-2 hours.',
  },
];

export default function HelpScreen() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggleFaq = (i: number) => {
    setExpandedIdx(expandedIdx === i ? null : i);
  };

  const handleSendSupport = () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Required Fields', 'Please enter a subject and message.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubject('');
      setMessage('');
      Alert.alert('Inquiry Sent! 💌', 'Thank you. Our customer support team will reply within 24 hours.');
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <GradientHeader title="Help & Support" subtitle="Frequently asked questions & assistance" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* FAQs */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <HelpCircle size={18} color={Colors.primaryMedium} />
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          </View>

          {FAQS.map((faq, i) => {
            const isExpanded = expandedIdx === i;
            return (
              <View key={i} style={styles.faqItem}>
                <TouchableOpacity
                  style={styles.faqQuestionRow}
                  onPress={() => toggleFaq(i)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.faqQuestion}>{faq.q}</Text>
                  {isExpanded ? (
                    <ChevronUp size={18} color={Colors.primaryMedium} />
                  ) : (
                    <ChevronDown size={18} color={Colors.textMuted} />
                  )}
                </TouchableOpacity>

                {isExpanded && <Text style={styles.faqAnswer}>{faq.a}</Text>}
              </View>
            );
          })}
        </View>

        {/* Safety Guidelines Box */}
        <View style={[styles.card, { backgroundColor: Colors.primaryExtraLight }]}>
          <View style={styles.headerRow}>
            <ShieldCheck size={18} color={Colors.primaryMedium} />
            <Text style={styles.sectionTitle}>Safety & Trust Guidelines</Text>
          </View>

          <Text style={styles.safetyText}>
            • Always meet in public places for initial family visits.{'\n'}
            • Never transfer funds or disclose private banking credentials.{'\n'}
            • Look for the green verified badge on member profiles.{'\n'}
            • Report any suspicious profiles immediately.
          </Text>
        </View>

        {/* Contact Support Form */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Mail size={18} color={Colors.primaryMedium} />
            <Text style={styles.sectionTitle}>Contact Support Team</Text>
          </View>

          <CustomInput
            label="Subject"
            placeholder="e.g. Question about my subscription"
            value={subject}
            onChangeText={setSubject}
          />

          <CustomInput
            label="Your Message"
            placeholder="How can our support team assist you today?"
            multiline
            numberOfLines={4}
            style={{ height: 100, textAlignVertical: 'top', paddingTop: 8 }}
            value={message}
            onChangeText={setMessage}
          />

          <CustomButton
            title="Send Message ✦"
            variant="primary"
            onPress={handleSendSupport}
            loading={submitting}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxl,
    padding: Spacing.lg,
    marginBottom: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: Fonts?.serif || 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingVertical: 12,
  },
  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.sm,
    lineHeight: 20,
  },
  faqAnswer: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 8,
    lineHeight: 20,
  },
  safetyText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
