import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import CaptureScreen from '../screens/CaptureScreen';
import TasksScreen from '../screens/TasksScreen';
import RoyaltiesScreen from '../screens/RoyaltiesScreen';
import WalletScreen from '../screens/WalletScreen';

import TaskDetailScreen from '../screens/TaskDetailScreen';
import AssetDetailScreen from '../screens/AssetDetailScreen';
import UploadMetadataScreen from '../screens/UploadMetadataScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TABS = [
  { name: 'Home',      icon: '⌂',  screen: HomeScreen      },
  { name: 'Capture',   icon: '+',   screen: CaptureScreen,  fab: true },
  { name: 'Tasks',     icon: '✓',  screen: TasksScreen     },
  { name: 'Earn',      icon: '$',   screen: RoyaltiesScreen },
  { name: 'Wallet',    icon: '◈',  screen: WalletScreen    },
];

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const tab = TABS.find((t) => t.name === route.name);
        const focused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        if (tab?.fab) {
          return (
            <TouchableOpacity key={route.key} onPress={onPress} style={styles.fabWrapper} activeOpacity={0.85}>
              <View style={[styles.fab, focused && styles.fabFocused]}>
                <Text style={styles.fabIcon}>+</Text>
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity key={route.key} onPress={onPress} style={styles.tabItem} activeOpacity={0.7}>
            <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>{tab?.icon}</Text>
            <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{route.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      {TABS.map(({ name, screen }) => (
        <Tab.Screen key={name} name={name} component={screen} />
      ))}
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="Tabs"           component={TabNavigator}        />
      <Stack.Screen name="TaskDetail"     component={TaskDetailScreen}    />
      <Stack.Screen name="AssetDetail"    component={AssetDetailScreen}   />
      <Stack.Screen name="UploadMetadata" component={UploadMetadataScreen}/>
      <Stack.Screen name="ProfileScreen"  component={ProfileScreen}       />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.tabBar,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 20,
    paddingTop: 8,
    height: 70,
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabIcon: { fontSize: 20, color: colors.textTertiary },
  tabIconFocused: { color: colors.primary },
  tabLabel: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  tabLabelFocused: { color: colors.primary },
  fabWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: -12 },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabFocused: { backgroundColor: '#00C060' },
  fabIcon: { fontSize: 28, color: colors.background, fontWeight: '300', marginTop: -2 },
});
