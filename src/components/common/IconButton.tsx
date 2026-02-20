import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  AccessibilityRole,
} from 'react-native';
import { colors } from '../../theme/colors';
import { layout } from '../../theme/spacing';

interface IconButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  accessibilityLabel: string;
  accessibilityHint?: string;
  size?: number;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityRole?: AccessibilityRole;
}

export const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  children,
  accessibilityLabel,
  accessibilityHint,
  size = layout.minTouchTarget,
  variant = 'ghost',
  disabled = false,
  style,
  accessibilityRole = 'button',
}) => {
  const variantStyles: Record<string, ViewStyle> = {
    primary: {
      backgroundColor: colors.primary.main,
    },
    secondary: {
      backgroundColor: colors.neutral.white,
      borderWidth: 1.5,
      borderColor: colors.primary.main,
    },
    ghost: {
      backgroundColor: colors.overlay.light,
    },
    danger: {
      backgroundColor: colors.recording.active,
    },
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
      accessibilityState={{ disabled }}
      style={[
        styles.base,
        { width: size, height: size, borderRadius: size / 2 },
        variantStyles[variant],
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    // Elevation for Android
    elevation: 3,
    // Shadow for iOS
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  disabled: {
    opacity: 0.4,
  },
});
