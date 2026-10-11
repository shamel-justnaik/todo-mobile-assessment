const NETWORK_ERROR_PATTERNS = [
  'fetch failed',
  'failed to fetch',
  'network', // covers "network request failed" / "network error"
  'unable to resolve host',
  'enotfound',
  'econnrefused',
  'offline',
  'internet',
  'connection',
];

/**
 * True when the browser/device reports it has no network connection
 */
export const isOffline = () =>
  typeof navigator !== 'undefined' && navigator.onLine === false;

/**
 * Check if an error (or the current device state) indicates a network failure
 */
export function isNetworkError(err) {
  if (isOffline() || err instanceof TypeError) return true;
  const msg = (typeof err === 'string' ? err : err?.message || '').toLowerCase();
  return NETWORK_ERROR_PATTERNS.some((pattern) => msg.includes(pattern));
}
