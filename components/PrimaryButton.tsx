import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function PrimaryButton({
  children,
  onPress,
  style,
  icon,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
  icon?: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={[styles.btn, { backgroundColor: theme.colors.primary }, style]} activeOpacity={0.85}>
      <View style={styles.row}>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <Text style={[styles.text, { color: '#fff' }]}>{children}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  text: { fontSize: 16, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginRight: 8 },
});