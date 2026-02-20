import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { BottomSheet } from '../common/BottomSheet';
import { Button } from '../common/Button';
import { AccessibilityTags } from './AccessibilityTags';
import { SurfaceTypePicker } from './SurfaceTypePicker';
import { DifficultyRating } from './DifficultyRating';
import { Trail } from '../../models';
import { AccessibilityFeature, DifficultyLevel, SurfaceType } from '../../models';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface TrailInfoSheetProps {
  visible: boolean;
  onClose: () => void;
  onSave: (info: TrailInfoData) => void;
  initialData?: Partial<Trail>;
}

export interface TrailInfoData {
  name: string;
  description: string;
  difficulty: DifficultyLevel;
  surfaceType: SurfaceType;
  accessibilityFeatures: AccessibilityFeature[];
}

export const TrailInfoSheet: React.FC<TrailInfoSheetProps> = ({
  visible,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = React.useState(initialData?.name || '');
  const [description, setDescription] = React.useState(initialData?.description || '');
  const [difficulty, setDifficulty] = React.useState<DifficultyLevel | undefined>(
    initialData?.difficulty
  );
  const [surfaceType, setSurfaceType] = React.useState<SurfaceType | undefined>(
    initialData?.surfaceType
  );
  const [accessibilityFeatures, setAccessibilityFeatures] = React.useState<
    AccessibilityFeature[]
  >(initialData?.accessibilityFeatures || []);

  const toggleFeature = (feature: AccessibilityFeature) => {
    setAccessibilityFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const handleSave = () => {
    if (!name.trim() || !difficulty || !surfaceType) return;
    onSave({
      name: name.trim(),
      description: description.trim(),
      difficulty,
      surfaceType,
      accessibilityFeatures,
    });
  };

  const isValid = name.trim().length > 0 && difficulty && surfaceType;

  return (
    <BottomSheet visible={visible} onClose={onClose} heightFraction={0.85}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[typography.heading, styles.title]} accessibilityRole="header">
          Trail Details
        </Text>

        {/* Trail name */}
        <Text style={styles.label}>Trail Name *</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Lakeside Loop"
          placeholderTextColor={colors.neutral.gray}
          style={styles.textInput}
          accessibilityLabel="Trail name"
          accessibilityHint="Enter a name for this trail"
          maxLength={100}
        />

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the trail, notable features, and conditions..."
          placeholderTextColor={colors.neutral.gray}
          style={[styles.textInput, styles.textArea]}
          accessibilityLabel="Trail description"
          multiline
          numberOfLines={3}
          maxLength={500}
        />

        {/* Difficulty */}
        <DifficultyRating selected={difficulty} onSelect={setDifficulty} />

        {/* Surface type */}
        <SurfaceTypePicker selected={surfaceType} onSelect={setSurfaceType} />

        {/* Accessibility features */}
        <AccessibilityTags
          selected={accessibilityFeatures}
          onToggle={toggleFeature}
        />

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            label="Cancel"
            onPress={onClose}
            variant="ghost"
            style={styles.cancelButton}
          />
          <Button
            label="Save Trail"
            onPress={handleSave}
            variant="primary"
            disabled={!isValid}
            accessibilityHint={
              isValid
                ? 'Saves the trail with the entered details'
                : 'Fill in trail name, difficulty, and surface type to save'
            }
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.bodyBold,
    fontSize: 14,
    marginTop: spacing.lg,
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
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },
  cancelButton: {
    minWidth: 80,
  },
  saveButton: {
    minWidth: 140,
  },
});
