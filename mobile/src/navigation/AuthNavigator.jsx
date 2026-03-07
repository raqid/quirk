import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../theme/colors';
import OnboardingWelcome from '../screens/OnboardingWelcome';
import OnboardingSignup from '../screens/OnboardingSignup';
import OnboardingVerify from '../screens/OnboardingVerify';
import OnboardingProfile from '../screens/OnboardingProfile';
import OnboardingTutorial from '../screens/OnboardingTutorial';
import LoginScreen from '../screens/LoginScreen';

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="Welcome"  component={OnboardingWelcome}  />
      <Stack.Screen name="Signup"   component={OnboardingSignup}   />
      <Stack.Screen name="Verify"   component={OnboardingVerify}   />
      <Stack.Screen name="Profile"  component={OnboardingProfile}  />
      <Stack.Screen name="Tutorial" component={OnboardingTutorial} />
      <Stack.Screen name="Login"    component={LoginScreen}        />
    </Stack.Navigator>
  );
}
