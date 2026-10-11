import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

export default function AddTodoForm({ onAddTodo, isSubmitting }) {
  const [title, setTitle] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = () => {
    // Validation: Reject empty or whitespace-only
    if (!title || !title.trim()) {
      setValidationError('Task title cannot be empty.');
      return;
    }

    setValidationError('');
    onAddTodo(title.trim(), () => {
      // Clear input on successful add
      setTitle('');
    });
  };

  const handleTextChange = (text) => {
    // Automatically capitalize the very first character when starting input
    let formattedText = text;
    if (text.length > 0 && title.length === 0) {
      formattedText = text.charAt(0).toUpperCase() + text.slice(1);
    }

    setTitle(formattedText);
    if (validationError && formattedText.trim().length > 0) {
      setValidationError('');
    }
  };

  const isButtonDisabled = isSubmitting || !title.trim();

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, !!validationError && styles.inputError]}
          placeholder="What needs to be done?"
          placeholderTextColor="#94A3B8"
          value={title}
          onChangeText={handleTextChange}
          editable={!isSubmitting}
          autoCapitalize="sentences"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
        <TouchableOpacity
          style={[styles.addButton, isButtonDisabled && styles.addButtonDisabled]}
          onPress={handleSubmit}
          disabled={isButtonDisabled}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.addButtonText}>Add</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Validation or submission error message */}
      {validationError ? (
        <Text style={styles.errorText}>{validationError}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#1E293B',
    marginRight: 10,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  addButton: {
    height: 48,
    paddingHorizontal: 20,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  addButtonDisabled: {
    backgroundColor: '#93C5FD',
    elevation: 0,
    shadowOpacity: 0,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
});
