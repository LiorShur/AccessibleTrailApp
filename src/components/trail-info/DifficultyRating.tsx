import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DifficultyLevel, difficultyInfo } from '../../models/Accessibility';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, layout } from '../../theme/spacing';

interface DifficultyRatingProps {
  selected: DifficultyLevel | undefined;
  onSelect: (level: DifficultyLevel) => void;
}

const allLevels = Object.keys(difficultyInfo) as DifficultyLevel[];

export const DifficultyRating: React.FC<DifficultyRatingProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <Text style={typography.subheading} accessibilityRole="header">
        Difficulty Level
      </Text>
      <Text style={[typography.caption, styles.hint]}>
        Rate the overall trail difficulty
      </Text>

      <View style={styles.levels} accessibilityRole="radiogroup">
        {allLevels.map((level) => {
          const info = difficultyInfo[level];
          const isSelected = selected === level;

          return (
            <TouchableOpacity
              key={level}
              onPress={() => onSelect(level)}
              accessibilityLabel={`${info.label}: ${info.description}`}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              style={[
                styles.level,
                { borderColor: isSelected ? info.color : colors.neutral.lightGray },
                isSelected && { backgroundColor: `${info.color}10` },
              ]}
              activeOpacity={0.7}
            >
              {/* Color indicator bar */}
              <View style={[styles.colorBar, { backgroundColor: info.color }]} />

              <View style={styles.levelContent}>
                <Text
                  style={[
                    styles.levelLabel,
                    isSelected && { color: info.color },
                  ]}
                >
                  {info.label}
                </Text>
                <Text style={styles.levelDescription} numberOfLines={2}>
                  {info.description}
                </Text>
              </View>
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
  levels: {
    gap: spacing.sm,
  },
  level: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: layout.borderRadius.md,
    borderWidth: 1.5,
    backgroundColor: colors.neutral.white,
    overflow: 'hidden',
    minHeight: layout.minTouchTarget,
  },
  colorBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  levelContent: {
    flex: 1,
    padding: spacing.md,
  },
  levelLabel: {
    ...typography.bodyBold,
    marginBottom: spacing.xxs,
  },
  levelDescription: {
    ...typography.caption,
    fontSize: 13,
  },
});
