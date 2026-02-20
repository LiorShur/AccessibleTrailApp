import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { TrailMap } from '../components/map';
import { AccessibilityTags } from '../components/trail-info/AccessibilityTags';
import { WaypointList } from '../components/waypoints/WaypointList';
import { Trail, difficultyInfo, surfaceTypeInfo } from '../models';
import { Chip } from '../components/common/Chip';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, layout } from '../theme/spacing';

interface TrailDetailScreenProps {
  navigation: any;
  route: { params: { trail: Trail } };
}

export const TrailDetailScreen: React.FC<TrailDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { trail } = route.params;
  const difficulty = difficultyInfo[trail.difficulty];
  const surface = surfaceTypeInfo[trail.surfaceType];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Map preview (non-interactive overview) */}
        <View style={styles.mapPreview}>
          <TrailMap
            coordinates={trail.coordinates}
            waypoints={trail.waypoints}
            recordingState="idle"
          />
        </View>

        {/* Trail header */}
        <View style={styles.header}>
          <Text style={typography.displayLarge} accessibilityRole="header">
            {trail.name}
          </Text>

          {/* Difficulty and surface */}
          <View style={styles.chipRow}>
            <Chip label={difficulty.label} selected color={difficulty.color} />
            <Chip label={surface.label} selected color={colors.secondary.main} />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <StatCard
            label="Distance"
            value={formatDistance(trail.distanceMeters)}
          />
          <StatCard
            label="Duration"
            value={`${trail.estimatedDurationMinutes} min`}
          />
          <StatCard
            label="Elevation Gain"
            value={`↑${trail.elevationGainMeters}m`}
          />
          <StatCard
            label="Waypoints"
            value={trail.waypoints.length.toString()}
          />
        </View>

        {/* Description */}
        {trail.description && (
          <View style={styles.section}>
            <Text style={typography.subheading} accessibilityRole="header">
              About
            </Text>
            <Text style={[typography.body, styles.descriptionText]}>
              {trail.description}
            </Text>
          </View>
        )}

        {/* Surface detail */}
        <View style={styles.section}>
          <Text style={typography.subheading} accessibilityRole="header">
            Surface
          </Text>
          <Text style={[typography.body, styles.surfaceNote]}>
            {surface.label} — {surface.accessibilityNote}
          </Text>
        </View>

        {/* Accessibility features */}
        {trail.accessibilityFeatures.length > 0 && (
          <View style={styles.section}>
            <AccessibilityTags
              selected={trail.accessibilityFeatures}
              onToggle={() => {}}
              readOnly
            />
          </View>
        )}

        {/* Waypoints */}
        {trail.waypoints.length > 0 && (
          <View style={styles.section}>
            <Text style={typography.subheading} accessibilityRole="header">
              Waypoints
            </Text>
            <WaypointList
              waypoints={trail.waypoints}
              onWaypointPress={() => {}}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

interface StatCardProps {
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value }) => (
  <View style={styles.statCard} accessibilityLabel={`${label}: ${value}`}>
    <Text style={typography.statLabel}>{label}</Text>
    <Text style={typography.stat}>{value}</Text>
  </View>
);

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  mapPreview: {
    height: 240,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  statCard: {
    width: '47%',
    backgroundColor: colors.neutral.offWhite,
    borderRadius: layout.borderRadius.md,
    padding: spacing.lg,
  },
  section: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xxl,
  },
  descriptionText: {
    marginTop: spacing.sm,
  },
  surfaceNote: {
    marginTop: spacing.sm,
  },
});
