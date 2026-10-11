import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { getTodos, createTodo } from './src/services/api';
import {
  getTodosFromStorage,
  saveTodosToStorage,
} from './src/services/storage';
import { isNetworkError } from './src/utils/network';
import TodoItem from './src/components/TodoItem';
import AddTodoForm from './src/components/AddTodoForm';
import LoadingState from './src/components/LoadingState';
import ErrorState from './src/components/ErrorState';
import EmptyState from './src/components/EmptyState';
import Banner from './src/components/Banner';

/**
 * Merge fresh API tasks into the current list:
 * - keeps locally-added tasks (ids the API doesn't know about)
 * - keeps the local completion toggle for API tasks already on screen
 */
function mergeWithApiTodos(currentTodos, apiTodos) {
  const localById = new Map(currentTodos.map((t) => [t.id, t]));
  const apiIds = new Set(apiTodos.map((t) => t.id));

  const localOnly = currentTodos.filter((t) => !apiIds.has(t.id));
  const mergedApi = apiTodos.map((apiItem) => {
    const existing = localById.get(apiItem.id);
    return existing ? { ...apiItem, completed: existing.completed } : apiItem;
  });

  return [...localOnly, ...mergedApi];
}

export default function App() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [refreshError, setRefreshError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * Helper to update todos state and persist to AsyncStorage
   */
  const updateAndPersistTodos = useCallback((updater) => {
    setTodos((prevTodos) => {
      const updated = updater(prevTodos);
      saveTodosToStorage(updated);
      return updated;
    });
  }, []);

  /**
   * Fetch initial tasks from API or local storage cache
   */
  const loadTasks = useCallback(async (forceApi = false) => {
    setIsLoading(true);
    setFetchError(null);
    setRefreshError(null);

    try {
      // Try reading from AsyncStorage bonus cache first
      const cachedTodos = forceApi ? null : await getTodosFromStorage();
      if (Array.isArray(cachedTodos)) {
        setTodos(cachedTodos);
        return;
      }

      // Fetch fresh tasks from JSONPlaceholder API
      const apiTodos = await getTodos();
      updateAndPersistTodos(() => apiTodos);
    } catch (err) {
      setFetchError(err);
    } finally {
      setIsLoading(false);
    }
  }, [updateAndPersistTodos]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  /**
   * Handle user-initiated refresh (via button or pull-to-refresh)
   */
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setRefreshError(null);

    try {
      const apiTodos = await getTodos();
      updateAndPersistTodos((current) => mergeWithApiTodos(current, apiTodos));
      setFetchError(null);
    } catch (err) {
      setRefreshError(
        isNetworkError(err)
          ? 'Could not sync latest tasks. Please check your internet connection.'
          : 'Could not sync tasks from the server. Please try again.'
      );
    } finally {
      setIsRefreshing(false);
    }
  }, [updateAndPersistTodos]);

  /**
   * Toggle task completion state locally
   */
  const handleToggleTodo = useCallback(
    (id) => {
      updateAndPersistTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    },
    [updateAndPersistTodos]
  );

  /**
   * Delete task locally
   */
  const handleDeleteTodo = useCallback(
    (id) => {
      updateAndPersistTodos((prevTodos) =>
        prevTodos.filter((todo) => todo.id !== id)
      );
    },
    [updateAndPersistTodos]
  );

  /**
   * Add a new task via POST /todos and add locally without reloading
   */
  const handleAddTodo = useCallback(
    async (title, onSuccess) => {
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const response = await createTodo(title);

        // JSONPlaceholder always returns the same fake id (201),
        // so generate a unique local id for list keys instead.
        const newTask = {
          id: Date.now(),
          title: response.title || title,
          completed: false,
          userId: response.userId || 1,
          isManual: true,
        };

        // Prepend the new task to the list
        updateAndPersistTodos((prevTodos) => [newTask, ...prevTodos]);
        onSuccess?.();
      } catch (err) {
        setSubmitError(
          isNetworkError(err)
            ? 'Cannot save new task to the server. Please check your internet connection.'
            : 'Failed to save new task to the server. Please try again.'
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [updateAndPersistTodos]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <TodoItem todo={item} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} />
    ),
    [handleToggleTodo, handleDeleteTodo]
  );

  const completedCount = useMemo(
    () => todos.filter((t) => t.completed).length,
    [todos]
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <View style={styles.container}>
          {/* Header Bar */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Tasks</Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={handleRefresh}
              activeOpacity={0.7}
              disabled={isLoading || isRefreshing}
              accessibilityLabel="Refresh tasks from server"
            >
              <Text style={styles.refreshButtonText}>
                {isRefreshing ? 'Refreshing...' : '↻ Refresh'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Refresh / Sync Error Banner (hidden when the full-screen ErrorState is already shown) */}
          {refreshError && !fetchError && (
            <Banner
              variant="warning"
              title="🔄 Refresh Failed"
              message={refreshError}
              onDismiss={() => setRefreshError(null)}
            />
          )}

          {/* Task Counter */}
          {!isLoading && !fetchError && (
            <View style={styles.counterRow}>
              <Text style={styles.counterText}>
                {todos.length} {todos.length === 1 ? 'task' : 'tasks'} •{' '}
                <Text style={styles.completedHighlight}>
                  {completedCount} completed
                </Text>
              </Text>
            </View>
          )}

          {/* Form to Add New Task */}
          <AddTodoForm onAddTodo={handleAddTodo} isSubmitting={isSubmitting} />

          {/* Submit / Add Task Error Banner */}
          {submitError && (
            <Banner
              variant="danger"
              title="⚠️ Cannot Add Task"
              message={submitError}
              onDismiss={() => setSubmitError(null)}
            />
          )}

          {/* Main List Section */}
          {isLoading ? (
            <LoadingState message="Fetching tasks from JSONPlaceholder..." />
          ) : fetchError ? (
            <ErrorState error={fetchError} onRetry={() => loadTasks(true)} />
          ) : (
            <FlatList
              data={todos}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderItem}
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              ListEmptyComponent={<EmptyState />}
              contentContainerStyle={todos.length === 0 ? styles.emptyListContainer : styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  refreshButton: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  refreshButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  counterText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  completedHighlight: {
    color: '#10B981',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
