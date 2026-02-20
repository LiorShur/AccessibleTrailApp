import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { BottomSheet } from '../common/BottomSheet';
import { Button } from '../common/Button';
import { Chip } from '../common/Chip';
import { WaypointType, waypointTypeInfo, Waypoint } from '../../models';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, layout } from '../../theme/spacing';

interface WaypointSheetProps {
  visible: boolean;
  onClose: () => void;
  onSave: (waypoint: Omit<Waypoint, 'id' | 'createdAt'>) => void;
  /** The GPS coordinates where the waypoint will be placed */
  coordinate: { latitude: number; longitude: number } | null;
}

const categories = [
  { key: 'amenity' as const, label: 'Amenities' },
  { key: 'caution' as const, label: 'Caution' },
  { key: 'navigation' as const, label: 'Navigation' },
  { key: 'interest' as const, label: 'Points of Interest' },
];

const allTypes = Object.entries(waypointTypeInfo) as [WaypointType, typeof waypointTypeInfo[WaypointType]][];

export const WaypointSheet: React.FC<WaypointSheetProps> = ({
  visible,
  onClose,
  onSave,
  coordinate,
}) => {
  const [selectedType, setSelectedType] = React.useState<WaypointType | null>(null);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [accessibilityNote, setAccessibilityNote] = React.useState('');

  const handleSave = () => {
    if (!selectedType || !coordinate) return;
    onSave({
      type: selectedType,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      name: name.trim() || undefined,
      description: description.trim() || undefined,
      accessibilityNote: accessibilityNote.trim() || undefined,
    });
    // Reset form
    setSelectedType(null);
    setName('');
    setDescription('');
    setAccessibilityNote('');
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} heightFraction={0.7}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[typography.heading, styles.title]} accessibilityRole="header">
          Add Waypoint
        </Text>

        {/* Waypoint type selector, grouped by category */}
        {categories.map((category) => {
          const typesInCategory = allTypes.filter(
            ([, info]) => info.category === category.key
          );

          return (
            <View key={category.key} style={styles.categorySection}>
              <Text style={styles.categoryLabel}>{category.label}</Text>
              <View style={styles.typeGrid}>
                {typesInCategory.map(([type, info]) => (
                  <Chip
                    key={type}
                    label={info.label}
                    selected={selectedType === type}
                    onPress={() => setSelectedType(type)}
                    color={info.color}
                    accessibilityHint={`Select ${info.label} waypoint type`}
                    style={styles.typeChip}
                  />
                ))}
              </View>
            </View>
          );
        })}

        {/* Name (optional) */}
        <Text style={styles.fieldLabel}>Name (optional)</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Oak tree bench"
          placeholderTextColor={colors.neutral.gray}
          style={styles.textInput}
          accessibilityLabel="Waypoint name"
          maxLength={60}
        />

        {/* Description (optional) */}
        <Text style={styles.fieldLabel}>Notes (optional)</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Any helpful details about this spot..."
          placeholderTextColor={colors.neutral.gray}
          style={[styles.textInput, styles.textArea]}
          accessibilityLabel="Waypoint notes"
          multiline
          numberOfLines={2}
          maxLength={200}
        />

        {/* Accessibility note */}
        <Text style={styles.fieldLabel}>Accessibility Note (optional)</Text>
        <TextInput
          value={accessibilityNote}
          onChangeText={setAccessibilityNote}
          placeholder="e.g. Bench has armrests, path narrows here..."
          placeholderTextColor={colors.neutral.gray}
          style={[styles.textInput, styles.textArea]}
          accessibilityLabel="Accessibility note for this waypoint"
          accessibilityHint="Describe any accessibility-relevant information about this location"
          multiline
          numberOfLines={2}
          maxLength={200}
        />

        {/* Actions */}
        <View style={styles.actions}>
          <Button label="Cancel" onPress={onClose} variant="ghost" />
          <Button
            label="Add Waypoint"
            onPress={handleSave}
            variant="primary"
            disabled={!selectedType}
            accessibilityHint={
              selectedType
                ? 'Adds this waypoint to the trail'
                : 'Select a waypoint type first'
            }
          />
        </View>
      </ScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: spacing.md,
  },
  categorySection: {
    marginBottom: spacing.lg,
  },
  categoryLabel: {
    ...typography.statLabel,
    marginBottom: spacing.sm,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  typeChip: {
    marginBottom: spacing.xxs,
  },
  fieldLabel: {
    ...typography.bodyBold,
    fontSize: 14,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: colors.neutral.lightGray,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.neutral.black,
    backgroundColor: colors.neutral.white,
    minHeight: 48,
  },
  textArea: {
    minHeight: 64,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },
});
