import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { isNetworkError } from '../utils/network';

function getFriendlyErrorMessage(rawError) {
  if (!rawError || isNetworkError(rawError)) {
    return 'Cannot fetch tasks. Please check your internet connection and try again.';
  }

  const message = typeof rawError === 'string' ? rawError : rawError.message || '';
  const lower = message.toLowerCase();

  if (lower.includes('timeout') || lower.includes('timed out')) {
    return 'The server took too long to respond. Please try again in a few moments.';
  }

  if (lower.includes('500') || lower.includes('502') || lower.includes('503') || lower.includes('504')) {
    return 'The server is currently unavailable. Please try again shortly.';
  }

  if (lower.includes('404')) {
    return 'The requested tasks could not be found.';
  }

  return message || 'Cannot fetch tasks from the server. Please try again.';
}

export default function ErrorState({ error, onRetry }) {
  const friendlyMessage = getFriendlyErrorMessage(error);

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>Unable to Load Tasks</Text>
      <Text style={styles.message}>{friendlyMessage}</Text>

      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.7}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 20,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#991B1B',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#B91C1C',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
});
