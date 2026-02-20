import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, StyleSheet } from 'react-native';
import { TrailMapScreen } from '../screens/TrailMapScreen';
import { TrailListScreen } from '../screens/TrailListScreen';
import { TrailDetailScreen } from '../screens/TrailDetailScreen';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

// Stack navigator for Trails tab (list → detail)
const TrailsStack = createNativeStackNavigator();

const TrailsStackNavigator: React.FC = () => (
  <TrailsStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.neutral.white },
      headerTintColor: colors.primary.main,
      headerTitleStyle: typography.subheading,
    }}
  >
    <TrailsStack.Screen
      name="TrailList"
      component={TrailListScreen}
      options={{ headerShown: false }}
    />
    <TrailsStack.Screen
      name="TrailDetail"
      component={TrailDetailScreen}
      options={{ title: 'Trail Details' }}
    />
  </TrailsStack.Navigator>
);

// Bottom tab navigator
const Tab = createBottomTabNavigator();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: colors.primary.main,
          tabBarInactiveTintColor: colors.neutral.gray,
          tabBarLabelStyle: styles.tabLabel,
          tabBarItemStyle: styles.tabItem,
        }}
      >
        <Tab.Screen
          name="Map"
          component={TrailMapScreen}
          options={{
            tabBarLabel: 'Map',
            tabBarIcon: ({ color }) => (
              <Text style={[styles.tabIcon, { color }]}>🗺️</Text>
            ),
            tabBarAccessibilityLabel: 'Map tab. Record and view trails on the map.',
          }}
        />
        <Tab.Screen
          name="Trails"
          component={TrailsStackNavigator}
          options={{
            tabBarLabel: 'My Trails',
            tabBarIcon: ({ color }) => (
              <Text style={[styles.tabIcon, { color }]}>📋</Text>
            ),
            tabBarAccessibilityLabel: 'My Trails tab. View your recorded trails.',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.neutral.white,
    borderTopColor: colors.neutral.offWhite,
    borderTopWidth: 1,
    height: 80,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    elevation: 8,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  tabLabel: {
    ...typography.chip,
    fontSize: 12,
  },
  tabItem: {
    minHeight: 48,
  },
  tabIcon: {
    fontSize: 22,
  },
});
