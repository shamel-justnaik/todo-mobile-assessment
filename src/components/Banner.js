import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * Dismissible inline notification banner.
 * variant: 'warning' (amber, used for sync/refresh) | 'danger' (red, used for form actions)
 */
export default function Banner({ title, message, variant = 'danger', onDismiss }) {
  const theme = themes[variant];

  return (
    <View style={[styles.container, theme.container]}>
      <View style={styles.content}>
        <Text style={[styles.title, theme.title]}>{title}</Text>
        <Text style={[styles.message, theme.message]}>{message}</Text>
      </View>
      {onDismiss && (
        <TouchableOpacity
          onPress={onDismiss}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={`Dismiss notification: ${title}`}
        >
          <Text style={[styles.dismiss, theme.title]}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
  },
  dismiss: {
    fontSize: 15,
    paddingHorizontal: 6,
  },
});

const themes = {
  warning: StyleSheet.create({
    container: { backgroundColor: '#FFFBEB', borderColor: '#FCD34D' },
    title: { color: '#92400E' },
    message: { color: '#B45309' },
  }),
  danger: StyleSheet.create({
    container: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
    title: { color: '#991B1B' },
    message: { color: '#DC2626' },
  }),
};
