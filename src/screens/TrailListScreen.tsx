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

// Sample trails for demonstration — in production, load from async storage or API
const SAMPLE_TRAILS: Trail[] = [
  {
    id: 'sample-1',
    name: 'Lakeside Loop',
    description:
      'A gentle paved loop around Mirror Lake with benches every 200 meters. Fully wheelchair accessible with level terrain and shade throughout.',
    difficulty: 'easy',
    surfaceType: 'paved',
    accessibilityFeatures: [
      'wheelchair_accessible',
      'paved_surface',
      'gentle_slope',
      'rest_areas',
      'accessible_parking',
      'accessible_restrooms',
      'wide_path',
      'level_terrain',
      'shade_available',
    ],
    coordinates: [],
    waypoints: [
      {
        id: 'wp-1',
        type: 'trailhead',
        latitude: 37.7694,
        longitude: -122.4862,
        name: 'Main Entrance',
        accessibilityNote: 'Accessible parking lot with 4 designated spaces',
        createdAt: '2026-01-15T09:00:00Z',
      },
      {
        id: 'wp-2',
        type: 'rest_area',
        latitude: 37.7698,
        longitude: -122.4870,
        name: 'Lakeside Bench',
        accessibilityNote: 'Bench with backrest and armrests, paved pad',
        createdAt: '2026-01-15T09:12:00Z',
      },
      {
        id: 'wp-3',
        type: 'scenic_viewpoint',
        latitude: 37.7702,
        longitude: -122.4878,
        name: 'Lake Overlook',
        accessibilityNote: 'Viewing platform with railing, wheelchair accessible',
        createdAt: '2026-01-15T09:20:00Z',
      },
    ],
    distanceMeters: 1850,
    elevationGainMeters: 5,
    estimatedDurationMinutes: 32,
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-01-15T09:32:00Z',
    isPublished: false,
  },
  {
    id: 'sample-2',
    name: 'Redwood Creek Trail',
    description:
      'A boardwalk trail through old-growth redwoods. Some sections narrow to 1.2m. Gentle grades with one moderate slope near the creek bridge.',
    difficulty: 'moderate',
    surfaceType: 'boardwalk',
    accessibilityFeatures: [
      'handrails',
      'rest_areas',
      'shade_available',
      'accessible_parking',
    ],
    coordinates: [],
    waypoints: [
      {
        id: 'wp-4',
        type: 'trailhead',
        latitude: 37.8950,
        longitude: -122.5716,
        name: 'Visitor Center',
        createdAt: '2026-02-01T10:00:00Z',
      },
      {
        id: 'wp-5',
        type: 'surface_change',
        latitude: 37.8955,
        longitude: -122.5720,
        name: 'Boardwalk Start',
        accessibilityNote: 'Transition from packed gravel to boardwalk; small lip at junction',
        createdAt: '2026-02-01T10:08:00Z',
      },
      {
        id: 'wp-6',
        type: 'steep_section',
        latitude: 37.8962,
        longitude: -122.5730,
        name: 'Creek Bridge Approach',
        accessibilityNote: 'Moderate downhill slope for ~30m, handrails on both sides',
        createdAt: '2026-02-01T10:22:00Z',
      },
    ],
    distanceMeters: 3200,
    elevationGainMeters: 42,
    estimatedDurationMinutes: 55,
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-01T10:55:00Z',
    isPublished: false,
  },
  {
    id: 'sample-3',
    name: 'Summit Ridge Path',
    description:
      'Steep gravel trail to the ridge viewpoint. Rocky in sections with exposed roots. Not suitable for wheelchairs or mobility aids.',
    difficulty: 'difficult',
    surfaceType: 'gravel',
    accessibilityFeatures: ['rest_areas'],
    coordinates: [],
    waypoints: [
      {
        id: 'wp-7',
        type: 'hazard',
        latitude: 37.8800,
        longitude: -122.2490,
        name: 'Loose Gravel Section',
        accessibilityNote: 'Steep loose surface, trekking poles recommended',
        createdAt: '2026-02-10T08:15:00Z',
      },
      {
        id: 'wp-8',
        type: 'scenic_viewpoint',
        latitude: 37.8815,
        longitude: -122.2510,
        name: 'Ridge Viewpoint',
        createdAt: '2026-02-10T08:45:00Z',
      },
    ],
    distanceMeters: 4800,
    elevationGainMeters: 310,
    estimatedDurationMinutes: 95,
    createdAt: '2026-02-10T08:00:00Z',
    updatedAt: '2026-02-10T09:35:00Z',
    isPublished: false,
  },
];

export const TrailListScreen: React.FC<TrailListScreenProps> = ({ navigation }) => {
  const [trails] = useState<Trail[]>(SAMPLE_TRAILS);

  const renderTrail = ({ item }: { item: Trail }) => {
    const difficulty = difficultyInfo[item.difficulty];
    const surface = surfaceTypeInfo[item.surfaceType];

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('TrailDetail', { trail: item })}
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
