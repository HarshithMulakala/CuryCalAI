import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function PrimaryButton({
  children,
  onPress,
  style,
  icon,
  disabled = false,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
  icon?: React.ReactNode;
  disabled?: boolean;
}) {
  const theme = useTheme();
  return (
    <TouchableOpacity 
      onPress={disabled ? undefined : onPress} 
      style={[
        styles.btn, 
        { 
          backgroundColor: disabled ? theme.colors.muted : theme.colors.primary,
          opacity: disabled ? 0.6 : 1
        }, 
        style
      ]} 
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      activeOpacity={disabled ? 1 : 0.85}
      disabled={disabled}
    >
      <View style={styles.row}>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <Text style={[styles.text, { color: '#fff' }]}>{children}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 18,
    paddingHorizontal: 22,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  text: { fontSize: 18, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginRight: 8 },
});