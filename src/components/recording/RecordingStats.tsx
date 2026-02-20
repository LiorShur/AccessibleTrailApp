import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, layout } from '../../theme/spacing';

interface RecordingStatsProps {
  distanceMeters: number;
  durationSeconds: number;
  elevationGainMeters: number;
  isRecording: boolean;
}

export const RecordingStats: React.FC<RecordingStatsProps> = ({
  distanceMeters,
  durationSeconds,
  elevationGainMeters,
  isRecording,
}) => {
  const distance = formatDistance(distanceMeters);
  const duration = formatDuration(durationSeconds);
  const elevation = formatElevation(elevationGainMeters);

  return (
    <View
      style={[styles.container, isRecording && styles.containerRecording]}
      accessibilityRole="summary"
      accessibilityLabel={`Trail stats: ${distance.value} ${distance.unit}, ${duration.value}, ${elevation.value} ${elevation.unit} elevation gain`}
    >
      {/* Recording indicator dot */}
      {isRecording && (
        <View style={styles.recordingIndicator}>
          <View style={styles.recordingDot} />
          <Text style={styles.recordingLabel}>REC</Text>
        </View>
      )}

      <View style={styles.statsRow}>
        <StatItem label="Distance" value={distance.value} unit={distance.unit} />
        <View style={styles.divider} />
        <StatItem label="Time" value={duration.value} unit={duration.unit} />
        <View style={styles.divider} />
        <StatItem label="Elevation" value={elevation.value} unit={elevation.unit} prefix="↑" />
      </View>
    </View>
  );
};

interface StatItemProps {
  label: string;
  value: string;
  unit: string;
  prefix?: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, unit, prefix }) => (
  <View style={styles.statItem} accessibilityLabel={`${label}: ${prefix || ''}${value} ${unit}`}>
    <Text style={typography.statLabel}>{label}</Text>
    <Text style={typography.stat}>
      {prefix}
      {value}
      <Text style={styles.unit}> {unit}</Text>
    </Text>
  </View>
);

function formatDistance(meters: number): { value: string; unit: string } {
  if (meters < 1000) {
    return { value: Math.round(meters).toString(), unit: 'm' };
  }
  const km = meters / 1000;
  return { value: km.toFixed(1), unit: 'km' };
}

function formatDuration(seconds: number): { value: string; unit: string } {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return { value: `${hrs}:${mins.toString().padStart(2, '0')}`, unit: 'hr' };
  }
  return { value: `${mins}:${secs.toString().padStart(2, '0')}`, unit: 'min' };
}

function formatElevation(meters: number): { value: string; unit: string } {
  return { value: Math.round(meters).toString(), unit: 'm' };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.overlay.light,
    borderRadius: layout.borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginHorizontal: spacing.lg,
    // Shadow
    elevation: 4,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  containerRecording: {
    borderWidth: 1.5,
    borderColor: colors.recording.active,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.recording.active,
    marginRight: spacing.xs,
  },
  recordingLabel: {
    ...typography.caption,
    color: colors.recording.active,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 1.5,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: colors.neutral.lightGray,
  },
  unit: {
    ...typography.caption,
    fontSize: 14,
  },
});
