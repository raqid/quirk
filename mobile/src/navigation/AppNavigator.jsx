import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '../utils/icons';

import HomeScreen from '../screens/HomeScreen';
import CaptureScreen from '../screens/CaptureScreen';
import TasksScreen from '../screens/TasksScreen';
import RoyaltiesScreen from '../screens/RoyaltiesScreen';
import WalletScreen from '../screens/WalletScreen';

import TaskDetailScreen     from '../screens/TaskDetailScreen';
import AssetDetailScreen    from '../screens/AssetDetailScreen';
import UploadMetadataScreen from '../screens/UploadMetadataScreen';
import ProfileScreen        from '../screens/ProfileScreen';
import NotificationsScreen  from '../screens/NotificationsScreen';
import LeaderboardScreen    from '../screens/LeaderboardScreen';
import SettingsScreen       from '../screens/SettingsScreen';

import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TABS = [
  { name: 'Home',    iconName: 'home',        screen: HomeScreen      },
  { name: 'Tasks',   iconName: 'checkSquare',  screen: TasksScreen     },
  { name: 'Capture', iconName: 'plus',         screen: CaptureScreen   },
  { name: 'Earn',    iconName: 'coins',        screen: RoyaltiesScreen },
  { name: 'Wallet',  iconName: 'wallet',       screen: WalletScreen    },
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

        return (
          <TouchableOpacity key={route.key} onPress={onPress} style={styles.tabItem} activeOpacity={0.7}>
            <Icon
              name={tab?.iconName}
              size={20}
              color={focused ? colors.primary : colors.textTertiary}
            />
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
      <Stack.Screen name="Notifications"  component={NotificationsScreen} />
      <Stack.Screen name="Leaderboard"    component={LeaderboardScreen}   />
      <Stack.Screen name="Settings"       component={SettingsScreen}      />
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
  tabLabel: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  tabLabelFocused: { color: colors.primary },
});
