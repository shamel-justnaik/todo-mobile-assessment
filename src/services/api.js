import { isOffline } from '../utils/network';

const BASE_URL = 'https://jsonplaceholder.typicode.com';
const REQUEST_TIMEOUT_MS = 6000;

/**
 * Fetch wrapper that fails fast when offline and aborts after a timeout,
 * so the UI never hangs in a loading state.
 */
async function fetchWithTimeout(url, options = {}) {
  if (isOffline()) {
    throw new Error('No internet connection.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Connection timed out. Please check your internet connection.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetch the first 10 tasks from JSONPlaceholder API
 */
export async function getTodos() {
  const response = await fetchWithTimeout(`${BASE_URL}/todos?_limit=10`);
  if (!response.ok) {
    throw new Error(`Failed to fetch tasks (HTTP ${response.status})`);
  }
  return await response.json();
}

/**
 * Submit a new task to JSONPlaceholder API
 * Note: JSONPlaceholder simulates creation and returns the created object with an ID (usually 201)
 */
export async function createTodo(title) {
  const response = await fetchWithTimeout(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: title.trim(),
      completed: false,
      userId: 1,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create task (HTTP ${response.status})`);
  }
  return await response.json();
}
