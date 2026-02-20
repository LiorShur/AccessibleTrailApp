import React from 'react';
import { View, Text, StyleSheet, AccessibilityInfo } from 'react-native';
import { Button } from '../common/Button';
import { IconButton } from '../common/IconButton';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, layout } from '../../theme/spacing';
import { RecordingState } from '../../models';

interface RecordingControlsProps {
  recordingState: RecordingState;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onAddWaypoint: () => void;
}

export const RecordingControls: React.FC<RecordingControlsProps> = ({
  recordingState,
  onStart,
  onPause,
  onResume,
  onStop,
  onAddWaypoint,
}) => {
  const handleStart = () => {
    onStart();
    AccessibilityInfo.announceForAccessibility('Trail recording started');
  };

  const handlePause = () => {
    onPause();
    AccessibilityInfo.announceForAccessibility('Recording paused');
  };

  const handleResume = () => {
    onResume();
    AccessibilityInfo.announceForAccessibility('Recording resumed');
  };

  const handleStop = () => {
    onStop();
    AccessibilityInfo.announceForAccessibility('Recording stopped');
  };

  if (recordingState === 'idle') {
    return (
      <View style={styles.container}>
        <Button
          label="Start Recording"
          onPress={handleStart}
          variant="primary"
          size="large"
          accessibilityHint="Begins recording your trail path using GPS"
          icon={<Text style={styles.recordIcon}>●</Text>}
          style={styles.startButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Add waypoint button */}
      <Button
        label="Add Waypoint"
        onPress={onAddWaypoint}
        variant="secondary"
        accessibilityHint="Mark a point of interest on the trail"
        icon={<Text style={styles.waypointIcon}>📍</Text>}
        style={styles.waypointButton}
      />

      {/* Recording controls */}
      <View style={styles.recordingGroup}>
        {recordingState === 'recording' ? (
          <IconButton
            onPress={handlePause}
            accessibilityLabel="Pause recording"
            accessibilityHint="Pauses GPS tracking, tap again to resume"
            size={layout.fabSize}
            variant="secondary"
          >
            <Text style={styles.pauseIcon}>⏸</Text>
          </IconButton>
        ) : (
          <IconButton
            onPress={handleResume}
            accessibilityLabel="Resume recording"
            accessibilityHint="Resumes GPS tracking from where you paused"
            size={layout.fabSize}
            variant="primary"
          >
            <Text style={styles.resumeIcon}>▶</Text>
          </IconButton>
        )}

        <IconButton
          onPress={handleStop}
          accessibilityLabel="Stop and finish recording"
          accessibilityHint="Stops recording and lets you save the trail"
          size={layout.fabSize}
          variant="danger"
          style={styles.stopButton}
        >
          <Text style={styles.stopIcon}>■</Text>
        </IconButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  startButton: {
    flex: 1,
  },
  recordIcon: {
    color: colors.recording.active,
    fontSize: 14,
  },
  waypointButton: {
    flex: 1,
    marginRight: spacing.md,
  },
  waypointIcon: {
    fontSize: 16,
  },
  recordingGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  pauseIcon: {
    fontSize: 20,
    color: colors.primary.main,
  },
  resumeIcon: {
    fontSize: 18,
    color: colors.neutral.white,
  },
  stopIcon: {
    fontSize: 18,
    color: colors.neutral.white,
  },
  stopButton: {
    marginLeft: spacing.sm,
  },
});
