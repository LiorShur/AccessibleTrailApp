import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, layout } from '../../theme/spacing';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'default' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  accessibilityHint?: string;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'default',
  disabled = false,
  loading = false,
  icon,
  accessibilityHint,
  style,
}) => {
  const variantStyles: Record<string, { bg: string; text: string; border?: string }> = {
    primary: { bg: colors.primary.main, text: colors.neutral.white },
    secondary: { bg: colors.neutral.white, text: colors.primary.main, border: colors.primary.main },
    danger: { bg: colors.recording.active, text: colors.neutral.white },
    ghost: { bg: 'transparent', text: colors.primary.main },
  };

  const v = variantStyles[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      style={[
        styles.base,
        size === 'large' && styles.large,
        {
          backgroundColor: v.bg,
          borderColor: v.border || 'transparent',
          borderWidth: v.border ? 1.5 : 0,
        },
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={v.text} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[typography.button, { color: v.text }, icon ? styles.labelWithIcon : null]}>
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    height: layout.minTouchTarget,
    borderRadius: layout.borderRadius.md,
    minWidth: 120,
  },
  large: {
    height: layout.fabSize,
    paddingHorizontal: spacing.xxl,
    borderRadius: layout.borderRadius.lg,
  },
  disabled: {
    opacity: 0.4,
  },
  labelWithIcon: {
    marginLeft: spacing.sm,
  },
});
