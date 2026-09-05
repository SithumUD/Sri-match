import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors, Fonts, Spacing, Radius, Shadows } from '../../constants/theme';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Check } from 'lucide-react-native';

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (dateString: string) => void;
  initialDate?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  onClose,
  onSelectDate,
  initialDate,
}) => {
  // Parse initial date or default to 25 years ago
  const parseDate = (dStr?: string) => {
    if (dStr && /^\d{4}-\d{2}-\d{2}$/.test(dStr)) {
      const parts = dStr.split('-').map(Number);
      return { year: parts[0], month: parts[1] - 1, day: parts[2] };
    }
    const defaultYear = new Date().getFullYear() - 25;
    return { year: defaultYear, month: 4, day: 15 };
  };

  const parsed = parseDate(initialDate);
  const [selectedYear, setSelectedYear] = useState<number>(parsed.year);
  const [selectedMonth, setSelectedMonth] = useState<number>(parsed.month);
  const [selectedDay, setSelectedDay] = useState<number>(parsed.day);
  const [viewMode, setViewMode] = useState<'CALENDAR' | 'YEARS' | 'MONTHS'>('CALENDAR');

  const currentYear = new Date().getFullYear();
  const maxYear = currentYear - 18; // Must be at least 18 years old
  const minYear = currentYear - 75;

  const yearsList: number[] = [];
  for (let y = maxYear; y >= minYear; y--) {
    yearsList.push(y);
  }

  // Days in selected month
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(selectedYear, selectedMonth, 1).getDay();

  const handleConfirm = () => {
    const mm = String(selectedMonth + 1).padStart(2, '0');
    const dd = String(Math.min(selectedDay, daysInMonth)).padStart(2, '0');
    const formatted = `${selectedYear}-${mm}-${dd}`;
    onSelectDate(formatted);
    onClose();
  };

  const calculateAge = () => {
    const today = new Date();
    let age = today.getFullYear() - selectedYear;
    const m = today.getMonth() - selectedMonth;
    if (m < 0 || (m === 0 && today.getDate() < selectedDay)) {
      age--;
    }
    return age;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Top Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <CalendarIcon size={18} color={Colors.primaryMedium} />
              <Text style={styles.headerTitle}>Select Date of Birth</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.btnClose}>
              <X size={18} color="#6b4a3a" />
            </TouchableOpacity>
          </View>

          {/* Selected Date Summary Display */}
          <View style={styles.selectedDisplay}>
            <Text style={styles.selectedDateText}>
              {MONTH_NAMES[selectedMonth]} {selectedDay}, {selectedYear}
            </Text>
            <View style={styles.ageBadge}>
              <Text style={styles.ageBadgeText}>{calculateAge()} Years Old</Text>
            </View>
          </View>

          {/* Navigation Bar (Month & Year switchers) */}
          <View style={styles.navBar}>
            <TouchableOpacity
              style={[styles.navPill, viewMode === 'MONTHS' && styles.activeNavPill]}
              onPress={() => setViewMode(viewMode === 'MONTHS' ? 'CALENDAR' : 'MONTHS')}
            >
              <Text style={[styles.navPillText, viewMode === 'MONTHS' && styles.activeNavPillText]}>
                {MONTH_NAMES[selectedMonth]} ▾
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navPill, viewMode === 'YEARS' && styles.activeNavPill]}
              onPress={() => setViewMode(viewMode === 'YEARS' ? 'CALENDAR' : 'YEARS')}
            >
              <Text style={[styles.navPillText, viewMode === 'YEARS' && styles.activeNavPillText]}>
                {selectedYear} ▾
              </Text>
            </TouchableOpacity>
          </View>

          {/* Body Views */}
          {viewMode === 'YEARS' && (
            <ScrollView style={styles.selectionScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.yearsGrid}>
                {yearsList.map((y) => (
                  <TouchableOpacity
                    key={y}
                    style={[styles.yearItem, selectedYear === y && styles.selectedYearItem]}
                    onPress={() => {
                      setSelectedYear(y);
                      setViewMode('CALENDAR');
                    }}
                  >
                    <Text style={[styles.yearText, selectedYear === y && styles.selectedYearText]}>
                      {y}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}

          {viewMode === 'MONTHS' && (
            <View style={styles.monthsGrid}>
              {MONTH_NAMES.map((m, idx) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.monthItem, selectedMonth === idx && styles.selectedMonthItem]}
                  onPress={() => {
                    setSelectedMonth(idx);
                    setViewMode('CALENDAR');
                  }}
                >
                  <Text style={[styles.monthText, selectedMonth === idx && styles.selectedMonthText]}>
                    {m.slice(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {viewMode === 'CALENDAR' && (
            <View style={styles.calendarContainer}>
              {/* Day of Week Headers */}
              <View style={styles.daysHeaderRow}>
                {DAYS_OF_WEEK.map((d) => (
                  <Text key={d} style={styles.dayHeaderCell}>
                    {d}
                  </Text>
                ))}
              </View>

              {/* Days Grid */}
              <View style={styles.daysGrid}>
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <View key={`empty-${i}`} style={styles.emptyDayCell} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const isSelected = selectedDay === dayNum;
                  return (
                    <TouchableOpacity
                      key={`day-${dayNum}`}
                      style={[styles.dayCell, isSelected && styles.selectedDayCell]}
                      onPress={() => setSelectedDay(dayNum)}
                    >
                      <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
                        {dayNum}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnConfirm} onPress={handleConfirm}>
              <Check size={16} color="#ffffff" />
              <Text style={styles.btnConfirmText}>Confirm Date</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 8, 4, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.base,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#ffffff',
    borderRadius: Radius.xl,
    padding: Spacing.base,
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2d1810',
    fontFamily: Fonts.serif,
  },
  btnClose: {
    padding: 4,
  },
  selectedDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fdf5ee',
    borderWidth: 1,
    borderColor: '#f0ddd5',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    marginBottom: Spacing.sm,
  },
  selectedDateText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  ageBadge: {
    backgroundColor: '#2a6040',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  ageBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  navBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.sm,
  },
  navPill: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
    backgroundColor: '#f5ede8',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8ddd8',
  },
  activeNavPill: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primaryDark,
  },
  navPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b4a3a',
  },
  activeNavPillText: {
    color: '#ffffff',
  },
  selectionScroll: {
    maxHeight: 220,
    marginVertical: Spacing.xs,
  },
  yearsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  yearItem: {
    width: '30%',
    paddingVertical: 10,
    borderRadius: Radius.sm,
    backgroundColor: '#fdf8f4',
    borderWidth: 1,
    borderColor: '#e8ddd8',
    alignItems: 'center',
  },
  selectedYearItem: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primaryDark,
  },
  yearText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4a3028',
  },
  selectedYearText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  monthItem: {
    width: '30%',
    paddingVertical: 12,
    borderRadius: Radius.sm,
    backgroundColor: '#fdf8f4',
    borderWidth: 1,
    borderColor: '#e8ddd8',
    alignItems: 'center',
  },
  selectedMonthItem: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primaryDark,
  },
  monthText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4a3028',
  },
  selectedMonthText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  calendarContainer: {
    marginVertical: Spacing.xs,
  },
  daysHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0ddd5',
    marginBottom: 6,
  },
  dayHeaderCell: {
    width: 38,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: '#9a7060',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  emptyDayCell: {
    width: '14.28%',
    height: 36,
  },
  dayCell: {
    width: '14.28%',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
  },
  selectedDayCell: {
    backgroundColor: Colors.primaryDark,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2d1810',
  },
  selectedDayText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#f0ddd5',
  },
  btnCancel: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: '#e8ddd8',
    backgroundColor: '#fdf8f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b4a3a',
  },
  btnConfirm: {
    flex: 1.5,
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 10,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnConfirmText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
});
