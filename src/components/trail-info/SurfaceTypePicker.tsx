import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SurfaceType, surfaceTypeInfo } from '../../models/Accessibility';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, layout } from '../../theme/spacing';

interface SurfaceTypePickerProps {
  selected: SurfaceType | undefined;
  onSelect: (surface: SurfaceType) => void;
}

const allSurfaces = Object.keys(surfaceTypeInfo) as SurfaceType[];

export const SurfaceTypePicker: React.FC<SurfaceTypePickerProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <Text style={typography.subheading} accessibilityRole="header">
        Surface Type
      </Text>
      <Text style={[typography.caption, styles.hint]}>
        What is the primary trail surface?
      </Text>

      <View style={styles.grid} accessibilityRole="radiogroup">
        {allSurfaces.map((surface) => {
          const info = surfaceTypeInfo[surface];
          const isSelected = selected === surface;

          return (
            <TouchableOpacity
              key={surface}
              onPress={() => onSelect(surface)}
              accessibilityLabel={`${info.label}: ${info.accessibilityNote}`}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              style={[
                styles.option,
                isSelected && styles.optionSelected,
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.optionLabel}>{info.label}</Text>
              <Text style={styles.optionNote} numberOfLines={2}>
                {info.accessibilityNote}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  hint: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  option: {
    width: '48%',
    padding: spacing.md,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.neutral.lightGray,
    backgroundColor: colors.neutral.white,
    minHeight: layout.minTouchTarget,
  },
  optionSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.faint,
  },
  optionLabel: {
    ...typography.bodyBold,
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  optionNote: {
    ...typography.caption,
    fontSize: 11,
  },
});
