import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Waypoint, waypointTypeInfo } from '../../models';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, layout } from '../../theme/spacing';

interface WaypointListProps {
  waypoints: Waypoint[];
  onWaypointPress: (waypoint: Waypoint) => void;
  onDeleteWaypoint?: (id: string) => void;
}

export const WaypointList: React.FC<WaypointListProps> = ({
  waypoints,
  onWaypointPress,
  onDeleteWaypoint,
}) => {
  if (waypoints.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No waypoints yet</Text>
        <Text style={styles.emptyHint}>
          Tap "Add Waypoint" or long-press the map to place one
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Waypoint }) => {
    const info = waypointTypeInfo[item.type];

    return (
      <TouchableOpacity
        onPress={() => onWaypointPress(item)}
        accessibilityLabel={`${info.label}${item.name ? `: ${item.name}` : ''}`}
        accessibilityHint="Double tap to center map on this waypoint"
        accessibilityRole="button"
        style={styles.item}
        activeOpacity={0.7}
      >
        {/* Type indicator */}
        <View style={[styles.iconCircle, { backgroundColor: `${info.color}20` }]}>
          <View style={[styles.iconDot, { backgroundColor: info.color }]} />
        </View>

        {/* Content */}
        <View style={styles.itemContent}>
          <Text style={styles.itemType}>{info.label}</Text>
          {item.name && (
            <Text style={styles.itemName} numberOfLines={1}>
              {item.name}
            </Text>
          )}
          {item.accessibilityNote && (
            <Text style={styles.itemNote} numberOfLines={1}>
              ♿ {item.accessibilityNote}
            </Text>
          )}
        </View>

        {/* Delete button */}
        {onDeleteWaypoint && (
          <TouchableOpacity
            onPress={() => onDeleteWaypoint(item.id)}
            accessibilityLabel={`Delete ${info.label} waypoint`}
            accessibilityRole="button"
            style={styles.deleteButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.deleteIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={waypoints}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      accessibilityRole="list"
      accessibilityLabel={`${waypoints.length} waypoint${waypoints.length !== 1 ? 's' : ''}`}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.offWhite,
    minHeight: layout.minTouchTarget,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  itemContent: {
    flex: 1,
  },
  itemType: {
    ...typography.statLabel,
    fontSize: 11,
  },
  itemName: {
    ...typography.bodyBold,
    fontSize: 15,
    marginTop: spacing.xxs,
  },
  itemNote: {
    ...typography.caption,
    fontSize: 12,
    marginTop: spacing.xxs,
    color: colors.primary.main,
  },
  deleteButton: {
    width: layout.minTouchTarget,
    height: layout.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    fontSize: 16,
    color: colors.neutral.gray,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xxl,
  },
  emptyText: {
    ...typography.bodyBold,
    color: colors.neutral.gray,
  },
  emptyHint: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
