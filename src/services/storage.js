import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@todos_cache_key';

/**
 * Save todo list to local device storage
 */
export async function saveTodosToStorage(todos) {
  try {
    const jsonValue = JSON.stringify(todos);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save todos to AsyncStorage:', e);
  }
}

/**
 * Retrieve saved todos from local storage
 * Returns null if no cached data is found
 */
export async function getTodosFromStorage() {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Failed to load todos from AsyncStorage:', e);
    return null;
  }
}

/**
 * Clear local storage (useful for testing or resetting)
 */
export async function clearTodosStorage() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear AsyncStorage:', e);
  }
}
