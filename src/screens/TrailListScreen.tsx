import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Trail, difficultyInfo, surfaceTypeInfo } from '../models';
import { Chip } from '../components/common/Chip';
import { AccessibilityTags } from '../components/trail-info/AccessibilityTags';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, layout } from '../theme/spacing';

interface TrailListScreenProps {
  navigation: any;
}

// Placeholder: in production this would come from async storage or an API
const SAMPLE_TRAILS: Trail[] = [];

export const TrailListScreen: React.FC<TrailListScreenProps> = ({ navigation }) => {
  const [trails] = useState<Trail[]>(SAMPLE_TRAILS);

  const renderTrail = ({ item }: { item: Trail }) => {
    const difficulty = difficultyInfo[item.difficulty];
    const surface = surfaceTypeInfo[item.surfaceType];

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('TrailDetail', { trailId: item.id })}
        accessibilityLabel={`${item.name}, ${difficulty.label}, ${formatDistance(item.distanceMeters)}`}
        accessibilityHint="Double tap to view trail details"
        accessibilityRole="button"
        activeOpacity={0.7}
      >
        {/* Difficulty color bar */}
        <View style={[styles.difficultyBar, { backgroundColor: difficulty.color }]} />

        <View style={styles.cardContent}>
          {/* Header */}
          <View style={styles.cardHeader}>
            <Text style={styles.trailName} numberOfLines={1}>
              {item.name}
            </Text>
            <Chip
              label={difficulty.label}
              selected
              color={difficulty.color}
              style={styles.difficultyChip}
            />
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <Text style={styles.stat}>
              {formatDistance(item.distanceMeters)}
            </Text>
            <Text style={styles.statDivider}>·</Text>
            <Text style={styles.stat}>
              {item.estimatedDurationMinutes} min
            </Text>
            <Text style={styles.statDivider}>·</Text>
            <Text style={styles.stat}>↑{item.elevationGainMeters}m</Text>
            <Text style={styles.statDivider}>·</Text>
            <Text style={styles.stat}>{surface.label}</Text>
          </View>

          {/* Accessibility features preview */}
          {item.accessibilityFeatures.length > 0 && (
            <View style={styles.tagsPreview}>
              <Text style={styles.accessibilityIcon}>♿</Text>
              <Text style={styles.tagCount}>
                {item.accessibilityFeatures.length} accessibility feature
                {item.accessibilityFeatures.length !== 1 ? 's' : ''}
              </Text>
            </View>
          )}

          {/* Description preview */}
          {item.description && (
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={typography.displayLarge} accessibilityRole="header">
          My Trails
        </Text>
        <Text style={[typography.body, styles.subtitle]}>
          {trails.length} trail{trails.length !== 1 ? 's' : ''} recorded
        </Text>
      </View>

      {trails.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🗺️</Text>
          <Text style={styles.emptyTitle}>No trails yet</Text>
          <Text style={styles.emptyDescription}>
            Head to the Map tab and tap "Start Recording" to map your first
            accessible trail.
          </Text>
        </View>
      ) : (
        <FlatList
          data={trails}
          keyExtractor={(item) => item.id}
          renderItem={renderTrail}
          contentContainerStyle={styles.list}
          accessibilityRole="list"
        />
      )}
    </SafeAreaView>
  );
};

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.offWhite,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    backgroundColor: colors.neutral.white,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
  list: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.neutral.white,
    borderRadius: layout.borderRadius.lg,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  difficultyBar: {
    width: 4,
  },
  cardContent: {
    flex: 1,
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trailName: {
    ...typography.subheading,
    flex: 1,
    marginRight: spacing.sm,
  },
  difficultyChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  stat: {
    ...typography.caption,
    fontWeight: '500',
  },
  statDivider: {
    ...typography.caption,
    marginHorizontal: spacing.xs,
    color: colors.neutral.lightGray,
  },
  tagsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  accessibilityIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  tagCount: {
    ...typography.caption,
    color: colors.primary.main,
    fontWeight: '600',
  },
  description: {
    ...typography.caption,
    marginTop: spacing.sm,
  },
  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.heading,
    color: colors.neutral.gray,
  },
  emptyDescription: {
    ...typography.body,
    textAlign: 'center',
    marginTop: spacing.sm,
    color: colors.neutral.gray,
  },
});
