import { Platform } from 'react-native';

export const Colors = {
  // Brand Terracotta / Cinnamon Brown palette
  primaryDark: '#3d1f12',
  primary: '#6b3526',
  primaryMedium: '#8b4e2e',
  primaryLight: '#c9856a',
  primaryExtraLight: '#fdf0e8',
  
  // Sri Lankan Royal Gold accents
  gold: '#e8c97a',
  goldDark: '#c9a050',
  goldLight: '#fef7e6',

  // Backgrounds
  background: '#fdf8f4',
  surface: '#ffffff',
  surfaceElevated: '#ffffff',
  surfaceSoft: '#fdf5ee',
  surfaceCard: '#ffffff',

  // Text Colors
  text: '#2d1810',
  textSecondary: '#6b4a3a',
  textMuted: '#9a7060',
  textLight: '#b09080',
  textWhite: '#ffffff',

  // Borders & Dividers
  border: '#f0ddd5',
  borderLight: '#f7eee9',
  borderDark: '#e0c8bf',

  // Status & Badges
  verifiedGreen: '#16a34a',
  boostedOrange: '#e07a30',
  likePink: '#c03060',
  likePinkLight: '#fde8ec',
  starGold: '#d4a017',
  starGoldLight: '#fef8e2',
  errorRed: '#dc2626',
  errorRedLight: '#fee2e2',

  // Gradients
  gradients: {
    hero: ['#3d1f12', '#6b3526', '#8b4e2e', '#c9856a'],
    header: ['#3d1f12', '#6b3526', '#8b4e2e'],
    gold: ['#e8c97a', '#c9a050'],
    primaryBtn: ['#3d1f12', '#8b4e2e', '#c9856a'],
    cardOverlay: ['rgba(30,10,5,0.7)', 'rgba(30,10,5,0.2)', 'transparent'],
    boost: ['#e07a30', '#c93a1a'],
    softCard: ['#fdf5ee', '#faf0f8'],
  },
} as const;

export const Fonts = {
  regular: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }) || 'System',
  medium: Platform.select({ ios: 'System', android: 'sans-serif-medium', default: 'System' }) || 'sans-serif-medium',
  bold: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }) || 'sans-serif',
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }) || 'serif',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

export const Shadows = {
  card: {
    shadowColor: '#783c1e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  glow: {
    shadowColor: '#c9856a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 5,
  },
  gold: {
    shadowColor: '#c9a050',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 4,
  },
  subtle: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
};
