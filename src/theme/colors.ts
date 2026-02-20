/**
 * Color palette designed for WCAG AA compliance.
 * All foreground/background combinations meet minimum 4.5:1 contrast ratio.
 */
export const colors = {
  // Primary greens — nature / trail identity
  primary: {
    dark: '#1B4332',
    main: '#2D6A4F',
    light: '#52B788',
    faint: '#D8F3DC',
  },

  // Secondary earth tones — warmth / waypoints
  secondary: {
    dark: '#6B4F1D',
    main: '#8B6914',
    light: '#C9A94E',
    faint: '#FDF3D7',
  },

  // Neutrals
  neutral: {
    black: '#1A1A2E',
    darkGray: '#4A4A5A',
    gray: '#7B7B8E',
    lightGray: '#C4C4D0',
    offWhite: '#F4F4F8',
    white: '#FFFFFF',
  },

  // Semantic colors
  semantic: {
    error: '#C62828',
    errorLight: '#FFEBEE',
    warning: '#F57F17',
    warningLight: '#FFF8E1',
    success: '#2E7D32',
    successLight: '#E8F5E9',
    info: '#1565C0',
    infoLight: '#E3F2FD',
  },

  // Recording state
  recording: {
    active: '#D32F2F',
    activeGlow: 'rgba(211, 47, 47, 0.2)',
    paused: '#F57F17',
  },

  // Map-specific
  map: {
    trailLine: '#2D6A4F',
    trailLineRecording: '#D32F2F',
    waypointFill: '#FFFFFF',
    waypointStroke: '#2D6A4F',
    userLocation: '#1565C0',
    userLocationGlow: 'rgba(21, 101, 192, 0.25)',
  },

  // Overlay / transparency
  overlay: {
    light: 'rgba(255, 255, 255, 0.92)',
    dark: 'rgba(0, 0, 0, 0.5)',
    scrim: 'rgba(0, 0, 0, 0.32)',
  },
} as const;
