import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '@/constants/theme';

interface GradientBackgroundProps {
  children: ReactNode;
  variant?: 'primary' | 'purple' | 'blue' | 'success' | 'card' | 'overlay';
  style?: ViewStyle;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({ 
  children, 
  variant = 'primary',
  style 
}) => {
  const gradient = gradients[variant];
  
  return (
    <LinearGradient
      colors={gradient.colors}
      start={gradient.start}
      end={gradient.end}
      style={[styles.container, style]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

