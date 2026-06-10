import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { HomeScreen } from '../screens/HomeScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { MapScreen } from '../screens/MapScreen';
import { AnalysisScreen } from '../screens/AnalysisScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

import { colors, gradients } from '../theme/colors';
import { TabButton } from '../components/UIComponents';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Home Stack Navigator
const HomeStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: colors.background },
    }}
  >
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
    <Stack.Screen name="Map" component={MapScreen} />
    <Stack.Screen name="Analysis" component={AnalysisScreen} />
  </Stack.Navigator>
);

// Dashboard Stack Navigator
const DashboardStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: colors.background },
    }}
  >
    <Stack.Screen name="DashboardMain" component={DashboardScreen} />
    <Stack.Screen name="AnalysisDetail" component={AnalysisScreen} />
  </Stack.Navigator>
);

// Map Stack Navigator
const MapStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: colors.background },
    }}
  >
    <Stack.Screen name="MapMain" component={MapScreen} />
    <Stack.Screen name="AnalysisFromMap" component={AnalysisScreen} />
  </Stack.Navigator>
);

// Custom Tab Bar
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const tabs = [
    { name: 'HomeStack', icon: '🏠', label: 'Home' },
    { name: 'DashboardStack', icon: '📊', label: 'Dashboard' },
    { name: 'MapStack', icon: '🗺️', label: 'Map' },
    { name: 'Settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <LinearGradient
      colors={[colors.surface, colors.surfaceLight]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.tabBar}
    >
      <View style={styles.tabBarContent}>
        {tabs.map((tab, index) => {
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: tab.name,
              preventDefault: () => {},
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(tab.name);
            }
          };

          return (
            <TabButton
              key={tab.name}
              icon={tab.icon}
              label={tab.label}
              active={isFocused}
              onPress={onPress}
              color={
                isFocused
                  ? colors.blue
                  : colors.textSecondary
              }
            />
          );
        })}
      </View>
    </LinearGradient>
  );
};

// Main Tab Navigator
export const RootNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{
      headerShown: false,
      tabBarHideOnKeyboard: true,
    }}
  >
    <Tab.Screen name="HomeStack" component={HomeStackNavigator} />
    <Tab.Screen name="DashboardStack" component={DashboardStackNavigator} />
    <Tab.Screen name="MapStack" component={MapStackNavigator} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <RootNavigator />
  </NavigationContainer>
);

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: colors.surfaceLight,
    elevation: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: colors.surface,
  },
  tabBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
