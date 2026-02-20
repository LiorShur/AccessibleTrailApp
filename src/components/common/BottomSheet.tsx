import React from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  TouchableWithoutFeedback,
  AccessibilityInfo,
  Platform,
} from 'react-native';
import { colors } from '../../theme/colors';
import { layout, spacing } from '../../theme/spacing';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Height as fraction of screen (0.0 - 1.0). Default 0.5 */
  heightFraction?: number;
  /** If true, sheet cannot be dismissed by swiping or tapping scrim */
  persistent?: boolean;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  children,
  heightFraction = 0.5,
  persistent = false,
}) => {
  const sheetHeight = SCREEN_HEIGHT * heightFraction;
  const translateY = React.useRef(new Animated.Value(sheetHeight)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }).start();
      // Announce to screen readers
      AccessibilityInfo.announceForAccessibility('Sheet opened');
    } else {
      Animated.timing(translateY, {
        toValue: sheetHeight,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, sheetHeight, translateY]);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !persistent,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        !persistent && gestureState.dy > 10,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // If swiped down more than 30% of sheet height, dismiss
        if (gestureState.dy > sheetHeight * 0.3) {
          onClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 20,
            stiffness: 200,
          }).start();
        }
      },
    })
  ).current;

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      {/* Scrim */}
      <TouchableWithoutFeedback
        onPress={persistent ? undefined : onClose}
        accessibilityLabel="Close sheet"
        accessibilityRole="button"
      >
        <View style={styles.scrim} />
      </TouchableWithoutFeedback>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          { height: sheetHeight, transform: [{ translateY }] },
        ]}
        accessibilityViewIsModal
        accessibilityRole="none"
        {...panResponder.panHandlers}
      >
        {/* Drag handle */}
        <View style={styles.handleContainer} accessibilityLabel="Drag to dismiss">
          <View style={styles.handle} />
        </View>

        {/* Content */}
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay.scrim,
  },
  sheet: {
    backgroundColor: colors.neutral.white,
    borderTopLeftRadius: layout.bottomSheet.borderRadius,
    borderTopRightRadius: layout.bottomSheet.borderRadius,
    // Elevation
    elevation: 16,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  handle: {
    width: layout.bottomSheet.handleWidth,
    height: layout.bottomSheet.handleHeight,
    borderRadius: layout.bottomSheet.handleHeight / 2,
    backgroundColor: colors.neutral.lightGray,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? spacing.xxxl : spacing.lg,
  },
});
