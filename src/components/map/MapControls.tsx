import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton } from '../common/IconButton';
import { colors } from '../../theme/colors';
import { spacing, layout } from '../../theme/spacing';

interface MapControlsProps {
  onRecenter: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onRecenter,
  onZoomIn,
  onZoomOut,
}) => {
  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Recenter button */}
      <IconButton
        onPress={onRecenter}
        accessibilityLabel="Center map on my location"
        accessibilityHint="Moves the map to show your current position"
        size={layout.mapControlSize}
        variant="ghost"
        style={styles.controlButton}
      >
        <Text style={styles.icon}>◎</Text>
      </IconButton>

      {/* Zoom controls */}
      <View style={styles.zoomGroup}>
        <IconButton
          onPress={onZoomIn}
          accessibilityLabel="Zoom in"
          size={layout.mapControlSize}
          variant="ghost"
          style={[styles.controlButton, styles.zoomTop]}
        >
          <Text style={styles.zoomIcon}>+</Text>
        </IconButton>

        <View style={styles.zoomDivider} />

        <IconButton
          onPress={onZoomOut}
          accessibilityLabel="Zoom out"
          size={layout.mapControlSize}
          variant="ghost"
          style={[styles.controlButton, styles.zoomBottom]}
        >
          <Text style={styles.zoomIcon}>−</Text>
        </IconButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: spacing.lg,
    top: 120,
    alignItems: 'center',
    gap: spacing.sm,
  },
  controlButton: {
    backgroundColor: colors.neutral.white,
    elevation: 4,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  icon: {
    fontSize: 22,
    color: colors.primary.main,
  },
  zoomGroup: {
    borderRadius: layout.borderRadius.md,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  zoomTop: {
    borderRadius: 0,
    borderTopLeftRadius: layout.borderRadius.md,
    borderTopRightRadius: layout.borderRadius.md,
    elevation: 0,
    shadowOpacity: 0,
  },
  zoomBottom: {
    borderRadius: 0,
    borderBottomLeftRadius: layout.borderRadius.md,
    borderBottomRightRadius: layout.borderRadius.md,
    elevation: 0,
    shadowOpacity: 0,
  },
  zoomDivider: {
    height: 1,
    backgroundColor: colors.neutral.lightGray,
  },
  zoomIcon: {
    fontSize: 24,
    fontWeight: '300',
    color: colors.neutral.darkGray,
  },
});
