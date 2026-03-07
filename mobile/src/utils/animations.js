import { Animated } from 'react-native';

export function createFadeInUp(animatedValue, delay = 0) {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration: 800,
    delay,
    useNativeDriver: true,
  });
}

export function createQuickTransition(animatedValue, toValue) {
  return Animated.timing(animatedValue, {
    toValue,
    duration: 200,
    useNativeDriver: true,
  });
}

export function getFadeInUpStyle(animatedValue) {
  return {
    opacity: animatedValue,
    transform: [{
      translateY: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [10, 0],
      }),
    }],
  };
}
