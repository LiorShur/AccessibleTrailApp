import { TextStyle } from 'react-native';
import { colors } from './colors';

/**
 * Typography scale using system fonts for maximum accessibility.
 * Minimum body size is 16sp to ensure readability.
 */
export const typography: Record<string, TextStyle> = {
  // Large display — screen titles
  displayLarge: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    color: colors.neutral.black,
    letterSpacing: -0.2,
  },

  // Section headers
  heading: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    color: colors.neutral.black,
  },

  // Sub-section headers
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    color: colors.neutral.black,
  },

  // Primary body text
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: colors.neutral.darkGray,
  },

  // Bold body text for emphasis
  bodyBold: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    color: colors.neutral.black,
  },

  // Stat values (distance, time, elevation)
  stat: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
    color: colors.neutral.black,
    fontVariant: ['tabular-nums'],
  },

  // Stat labels
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    color: colors.neutral.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // Small supporting text
  caption: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    color: colors.neutral.gray,
  },

  // Button labels
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 0.3,
  },

  // Chip / tag text
  chip: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
};
