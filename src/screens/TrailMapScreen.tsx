import React, { useEffect, useCallback, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  TouchableOpacity,
  AccessibilityInfo,
} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { TrailMap } from '../components/map';
import { RecordingControls, RecordingStats } from '../components/recording';
import { TrailInfoSheet, TrailInfoData } from '../components/trail-info';
import { WaypointSheet } from '../components/waypoints';
import { useTrailRecording } from '../hooks/useTrailRecording';
import { useLocation } from '../hooks/useLocation';
import { Waypoint } from '../models';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface TrailMapScreenProps {
  navigation: any;
}

export const TrailMapScreen: React.FC<TrailMapScreenProps> = ({ navigation }) => {
  const {
    session,
    coordinates,
    waypoints,
    elapsedSeconds,
    distanceMeters,
    elevationGainMeters,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    addCoordinate,
    addWaypoint,
    deleteWaypoint,
    finalizeTrail,
    reset,
  } = useTrailRecording();

  const isActive = session.state === 'recording' || session.state === 'paused';

  const { currentLocation, error: locationError, requestPermission } = useLocation({
    tracking: session.state === 'recording',
    distanceFilter: 5,
    interval: 3000,
  });

  // Waypoint sheet state
  const [waypointSheetVisible, setWaypointSheetVisible] = useState(false);
  const [waypointCoordinate, setWaypointCoordinate] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Trail info sheet (shown when recording stops)
  const [trailInfoVisible, setTrailInfoVisible] = useState(false);

  // Camera ref for centering on waypoints
  const cameraRef = useRef<MapboxGL.Camera>(null);

  // Request location permission on mount
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  // Record GPS coordinates during active recording
  useEffect(() => {
    if (session.state === 'recording' && currentLocation) {
      addCoordinate(currentLocation);
    }
  }, [session.state, currentLocation, addCoordinate]);

  // --- Handlers ---

  const handleStart = useCallback(() => {
    if (locationError) {
      Alert.alert(
        'Location Required',
        'GPS access is needed to record trails. Please enable location permissions in your device settings.',
        [{ text: 'OK' }]
      );
      return;
    }
    startRecording();
  }, [startRecording, locationError]);

  const handlePause = useCallback(() => {
    pauseRecording();
  }, [pauseRecording]);

  const handleResume = useCallback(() => {
    resumeRecording();
  }, [resumeRecording]);

  const handleStop = useCallback(() => {
    Alert.alert(
      'Finish Recording?',
      'This will stop recording and let you save the trail.',
      [
        { text: 'Continue Recording', style: 'cancel' },
        {
          text: 'Finish',
          onPress: () => {
            stopRecording();
            setTrailInfoVisible(true);
          },
        },
      ]
    );
  }, [stopRecording]);

  const handleAddWaypoint = useCallback(() => {
    if (currentLocation) {
      setWaypointCoordinate({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
    }
    setWaypointSheetVisible(true);
  }, [currentLocation]);

  const handleMapLongPress = useCallback(
    (coord: { latitude: number; longitude: number }) => {
      if (isActive) {
        setWaypointCoordinate(coord);
        setWaypointSheetVisible(true);
      }
    },
    [isActive]
  );

  const handleSaveWaypoint = useCallback(
    (wp: Omit<Waypoint, 'id' | 'createdAt'>) => {
      addWaypoint(wp);
      setWaypointSheetVisible(false);
    },
    [addWaypoint]
  );

  const handleWaypointPress = useCallback(
    (waypoint: Waypoint) => {
      if (cameraRef.current) {
        cameraRef.current.setCamera({
          centerCoordinate: [waypoint.longitude, waypoint.latitude],
          zoomLevel: 17,
          animationDuration: 600,
        });
        AccessibilityInfo.announceForAccessibility(
          `Centered on ${waypoint.name || waypoint.type} waypoint`
        );
      }
    },
    []
  );

  const handleSaveTrail = useCallback(
    (info: TrailInfoData) => {
      const trail = finalizeTrail(info);
      setTrailInfoVisible(false);
      reset();
      Alert.alert(
        'Trail Saved',
        `"${trail.name}" has been saved with ${trail.waypoints.length} waypoint${trail.waypoints.length !== 1 ? 's' : ''}.`
      );
    },
    [finalizeTrail, reset]
  );

  const handleRetryPermission = useCallback(async () => {
    const granted = await requestPermission();
    if (granted) {
      AccessibilityInfo.announceForAccessibility('Location access granted');
    }
  }, [requestPermission]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Full-screen map */}
      <TrailMap
        coordinates={coordinates}
        waypoints={waypoints}
        recordingState={session.state}
        userLocation={
          currentLocation
            ? { latitude: currentLocation.latitude, longitude: currentLocation.longitude }
            : undefined
        }
        onLongPress={handleMapLongPress}
        onWaypointPress={handleWaypointPress}
        cameraRef={cameraRef}
      />

      {/* Location error banner */}
      {locationError && (
        <View style={styles.errorBanner} accessibilityRole="alert">
          <Text style={styles.errorText}>
            Location unavailable — GPS access is needed to record trails
          </Text>
          <TouchableOpacity
            onPress={handleRetryPermission}
            accessibilityLabel="Retry location access"
            accessibilityHint="Requests GPS permission again"
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom panel: stats + controls */}
      <View style={styles.bottomPanel} pointerEvents="box-none">
        {/* Live recording stats */}
        {isActive && (
          <RecordingStats
            distanceMeters={distanceMeters}
            durationSeconds={elapsedSeconds}
            elevationGainMeters={elevationGainMeters}
            isRecording={session.state === 'recording'}
          />
        )}

        {/* Recording controls */}
        <View style={styles.controlsContainer}>
          <RecordingControls
            recordingState={session.state}
            onStart={handleStart}
            onPause={handlePause}
            onResume={handleResume}
            onStop={handleStop}
            onAddWaypoint={handleAddWaypoint}
          />
        </View>
      </View>

      {/* Waypoint creation sheet */}
      <WaypointSheet
        visible={waypointSheetVisible}
        onClose={() => setWaypointSheetVisible(false)}
        onSave={handleSaveWaypoint}
        coordinate={waypointCoordinate}
      />

      {/* Trail info sheet (after recording) */}
      <TrailInfoSheet
        visible={trailInfoVisible}
        onClose={() => setTrailInfoVisible(false)}
        onSave={handleSaveTrail}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  errorBanner: {
    position: 'absolute',
    top: 48,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.semantic.errorLight,
    borderWidth: 1,
    borderColor: colors.semantic.error,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    elevation: 6,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  errorText: {
    ...typography.caption,
    color: colors.semantic.error,
    flex: 1,
    fontSize: 14,
  },
  retryButton: {
    marginLeft: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.semantic.error,
    borderRadius: 8,
    minWidth: 48,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: {
    ...typography.button,
    fontSize: 13,
    color: colors.neutral.white,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 90, // Space for tab bar
  },
  controlsContainer: {
    backgroundColor: colors.overlay.light,
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 16,
    elevation: 6,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});
