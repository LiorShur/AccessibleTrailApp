import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, layout } from '../../theme/spacing';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  color?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: ViewStyle;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  color = colors.primary.main,
  accessibilityLabel,
  accessibilityHint,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      accessibilityLabel={accessibilityLabel || label}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[
        styles.chip,
        selected
          ? { backgroundColor: color, borderColor: color }
          : { backgroundColor: colors.neutral.offWhite, borderColor: colors.neutral.lightGray },
        style,
      ]}
      activeOpacity={0.7}
    >
      <Text
        style={[
          typography.chip,
          { color: selected ? colors.neutral.white : colors.neutral.darkGray },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: layout.borderRadius.full,
    borderWidth: 1.5,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
