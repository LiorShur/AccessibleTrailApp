import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { Waypoint, waypointTypeInfo } from '../../models';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface WaypointMarkerProps {
  waypoint: Waypoint;
  onPress?: () => void;
}

export const WaypointMarker: React.FC<WaypointMarkerProps> = ({
  waypoint,
  onPress,
}) => {
  const info = waypointTypeInfo[waypoint.type];
  const markerColor = info.color;

  return (
    <MapboxGL.MarkerView
      id={waypoint.id}
      coordinate={[waypoint.longitude, waypoint.latitude]}
    >
      <View
        style={styles.container}
        accessible
        accessibilityLabel={`${info.label} waypoint${waypoint.name ? `: ${waypoint.name}` : ''}`}
        accessibilityHint="Double tap to view details"
        accessibilityRole="button"
        onTouchEnd={onPress}
      >
        {/* Pin shape */}
        <View style={[styles.pin, { backgroundColor: markerColor }]}>
          <Text style={styles.icon}>{getMarkerEmoji(waypoint.type)}</Text>
        </View>
        {/* Pin tail */}
        <View style={[styles.pinTail, { borderTopColor: markerColor }]} />

        {/* Label below marker */}
        {waypoint.name && (
          <View style={styles.labelContainer}>
            <Text style={styles.label} numberOfLines={1}>
              {waypoint.name}
            </Text>
          </View>
        )}
      </View>
    </MapboxGL.MarkerView>
  );
};

/** Simple text-based icons (replace with SVG icon library in production). */
function getMarkerEmoji(type: Waypoint['type']): string {
  const map: Record<string, string> = {
    rest_area: '🪑',
    scenic_viewpoint: '👀',
    water_source: '💧',
    restroom: '🚻',
    parking: '🅿️',
    trailhead: '🚩',
    obstacle: '⚠️',
    hazard: '🔺',
    surface_change: '↔️',
    steep_section: '📐',
    intersection: '🔀',
    information: 'ℹ️',
    photo_spot: '📷',
    custom: '📍',
  };
  return map[type] || '📍';
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  pin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: colors.neutral.white,
    // Shadow
    elevation: 4,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  icon: {
    fontSize: 16,
  },
  pinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -2,
  },
  labelContainer: {
    backgroundColor: colors.overlay.light,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
    maxWidth: 100,
  },
  label: {
    ...typography.caption,
    fontSize: 11,
    textAlign: 'center',
    color: colors.neutral.black,
  },
});
