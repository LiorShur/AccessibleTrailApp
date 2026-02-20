/**
 * Consistent spacing scale based on 4px grid.
 * Touch targets use minimum 48px (per WCAG 2.5.5 / Android guidelines).
 */
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 48,
} as const;

export const layout = {
  // Minimum touch target size (WCAG 2.5.5)
  minTouchTarget: 48,

  // Border radii
  borderRadius: {
    sm: 6,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  // Bottom sheet
  bottomSheet: {
    handleWidth: 40,
    handleHeight: 4,
    borderRadius: 20,
  },

  // Map controls
  mapControlSize: 44,
  fabSize: 56,
} as const;
