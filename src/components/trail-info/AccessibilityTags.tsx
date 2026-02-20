import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Chip } from '../common/Chip';
import {
  AccessibilityFeature,
  accessibilityFeatureInfo,
} from '../../models/Accessibility';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface AccessibilityTagsProps {
  /** Currently selected features */
  selected: AccessibilityFeature[];
  /** Called when a feature is toggled */
  onToggle: (feature: AccessibilityFeature) => void;
  /** If true, shows as read-only display chips */
  readOnly?: boolean;
}

const allFeatures = Object.keys(accessibilityFeatureInfo) as AccessibilityFeature[];

export const AccessibilityTags: React.FC<AccessibilityTagsProps> = ({
  selected,
  onToggle,
  readOnly = false,
}) => {
  const features = readOnly ? selected : allFeatures;

  return (
    <View style={styles.container}>
      <Text style={typography.subheading} accessibilityRole="header">
        Accessibility Features
      </Text>
      <Text style={[typography.caption, styles.hint]}>
        {readOnly
          ? `${selected.length} feature${selected.length !== 1 ? 's' : ''} tagged`
          : 'Select all features available on this trail'}
      </Text>

      <ScrollView
        horizontal={false}
        contentContainerStyle={styles.tagGrid}
        accessibilityRole="list"
      >
        {features.map((feature) => {
          const info = accessibilityFeatureInfo[feature];
          const isSelected = selected.includes(feature);

          return (
            <View key={feature} accessibilityRole="listitem">
              <Chip
                label={info.label}
                selected={isSelected}
                onPress={readOnly ? undefined : () => onToggle(feature)}
                color={colors.primary.main}
                accessibilityLabel={`${info.label}: ${info.description}`}
                accessibilityHint={
                  readOnly
                    ? undefined
                    : isSelected
                    ? 'Double tap to remove'
                    : 'Double tap to add'
                }
                style={styles.tag}
              />
            </View>
          );
        })}
      </ScrollView>
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
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    marginBottom: spacing.xs,
  },
});
