import React from 'react';
import { IconType } from 'react-icons';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import { colors } from '@/constants/theme';

// For React Native, we'll use a wrapper that can work with react-icons
// Since react-icons doesn't work directly in RN, we'll create a bridge
// For now, we'll use @expo/vector-icons which is already installed

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

// This is a placeholder - in production you'd map react-icons to Expo icons
// For now, we'll create a simple icon component
export const Icon: React.FC<IconProps> = ({ name, size = 24, color = colors.text, style }) => {
  // Map common icon names to Expo icons
  // In the web version, we'll use react-icons directly
  return null; // Will be implemented with proper icon mapping
};

