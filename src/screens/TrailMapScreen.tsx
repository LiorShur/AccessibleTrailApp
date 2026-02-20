import React, { useEffect, useCallback, useState } from 'react';
import { View, StyleSheet, StatusBar, Alert } from 'react-native';
import { TrailMap } from '../components/map';
import { RecordingControls, RecordingStats } from '../components/recording';
import { TrailInfoSheet, TrailInfoData } from '../components/trail-info';
import { WaypointSheet } from '../components/waypoints';
import { useTrailRecording } from '../hooks/useTrailRecording';
import { useLocation } from '../hooks/useLocation';
import { Waypoint } from '../models';
import { colors } from '../theme/colors';

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

  const { currentLocation, requestPermission } = useLocation({
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
    startRecording();
  }, [startRecording]);

  const handlePause = useCallback(() => {
    pauseRecording();
  }, [pauseRecording]);

  const handleResume = useCallback(() => {
    resumeRecording();
  }, [resumeRecording]);

  const handleStop = useCallback(() => {
    // Confirm before stopping
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
    (_waypoint: Waypoint) => {
      // Could center map on waypoint or show detail
    },
    []
  );

  const handleSaveTrail = useCallback(
    (info: TrailInfoData) => {
      const trail = finalizeTrail(info);
      setTrailInfoVisible(false);
      reset();
      // Navigate to trail detail or show success
      Alert.alert(
        'Trail Saved',
        `"${trail.name}" has been saved with ${trail.waypoints.length} waypoint${trail.waypoints.length !== 1 ? 's' : ''}.`
      );
    },
    [finalizeTrail, reset]
  );

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
      />

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
