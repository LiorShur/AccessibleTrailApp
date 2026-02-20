import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { colors } from '../../theme/colors';
import { TrailCoordinate, RecordingState } from '../../models';
import { TrailPath } from './TrailPath';
import { WaypointMarker } from './WaypointMarker';
import { MapControls } from './MapControls';
import { Waypoint } from '../../models';

interface TrailMapProps {
  /** Trail coordinates to render as a path */
  coordinates: TrailCoordinate[];
  /** Waypoints to show on the map */
  waypoints: Waypoint[];
  /** Current recording state — changes trail line color */
  recordingState: RecordingState;
  /** Current user location */
  userLocation?: { latitude: number; longitude: number };
  /** Called when user long-presses the map to add a waypoint */
  onLongPress?: (coordinate: { latitude: number; longitude: number }) => void;
  /** Called when a waypoint marker is tapped */
  onWaypointPress?: (waypoint: Waypoint) => void;
  /** Camera ref for external control */
  cameraRef?: React.RefObject<MapboxGL.Camera>;
}

export const TrailMap: React.FC<TrailMapProps> = ({
  coordinates,
  waypoints,
  recordingState,
  userLocation,
  onLongPress,
  onWaypointPress,
  cameraRef,
}) => {
  const mapRef = React.useRef<MapboxGL.MapView>(null);
  const internalCameraRef = React.useRef<MapboxGL.Camera>(null);
  const camera = cameraRef || internalCameraRef;

  const handleLongPress = (event: any) => {
    if (onLongPress) {
      const { geometry } = event;
      onLongPress({
        latitude: geometry.coordinates[1],
        longitude: geometry.coordinates[0],
      });
    }
  };

  const handleRecenter = () => {
    if (userLocation && camera.current) {
      camera.current.setCamera({
        centerCoordinate: [userLocation.longitude, userLocation.latitude],
        zoomLevel: 16,
        animationDuration: 500,
      });
    }
  };

  const handleZoomIn = () => {
    // Mapbox handles zoom via camera
    if (camera.current) {
      camera.current.zoomTo(17, 300);
    }
  };

  const handleZoomOut = () => {
    if (camera.current) {
      camera.current.zoomTo(14, 300);
    }
  };

  return (
    <View
      style={styles.container}
      accessibilityLabel="Trail map"
      accessibilityRole="image"
    >
      <MapboxGL.MapView
        ref={mapRef}
        style={styles.map}
        styleURL={MapboxGL.StyleURL.Outdoors}
        onLongPress={handleLongPress}
        compassEnabled
        compassViewPosition={0} // Top-left
        logoEnabled={false}
        attributionPosition={{ bottom: 8, left: 8 }}
      >
        <MapboxGL.Camera
          ref={camera}
          zoomLevel={15}
          centerCoordinate={
            userLocation
              ? [userLocation.longitude, userLocation.latitude]
              : [-122.4194, 37.7749] // Default: San Francisco
          }
          animationMode="flyTo"
          animationDuration={1000}
        />

        {/* User location indicator */}
        <MapboxGL.UserLocation
          visible
          showsUserHeadingIndicator
          androidRenderMode="compass"
        />

        {/* Trail path line */}
        {coordinates.length >= 2 && (
          <TrailPath
            coordinates={coordinates}
            isRecording={recordingState === 'recording'}
          />
        )}

        {/* Waypoint markers */}
        {waypoints.map((wp) => (
          <WaypointMarker
            key={wp.id}
            waypoint={wp}
            onPress={() => onWaypointPress?.(wp)}
          />
        ))}
      </MapboxGL.MapView>

      {/* Map control buttons (zoom, recenter) */}
      <MapControls
        onRecenter={handleRecenter}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
